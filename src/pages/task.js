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
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, CardContent, Typography, Grid, Box, Button } from '@mui/material';
import axios from 'axios';

const TaskList = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`, {
                    withCredentials: true, // Ensures the backend handles authentication
                });

                setTasks(response.data.tasks || []);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError(err.response?.data?.error || 'Failed to fetch tasks.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const updateStatus = async (taskId, newStatus) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/tasks/${taskId}/status`,
                { newStatus },
                { withCredentials: true }
            );

            setTasks(tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            ));
        } catch (err) {
            console.error('Error updating task status:', err);
            setError(err.response?.data?.error || 'Failed to update status.');
        }
    };

    if (loading) {
        return (
          <div>
          <Navbar />
          <ContentArea>
          <Box
              sx={{
                  display: 'flex',
                  justifyContent: 'center',  // Centers horizontally
                  alignItems: 'center',      // Centers vertically
                  height: '100vh',           // Takes full viewport height
              }}
          >
              <CircularProgress color="primary" />
          </Box>
          </ContentArea>
      </div>
      
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <ContentArea>
                    <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                        {error}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={() => navigate('/open-ticket')}>
                            Create New Task
                        </Button>
                    </Box>
                </ContentArea>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <Box padding={2} sx={{ paddingLeft: { xs: 2, md: 33 }, paddingRight: { xs: 2, md: 2 } }}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} md={10}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Typography variant="h5" sx={{ flex: 1, textAlign: 'center', color: '#fafafa' }}>
                                Your Assigned Tasks
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => navigate('/open-ticket')}>
                                Create new Task
                            </Button>
                        </Box>

                        {tasks.map((task) => (
                            <Card key={task.id} sx={{ borderRadius: '10px', backgroundColor: '#1c1c1c', color: '#fff', mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ color: '#f5f5f5' }}>
                                        {task.headline}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#d1d1d1', mt: 1 }}>
                                        {task.description}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#bdbdbd', mt: 2 }}>
                                        <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString('en-GB')}
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: task.status === 'Complete' ? '#4caf50' : '#ff9800', mt: 2 }}>
                                        Status: {task.status}
                                    </Typography>

                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => updateStatus(task.id, 'In Progress')}
                                            disabled={task.status === 'In Progress'}
                                        >
                                            Start Task
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => updateStatus(task.id, 'On Hold')}
                                            disabled={task.status !== 'In Progress'}
                                        >
                                            On Hold
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default TaskList;
