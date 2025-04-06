import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import Navbar from '../../components/Navbar';
import ContentArea from '../../components/ContentArea';

const UpdatePersonalInformation = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    email: "",
    experience: "",
    role: "",
    emergencyContact: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
            { withCredentials: true }
          );
          
        setUserData(response.data);
      } catch (err) {
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only include fields that you want to update
      const updatePayload = {
        firstName: userData.firstName,
        secondName: userData.secondName,
        lastName: userData.lastName,
        email: userData.email,
        experience: userData.experience,
        role: userData.role,
        emergencyContact: userData.emergencyContact,
      };
  
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
        updatePayload,
        { withCredentials: true }
      );
      alert("User updated successfully!");
      navigate(-1);
    } catch (err) {
      setError("Failed to update user.");
    }
  };
  

  return (
    <>
    <Navbar></Navbar>
    <ContentArea>
    <Box sx={{ maxWidth: "500px", margin: "2rem auto", padding: "20px", backgroundColor: "#2a2a2a", borderRadius: "10px" }}>
      <Typography variant="h5" align="center" sx={{ color: "#fafafa", mb: 2 }}>
        Update Personal Information
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="First Name" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} />
        <TextField fullWidth margin="normal" label="Second Name" value={userData.secondName} onChange={(e) => setUserData({ ...userData, secondName: e.target.value })} />
        <TextField fullWidth margin="normal" label="Last Name" value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} />
        <TextField fullWidth margin="normal" label="Email" type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
        <TextField fullWidth margin="normal" label="Experience" value={userData.experience} onChange={(e) => setUserData({ ...userData, experience: e.target.value })} />
        <TextField fullWidth margin="normal" label="Role" value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })} />
        <TextField fullWidth margin="normal" label="Emergency Contact" value={userData.emergencyContact} onChange={(e) => setUserData({ ...userData, emergencyContact: e.target.value })} />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Update
        </Button>
      </form>
    </Box>
    </ContentArea>
    </>
  );
};

export default UpdatePersonalInformation;
