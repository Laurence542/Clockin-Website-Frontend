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
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import { Box, Typography, CircularProgress, Pagination, Button, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/WorkHistory.css';

const WorkHistory = () => {
    const [workHistory, setWorkHistory] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(5); 
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [minEarnings, setMinEarnings] = useState('');
    const [maxEarnings, setMaxEarnings] = useState('');
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetchWorkHistory();
    }, []);

    const fetchWorkHistory = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/work-history`, {
                params: filters,
                withCredentials: true, // Ensures auth token from cookies is sent
            });

            const sortedWorkHistory = response.data.sort(
                (a, b) => new Date(b.clockOutTime) - new Date(a.clockOutTime)
            );

            setWorkHistory(sortedWorkHistory);
        } catch (error) {
            console.error('Error fetching work history:', error);
            setError(error.response ? error.response.data.message : 'Failed to fetch work history');
        }
        setLoading(false);
    };
    
    const handleFilterSubmit = () => {
        fetchWorkHistory({
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
            minEarnings: minEarnings || null,
            maxEarnings: maxEarnings || null,
            keyword: keyword || null,
        });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = workHistory.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <Navbar />
            <ContentArea>
                <div className="work-history-container">
                    <h1 style={{ fontSize: '25px', marginTop: '-5px' }}>
                        <a href="/work-history" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                            Work History
                        </a>
                    </h1>

                    {/* Filters */}
                    <div className="filters-container">
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText="Start Date" className="filter-input" />
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} placeholderText="End Date" className="filter-input" />

                        <TextField
                            label="Keyword"
                            variant="outlined"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="filter-input"
                            InputProps={{
                                style: { backgroundColor: '#2a2a2a', color: '#fff', borderRadius: '8px' },
                            }}
                            InputLabelProps={{ style: { color: '#bbb' } }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFilterSubmit}
                            className="filter-button"
                            sx={{
                                backgroundColor: '#4caf50',
                                color: '#fff',
                                borderRadius: '8px',
                                ':hover': { backgroundColor: '#388e3c' },
                            }}
                        >
                            Search
                        </Button>
                    </div>

                    {/* Work History List */}
                    <div className="work-history-list">
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                                <CircularProgress color="primary" />
                            </Box>
                        ) : workHistory.length > 0 ? (
                            currentItems.map((session, index) => (
                                <div className="work-session-card" key={index}>
                                    <p style={{ color: '#bdbdbd' }}><strong>Heading: </strong> {session.taskHeading} </p>
                                    <p style={{ color: '#bdbdbd', whiteSpace: 'pre-line', maxWidth: '100%' }}>
                                        <strong>Work Description:</strong> {session.workDescription}
                                    </p>
                                    <p style={{ color: '#bdbdbd' }}>
                                        <strong>Clock In:</strong> {new Date(session.clockInTime).toLocaleString()}
                                    </p>
                                    <p style={{ color: '#bdbdbd' }}>
                                        <strong>Clock Out:</strong> {new Date(session.clockOutTime).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Total Worked Time: </strong> {session.totalWorkedTime}
                                    </p>
                                    <p style={{ color: 'yellow' }}><strong>Status:</strong> {session.status}</p>
                                    <p style={{ color: 'green' }}><strong>Total Earnings:</strong> €{session.totalEarnings.toFixed(2)}</p>
                                </div>
                            ))
                        ) : (
                            <p>No work history found.</p>
                        )}
                    </div>

                    {/* Pagination */}
                    <Box display="flex" justifyContent="center" marginTop={3}>
                        <Pagination count={Math.ceil(workHistory.length / itemsPerPage)} page={page} onChange={handlePageChange} color="primary" />
                    </Box>
                </div>
            </ContentArea>
        </>
    );
};

export default WorkHistory;
