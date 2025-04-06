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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TimeOff = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Function to get today's date in UTC (YYYY-MM-DD format)
    const getTodayUTC = () => {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
            .toISOString()
            .split('T')[0]; // Extract only the YYYY-MM-DD part
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const todayUTC = getTodayUTC();
    
        // Convert input dates to UTC
        const startDateUTC = new Date(startDate + "T00:00:00Z").toISOString();
        const endDateUTC = new Date(endDate + "T00:00:00Z").toISOString();
    
        // Validate start date
        if (startDateUTC < new Date(todayUTC).toISOString()) {
            setMessage('Your unavailable date cannot be before today.');
            setLoading(false);
            return;
        }
    
        // Validate end date
        if (endDateUTC < startDateUTC) {
            setMessage('End date cannot be before start date.');
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/time-off-requests`,
                { startDate: startDateUTC, endDate: endDateUTC, reason },
                { withCredentials: true } // Send cookies (authToken)
            );

            setMessage(response.data.message);
            setStartDate('');
            setEndDate('');
            setReason('');
        } catch (error) {
            console.error('Error submitting time-off request:', error.response?.data || error.message);
            setMessage(error.response?.data?.error || 'Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestListClick = () => {
        navigate('/my-requests');
    };

    return (
        <div>
            <Navbar />
            <Box
                padding={4}
                sx={{
                    paddingLeft: { xs: 2, md: 33 },
                    paddingRight: { xs: 2, md: 2 },
                }}
            >
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={8} md={6.2}>
                        <Card
                            sx={{
                                borderRadius: '10px',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: '#fff',
                                padding: 4,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    align="center"
                                    sx={{ color: '#fafafa' }}
                                >
                                    Request Time Off
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="From when are you going to be unavailable"
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                required
                                                sx={{
                                                    backgroundColor: '#333',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="When are you coming back?"
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                required
                                                sx={{
                                                    backgroundColor: '#333',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Why you need time off"
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                multiline
                                                rows={4}
                                                fullWidth
                                                required
                                                sx={{
                                                    backgroundColor: '#333',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} align="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                sx={{ width: '50%' }}
                                                disabled={loading}
                                            >
                                                {loading ? 'Submitting...' : 'Submit Request'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                                {message && (
                                    <Typography
                                        variant="body1"
                                        color="primary"
                                        align="center"
                                        mt={2}
                                    >
                                        {message}
                                    </Typography>
                                )}

                                <Grid item xs={12} align="center" mt={2}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleRequestListClick}
                                    >
                                        View Request List
                                    </Button>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default TimeOff;
