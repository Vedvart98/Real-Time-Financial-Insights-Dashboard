import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';

const router = express.Router();

//signup
router.post('/signup',async(req,res)=>{
try {
    const {username,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,12);

    const result = await pool.query('INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email',[username,email,hashedPassword]);
    res.json({user:result.rows[0]});
    
}
catch (err) {
     console.error("signup error:", err);
    res.status(500).json({ error: err.message });
}
});

//login
router.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
        const user = result.rows[0];
        if(!user) return res.status(400).json({error:'User not found'});
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({error:'Invalid password'});
 
        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET,{expiresIn:'1d'});
        res.json({token,user: {id:user.id , username:user.username , email:user.email}});
    } catch (err) { 
        console.error("login error:", err);
    res.status(500).json({ error: err.message });
    }
});
 
//logout
router.post('/logout',(req,res)=>{
    res.json({ message: 'Logged out successfully' });
})


//verify token middleware
export const verifyToken = (req,res,next)=>{
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json({error:'No token provided'});
    jwt.verify(token.split(" ")[1],process.env.JWT_SECRET,(err,decoded)=>{
        if(err) return res.status(401).json({ error: "Unauthorized" });
        req.userId =decoded.id;
        next();
    });
};
router.get('/me',verifyToken,async(req,res)=>{
    try {
        const result = await pool.query('SELECT id,username,email,created_at FROM users WHERE id=$1',[req.userId]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('me error',err);
        res.status(500).json({ error: err.message });
    }
})
export default router;