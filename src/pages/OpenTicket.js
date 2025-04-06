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


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import axios from 'axios';

const OpenTicket = () => {
  const [formData, setFormData] = useState({
    headline: '',
    description: '',
    dueDate: '',
    priority: '',
    status: '',
  });

  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ticket`,
        formData,
        { withCredentials: true } // This sends the auth cookie to the backend
      );

      if (response.status === 201) {
        alert('Task created successfully!');
        setFormData({
          headline: '',
          description: '',
          dueDate: '',
          priority: '',
          status: '',
        });
        navigate('/my-task'); 
      } else {
        alert(`Failed to create task: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('An error occurred while submitting the task.');
    }
  };

  return (
    <div>
      <Navbar />
      <ContentArea>
      <Box
        sx={{
          maxWidth: '500px',
          margin: 'auto',
          mt: 4,
          padding: 2,
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create a New Task
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Note: Your administrator will be able to see the task you create.
        </Typography>
        <form onSubmit={handleSubmit}>
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
            select
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>
      </ContentArea>
    </div>
  );
};

export default OpenTicket;
