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
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'


const AdminSignup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, formData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/analytic');
            }, 2000);
        } catch (error) {
            console.error("Error during signup:", error);
            setError(error.response?.data?.error || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
            <img src="/header-logo.png" alt="Logo" className="logo" />
            <h2>Admin Signup</h2>
            {success ? (
                <p style={{ color: 'green' }}>Admin account created successfully. Redirecting to login...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                      <label className="register-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    
                        <label className='register-label'>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className='register-input'
                            required
                        />
        
                        <label className='register-label'>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className='register-input'
                            required
                        />
            
                    <button className='register-button' type="submit">Signup</button>
                </form>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        </div>
    );
};

export default AdminSignup;
