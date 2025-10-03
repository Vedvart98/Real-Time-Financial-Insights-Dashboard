import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Initialize user from token on app load
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const res = await axios.get('http://localhost:3001/api/auth/me', {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });
                    setUser(res.data);
                    setToken(storedToken);
                } catch (err) {
                    console.error('Token validation failed:', err);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async(email, password) => {
        const res = await axios.post('http://localhost:3001/api/auth/login',{email,password});
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:3001/api/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!user && !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};