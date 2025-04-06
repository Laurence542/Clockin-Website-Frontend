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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem, ListItemText, CircularProgress, Divider } from '@mui/material';

export default function LogoComponent() {
    const [guilds, setGuilds] = useState([]);
    const [selectedGuild, setSelectedGuild] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGuilds = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/guilds`, {
                    withCredentials: true
                });

                const { guilds, selectedGuild } = response.data;

                setGuilds(guilds);
                if (selectedGuild) {
                    setSelectedGuild(selectedGuild);
                }
            } catch (err) {
                setError('Failed to load your guilds.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGuilds();
    }, []);

    const handleChange = async (event) => {
        const guildId = event.target.value;
        setSelectedGuild(guildId);

        const selectedGuildData = guilds.find(guild => guild.id === guildId);

        if (!selectedGuildData) {
            alert('Selected guild not found.');
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/user/select-guild`,
                { guildId },
                { withCredentials: true }
            );

            // Navigate based on ownership status
            if (selectedGuildData.isOwner) {
                navigate(`/analytic`);
            } else {
                navigate(`/dashboard`);
            }

        } catch (error) {
            console.error('Failed to update selected guild:', error);
            alert('Failed to update guild. Please try again.');
        }
    };

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <Select
                id="guild-select"
                value={selectedGuild}
                onChange={handleChange}
                displayEmpty
                fullWidth
                sx={{ maxHeight: 56, width: 215 }}
            >
                <MenuItem value="" disabled>Select Your Guild</MenuItem>
                <Divider sx={{ mx: -1 }} />

                {loading ? (
                    <MenuItem disabled>
                        <CircularProgress size={24} />
                    </MenuItem>
                ) : guilds.length > 0 ? (
                    guilds.map((guild) => (
                        <MenuItem key={guild.id} value={guild.id}>
                            <ListItemText 
                                primary={guild.name} 
                                secondary={guild.isOwner ? 'Owner' : 'Member'} 
                            />
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No guilds available</MenuItem>
                )}
            </Select>
        </div>
    );
}
