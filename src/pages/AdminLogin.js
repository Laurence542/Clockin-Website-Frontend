/*
 ------------------------------------------------------------------------------
 ------------------------------------------------------------------------------
 Copyright @ 2024 Segritude LTD.
 All right reserved.
 This code and all related assets are the property of segritude LTD.
 Unauthorized copying, distribution, or modification of this file, 
 via any medium, is strictly prohibited.

 NOTE: Tampering with or removing this notice is prohibited. 
 Any attempt to circumvent this restriction will be subject to legal action.

 ------------------------------------------------------------------------------
 ------------------------------------------------------------------------------
*/ 


import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        setMessage('');
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password });

            localStorage.setItem('adminToken', response.data.token);
            setMessage(`Welcome, ${response.data.username}`);

            window.location.href = '/analytic'; 
        } catch (error) {
            console.error('Login error:', error); 
            setMessage(error.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <img src="/header-logo.png" alt="Logo" className="logo" />
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <label className="register-label">Email</label>
                    <input
                        className="register-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className="register-label">Password</label>
                    <input
                        className="register-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="register-button" type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;
