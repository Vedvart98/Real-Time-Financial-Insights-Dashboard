import './Profile.css';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Profile = () => {
    const [user,setUser]= useState(null);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    useEffect(()=>{
        const fetchUser= async()=>{
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3001/api/auth/me',{
                    headers:{Authorization: `Bearer ${token}`}
                })
                setUser(res.data);
            } catch (err) {
                setError("Failed to load profile. Please log in again.");
            }finally{
                setLoading(false);
            }
        };
        fetchUser();
    },[]);
    if (loading) return <div className="p-4 text-gray-600">Loading profile...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
 
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">{user.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="profile-info">
          <h2 className="profile-name">Welcome, {user.username}! 👋</h2>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="info-card">
          <h3 className="card-title">User Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">{new Date(user.created_at).toDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="settings-card">
          <h3 className="card-title">Account Settings</h3>
          <button className="logout-btn" onClick={()=>{
            localStorage.removeItem('token');
            window.location.href='/login';
          }}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Profile
