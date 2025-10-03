import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (token && userParam) {
            try {
                localStorage.setItem('token', token);
                // Force a page reload to reinitialize auth context
                window.location.href = '/';
            } catch (err) {
                console.error('Error parsing user data:', err);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return <div>Authenticating...</div>;
};

export default AuthCallback;