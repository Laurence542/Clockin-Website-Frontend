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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const Callback = () => {
    const navigate = useNavigate();
    const [guilds, setGuilds] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState('');
    const [message, setMessage] = useState('Welcome to your dashboard!');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/user/guilds`, { withCredentials: true })
            .then(response => {
                setGuilds(response.data.guilds);
            })
            .catch(err => {
                console.error('Failed to fetch guilds:', err);
                setError('Failed to retrieve guilds from the database.');
            })
            .finally(() => {
                setLoading(false);  // Stop loading when done
            });
    }, []);

    const handleGuildSelect = async (guildId, isOwner) => {
    try {
        // // Save to local storage
        // localStorage.setItem('selectedGuildId', guildId);

        // Send to backend
        await axios.post(
            `${process.env.REACT_APP_API_URL}/api/user/select-guild`,
            { guildId },
            { withCredentials: true }
        );

        // Navigate based on user type
        navigate(isOwner ? `/analytic` : `/dashboard`);
    } catch (error) {
        console.error('Failed to save selected guild:', error);
        alert('Failed to save the selected guild. Please try again.');
    }
};


    const getGuildInitials = (name) => {
        if (!name) return '';
        const words = name.split(' ');
        return words.length > 1
            ? words[0][0] + words[1][0]
            : name.substring(0, 2);
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212' }}>
            <p style={{ fontSize: '18px', color: 'white' }}>✔️ {message}</p>
            <p style={{ fontSize: '18px', color: 'white', marginTop: '0px' }}>Your Guilds Selection</p>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? (  // Show loading spinner while fetching data
                <CircularProgress style={{ color: '#5865f2', margin: '20px' }} />
            ) : guilds.length > 0 ? (
                <div style={{ width: '100%', maxWidth: '800px', marginTop: '30px' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        {guilds.map((guild) => (
                            <div
                                key={guild.id}
                                onClick={() => handleGuildSelect(guild.id, guild.isOwner)}
                                style={{
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    border: '1px solid #333',
                                    borderRadius: '10px',
                                    padding: '15px',
                                    backgroundColor: '#1c1c1e',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                    textAlign: 'center',
                                    color: 'white',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                                }}
                            >
                                {guild.icon ? (
                                    <img
                                        src={guild.icon}
                                        alt={guild.name}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            marginBottom: '10px',
                                            border: '2px solid #5865f2',
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: '#5865f2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '10px',
                                            color: 'white',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {getGuildInitials(guild.name)}
                                    </div>
                                )}

                                <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{guild.name}</h3>
                                <p style={{ fontSize: '14px', color: '#aaa' }}>ID: {guild.id}</p>
                                {guild.isOwner && (
                                    <p style={{ fontSize: '12px', color: '#4caf50' }}>⭐ You are the Owner</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p style={{ fontSize: '16px', color: 'white', marginTop: '20px' }}>No guilds found. Join a server to see it here!</p>
            )}
        </div>
    );
};

export default Callback;

