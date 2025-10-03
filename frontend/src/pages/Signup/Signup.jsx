import React, { useState } from 'react'
import axios from 'axios';
import './Signup.css';
const Signup = () => {
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [message,setMessage] = useState('');

    const handleSignup = async()=>{
        try {
            const res = await axios.post('http://localhost:3001/api/auth/signup',{username,email,password});
            setMessage(`Account created for ${res.data.user.username}. You can now login.`);
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (err) {
            setMessage(err.response?.data?.error || "Signup failed");
        }
    }
    const handleGoogle = ()=>{
      window.location.href='http://localhost:3001/auth/google';
    };
    const handleGithub=()=>{
      window.location.href='http://localhost:3001/auth/github';
    }
  return (
    <div className='signup-container'>
      <h3>Create Account</h3>
      <input type="text" placeholder='Enter your username' value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input type="email" placeholder='Enter your email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
        <input type="password" placeholder='Enter Your password' value={password} onChange={(e)=> setPassword(e.target.value)}/>
        <button onClick={handleSignup}>Sign up</button>
        <button onClick={handleGoogle}>Continue with Google</button>
        <button onClick={handleGithub}>Continue with Github</button>
        {message && <p>{message}</p>}
    </div>
  )
}

export default Signup;