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

import { Avatar, Box, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Guild = () => {
    const [guilds, setGuilds] = useState(null);
    const navigate = useNavigate();  // Hook zum Navigieren verwenden

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/guilds`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        })            
        .then(response => response.json())
        .then(data => {
            // Filter the guilds where the user has 'MANAGE_GUILD' permission (0x20)
            const manageableGuilds = data.filter(guild => {
                const permissions = BigInt(guild.permissions_new || guild.permissions);
                return (permissions & BigInt(0x20)) === BigInt(0x20);
            });

            setGuilds(manageableGuilds);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);

    // Funktion zum Navigieren zur Guild-Seite
    const handleGuildClick = (guildId) => {
        navigate(`/guild/${guildId}`);
    };

    return (
        <Box>
            {guilds ? (
                <p>Test</p>
            ) : (
                <CircularProgress />
            )}
        </Box>
    );
};

export default Guild;