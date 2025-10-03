import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import pool from '../utils/db.js';
import dotenv from 'dotenv';
dotenv.config();

export default function setupPassport(){
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:'/auth/google/callback'
    }, async(accessToken, refreshToken, profile, done)=>{
        try {
            const provider = 'google';
            const provider_id = profile.id;
            const username = profile.displayName || profile.emails?.[0]?.value;
            const email = profile.emails?.[0]?.value || null;
            const avatar = profile.photos?.[0]?.value || null;
        
             const existing = await pool.query(
        "SELECT * FROM users WHERE provider = $1 AND provider_id = $2",
        [provider, provider_id]
      );
      if (existing.rows.length > 0) {
        return done(null, existing.rows[0]);
      }
      if (email) {
        const byEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (byEmail.rows.length > 0) {
          const user = byEmail.rows[0];
          // update provider fields
          await pool.query(
            "UPDATE users SET provider=$1, provider_id=$2, avatar_url=$3 WHERE id=$4",
            [provider, provider_id, avatar, user.id]
          );
          const updated = (await pool.query("SELECT * FROM users WHERE id=$1",[user.id])).rows[0];
          return done(null, updated);
        }
      }
      const result = await pool.query(
        "INSERT INTO users (provider, provider_id, username, email, avatar_url) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [provider, provider_id, username, email, avatar]
      );
      done(null, result.rows[0]);

        } catch (err) {
            done(err, null);
        }
    }))
    passport.use(new GithubStrategy({
        clientID:process.env.GITHUB_CLIENT_ID,
        clientSecret:process.env.GITHUB_CLIENT_SECRET,
        callbackURL:'/auth/github/callback',
        scope:['user:email']
    }, async(accessToken,refreshToken,profile,done)=>{
        try {
            const provider = 'github';
            const provider_id= profile.id;
            const username = profile.username || profile.displayName;
            const email = profile.emails?.[0]?.value || null;
            const avatar = profile.photos?.[0]?.value || null;

            const existing = await pool.query(
        "SELECT * FROM users WHERE provider = $1 AND provider_id = $2",
        [provider, provider_id]
      );
            if (existing.rows.length > 0) return done(null, existing.rows[0]);
    if (email) {
        const byEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (byEmail.rows.length > 0) {
          const user = byEmail.rows[0];
          await pool.query(
            "UPDATE users SET provider=$1, provider_id=$2, avatar_url=$3 WHERE id=$4",
            [provider, provider_id, avatar, user.id]
          );
          const updated = (await pool.query("SELECT * FROM users WHERE id=$1",[user.id])).rows[0];
          return done(null, updated);
        }
      }
      const result = await pool.query(
        "INSERT INTO users (provider, provider_id, username, email, avatar_url) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [provider, provider_id, username, email, avatar]
      );
      done(null, result.rows[0]);
        } catch (err) {
            done(err, null);
        }
    }));
    passport.serializeUser((user,done)=> done(null,user.id));
    passport.deserializeUser(async(id, done)=>{
        try {
      const res = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
      done(null, res.rows[0]);
    } catch (err) {
      done(err, null);
    }
    })
}
