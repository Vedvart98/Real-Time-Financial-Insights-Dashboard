import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();
//google
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback',passport.authenticate('google',{session:false, failureRedirect:'/login'}),
(req,res)=>{
    const user = req.user;
    const token = jwt.sign({id:user.id, email:user.email,},process.env.JWT_SECRET,{expiresIn:'7d'});
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({id: user.id, username: user.username, email: user.email}))}`);
});

//github
router.get('/github',passport.authenticate('github',{scope:['user:email']}));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login'}),
(req,res)=>{
    const user = req.user;
    const token = jwt.sign({id:user.id, email:user.email}, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({id: user.id, username: user.username, email: user.email}))}`);
}
);
router.get('/failure',(req,res)=>{
    res.status(401).send('Authentication failed');
});
export default router;