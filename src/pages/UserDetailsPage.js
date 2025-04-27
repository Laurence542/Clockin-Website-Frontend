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
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const UserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    lastName: '',
    department: '',
    hourlyRate: '',
    employeeType: '',
    role: '',
    address: '',
    emergencyContact: '',
    gender: '',
    experience: '',
    streetName: '',
    city: '',
    county: '',
    country: '',
    mobilePhone: '',
  });

  // Set initial state to true so the spinner shows until data is fetched
  const [fetchingOptions, setFetchingOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch dynamic roles and departments from the backend
  const fetchOnboardData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/onboard-data`, { withCredentials: true });
      setRoles(response.data.roles || []);
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error('Error fetching onboard data:', error);
    } finally {
      setFetchingOptions(false);
    }
  };

  useEffect(() => {
    fetchOnboardData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/onboard/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ formData }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('User onboarded successfully!');
        navigate('/discordrequest');
      } else {
        alert(`Failed to onboard user: ${data.message}`);
      }
    } catch (error) {
      console.error('Error onboarding user:', error);
      alert('Failed to onboard user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ContentArea>
        {fetchingOptions ? (
 
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"  
          >
            <CircularProgress />
          </Box>
        ) : (
          // Once options are fetched, display the form
          <Box p={2} maxWidth={600} mx="auto" mt={2}>
            <Typography variant="h4" gutterBottom textAlign="center">
              Onboard {user?.name}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Second Name"
                name="secondName"
                value={formData.secondName}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                select
                fullWidth
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </TextField>
              
              <TextField
                select
                fullWidth
                name="department"
                value={formData.department}
                onChange={handleChange}
                margin="normal"
                required
                SelectProps={{ native: true }}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </TextField>
              
              <TextField
                fullWidth
                label="Hourly Rate (€)"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                select
                fullWidth
                name="role"
                value={formData.role}
                onChange={handleChange}
                margin="normal"
                required
                SelectProps={{ native: true }}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </TextField>
              
              <TextField
                fullWidth
                label="Experience"
                name="experience"
                value={formData.experience}
                type="number"
                onChange={handleChange}
                margin="normal"
              />

              <TextField
                select
                fullWidth
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                margin="normal"
                required
                SelectProps={{ native: true }}
              >
                <option value="">Select Employment Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Trial">Trial</option>
              </TextField>

              <TextField
                fullWidth
                label="Street Name"
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="City/Town"
                name="city"
                value={formData.city}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="County/Province"
                name="county"
                value={formData.county}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobilePhone"
                value={formData.mobilePhone}
                onChange={handleChange}
                margin="normal"
                type="number"
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Emergency Contact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                margin="normal"
                type="number"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Onboarding'}
              </Button>
            </form>
          </Box>
        )}
      </ContentArea>
    </>
  );
};

export default UserDetails;

