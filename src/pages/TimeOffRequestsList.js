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
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    Pagination,
} from '@mui/material';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';

const fadeInAnimation = {
    animation: 'fadeIn 0.6s ease-out forwards',
};

const TimeOffRequestsList = () => {
    const [requests, setRequests] = useState([]); 
    const [filteredRequests, setFilteredRequests] = useState([]); 
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Remove the localStorage checks since the backend handles authentication and guild selection
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/time-off-requests/user`,
                    {
                        // Ensure credentials (cookies) are sent with the request
                        withCredentials: true,
                    }
                );
    
                const sortedRequests = response.data.sort(
                    (a, b) => new Date(b.submittedAt || b.startDate) - new Date(a.submittedAt || a.startDate)
                );
    
                setRequests(sortedRequests);
                setFilteredRequests(sortedRequests);
            } catch (err) {
                console.error('Fetch Error:', err.response?.data || err.message);
                // Use the error message sent by the backend if available
                setError(err.response?.data?.error || 'Failed to fetch time-off requests');
            } finally {
                setLoading(false);
            }
        };
    
        fetchRequests();
    }, []);
    

    const handleStatusFilterChange = (event) => {
        const filterValue = event.target.value;
        setStatusFilter(filterValue);

        let updatedRequests = requests;

        if (filterValue) {

            updatedRequests = requests.filter((request) => request.status === filterValue);
        }


        updatedRequests = updatedRequests.sort(
            (a, b) => new Date(b.submittedAt || b.startDate) - new Date(a.submittedAt || a.startDate)
        );
 


        setFilteredRequests(updatedRequests);
        setCurrentPage(1);
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'disapproved':
                return 'red';
            default:
                return 'gray';
        }
    };


    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <Navbar />
            <ContentArea>
            <Box
            >
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: '#fafafa',
                            flex: 1,
                            textAlign: 'center',
                            marginLeft: { xs: 2, md: 17 },
                        }}
                    >
                        Your Time-Off Requests
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <FormControl
                            sx={{ minWidth: 135, marginRight: { xs: 2, md: 12 } }}
                            variant="outlined"
                        >
                            <InputLabel>Status Filter</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                label="Status Filter"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="disapproved">Disapproved</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : error ? (
                    <Typography align="center" mb={2} marginRight="85px">
                        {error}
                    </Typography>
                ) : filteredRequests.length > 0 ? (
                    <>
                        <Grid container spacing={3} justifyContent="center">
                            {currentItems.map((request) => (
                                <Grid item xs={12} sm={10} md={10} key={request._id}>
                                    <Card
                                        sx={{
                                            backgroundColor: '#1c1c1e',
                                            color: '#fff',
                                            borderRadius: '10px',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.01)',
                                                boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
                                            },
                                            ...fadeInAnimation,
                                        }}
                                    >
                                        <CardContent>
                                           <Typography variant="body1" gutterBottom>
                                                <strong>Start Date:</strong> {new Date(request.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>End Date:</strong> {new Date(request.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Reason:</strong> {request.reason}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Submitted At:</strong> {new Date(request.submittedAt || request.startDate).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: getStatusColor(request.status),
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                <strong>Status:</strong> {request.status}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                count={Math.ceil(filteredRequests.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </>
                ) : (
                    <Typography align="center" sx={{ color: '#fafafa', marginTop: 2 }}>
                        No time-off requests found.
                    </Typography>
                )}
            </Box>
            </ContentArea>
        </div>
    );
};

export default TimeOffRequestsList;
