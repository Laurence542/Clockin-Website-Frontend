import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import { Box, TextField, Button, Typography, MenuItem, CircularProgress } from '@mui/material';

const OpenTicket = () => {
    const [formData, setFormData] = useState({
        workerId: '',
        headline: '',
        description: '',
        dueDate: '',
        priority: '',
        status: '',
    });

    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchWorkers = async () => {
          try {
              const response = await fetch(`${process.env.REACT_APP_API_URL}/workers`, {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
  
              const data = await response.json();
  
              if (response.ok) {
                  setWorkers(data.workers);
              } else {
                  alert(`You need to approve workers from discord request: ${data.error}`);
              }
          } catch (error) {
              console.error('Error fetching workers:', error);
              alert('An error occurred while fetching workers.');
          }
      };
  
      fetchWorkers();
  }, []);
  
  

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (selectedDate < today) {
          alert('Due date cannot be in the past.');
          setLoading(false);
          return;
      }
  
      const taskData = {
          workerId: formData.workerId,
          headline: formData.headline,
          description: formData.description,
          dueDate: selectedDate.toISOString(),
          priority: formData.priority,
          status: formData.status,
      };
  
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/ticket`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(taskData),
          });
  
          const result = await response.json();
  
          if (response.ok) {
              alert('Task created successfully!');
              setFormData({
                  workerId: '',
                  headline: '',
                  description: '',
                  dueDate: '',
                  priority: '',
                  status: '',
              });
              navigate('/contractor/task');
          } else {
              alert(result.error || 'Failed to create task.');
          }
      } catch (error) {
          console.error('Error submitting task:', error);
          alert('An error occurred while submitting the task.');
      } finally {
          setLoading(false);
      }
  };
  

    return (
        <div>
            <Navbar />
            <ContentArea>
                <Box sx={{ maxWidth: '500px', margin: 'auto', mt: 4, borderRadius: '8px' }}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        Assign a New Task
                    </Typography>

                    <form onSubmit={handleSubmit}>
                    <TextField
                        label="Select Contractor"
                        name="workerId"
                        value={formData.workerId}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        select
                        required
                    >
                        {workers.length > 0 ? (
                            workers.map((worker) => (
                                <MenuItem key={worker.userId} value={worker.userId}>
                                    {worker.firstName} {worker.lastName} 
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No workers available</MenuItem>
                        )}
                    </TextField>


                        <TextField
                            label="Headline"
                            name="headline"
                            value={formData.headline}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />

                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            required
                        />

                        <TextField
                            label="Due Date"
                            name="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            required
                        />

                        <TextField
                            label="Priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            select
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </TextField>

                        <TextField
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            select
                        >
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Complete">Complete</MenuItem>
                        </TextField>

                        <br />
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                        </Button>
                    </form>
                </Box>
            </ContentArea>
        </div>
    );
};

export default OpenTicket;
