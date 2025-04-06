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
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';

const GuildsSelection = () => {
    const [guilds, setGuilds] = useState(null);
    const navigate = useNavigate();  

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

    return (
        <Fragment>
            <Navbar />
            <ContentArea>
                <Box padding={8}>
                    {guilds ? (
                        <Grid container spacing={2}>
                            {guilds.map((guild) => (
                                <Grid item xs={12} sm={6} md={4} key={guild.id}>
                                    <Box 
                                        display="flex" 
                                        flexDirection="column" 
                                        alignItems="center" 
                                        p={2} 
                                        border={1} 
                                        borderRadius={8} 
                                        sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { backgroundColor: '#4d5157' } }} 
                                    >
                                        {guild.icon ? (
                                            <Avatar
                                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}
                                                sx={{ width: 64, height: 64 }}
                                            />
                                        ) : (
                                            <Avatar sx={{ width: 64, height: 64 }}>
                                                {guild.name[0]} 
                                            </Avatar>
                                        )}
                                        <Typography variant="h6" align="center" mt={2}>
                                            {guild.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
     
                        <Box 
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center" 
                            height="60vh" 
                        >
                            <CircularProgress color="primary" />
                        </Box>
                    )}
                </Box>
            </ContentArea>
        </Fragment>
    );
};

export default GuildsSelection;
