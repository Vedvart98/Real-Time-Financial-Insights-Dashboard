import React from 'react'
import axios from 'axios';
import './Login.css';
import { useContext } from 'react'
import { useState } from 'react';
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const {login} = useContext(AuthContext);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async ()=>{
        try {
            await login(email,password);
            alert('Login successful');
            navigate('/');
            // login(res.data.user,res.data.token);
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    }
    const handleGoogle= ()=>{
      window.location.href= 'http://localhost:3001/auth/google';
    };
    const handleGithub = ()=>{
      window.location.href = 'http://localhost:3001/auth/github';
    };

  return (
    <div className='login-container'>
      <h2>Login</h2> 
      <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>

      <div className="oauth">
        <button onClick={handleGoogle}>Sign in with google</button>
        <button onClick={handleGithub}>Sign in with Github</button>
      </div>
    </div>
  )
}

export default Login;
