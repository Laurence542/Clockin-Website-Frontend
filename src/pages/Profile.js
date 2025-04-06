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
import { Avatar, Box, Typography, CircularProgress } from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/profile`, { withCredentials: true })
            .then(response => {
                setUserData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height="100vh"
                width="100vw" 
            >
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <>
            <Navbar />
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <Avatar 
                    src={`https://cdn.discordapp.com/avatars/${userData?.discordId || "defaultId"}/${userData?.avatar || "defaultAvatar"}.webp`}
                    alt={`${userData?.username || "Anonymous"}'s avatar`}
                    sx={{ width: 100, height: 100 }}
                />
                <Typography variant="h5" mt={2}>
                    {userData?.username || "Anonymous"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    {userData?.email || "No email available"}
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={2}>
                    Last Login: {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : "N/A"}
                </Typography>
            </Box>
        </>
    );
};

export default Profile;
