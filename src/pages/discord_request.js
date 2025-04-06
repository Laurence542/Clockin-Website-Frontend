import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, Typography, Button, CircularProgress, TextField } from '@mui/material';
import Navbara from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [filterStatus, setFilterStatus] = useState('Inactive'); // Default: Pending = Inactive
  const navigate = useNavigate();

  // Fetch users with optional status filter (if not "All")
  const fetchUsers = async () => {
    try {
      setLoading(true);
      let url = `${process.env.REACT_APP_API_URL}/users`;
      if (filterStatus && filterStatus !== 'All') {
        url += `?status=${filterStatus}`;
      }
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterStatus]);

  const handleApprove = (id) => {
    const user = users.find(user => user.id === id);
    if (user) {
      navigate(`/user-details/${id}`, { state: { user } });
    }
  };

  const handleDecline = async (id) => {
    if (!window.confirm("Are you sure you want to decline this user?")) {
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/decline/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
    
      if (response.ok) {
        alert('User declined successfully');
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      } else {
        alert('Error declining user');
      }
    } catch (error) {
      console.error('Error declining user:', error);
      alert('Failed to decline user');
    }
  };
  
  return (
    <div>
      <Navbara />
      <ContentArea>
        <Box
          bgcolor="linear-gradient(to right, #232526, #414345)"
          minHeight="100vh"
          py={2}
        >
          {/* Filter Dropdown */}
          <Box sx={{ mb: 2, textAlign: 'center' }}>
          <TextField
            select
            label="Filter by status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="Inactive">Pending</option>
            <option value="Decline">Declined</option>
          </TextField>

          </Box>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress size={50} color="primary" />
            </Box>
          ) : (
            <Grid container justifyContent="center" spacing={3}>
              {users.length === 0 ? (
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography variant="h6" color="text.primary" textAlign="center">
                      All is good! No pending users at the moment.
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                users.map((user) => (
                  <Grid item key={user.id} xs={12} sm={10} md={10} lg={8}>
                    <UserCard user={user} onApprove={handleApprove} onDecline={handleDecline} />
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Box>
      </ContentArea>
    </div>
  );
};

const UserCard = ({ user, onApprove, onDecline }) => {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '95%', md: 1100, lg: 1200, xl: 1400 },
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        margin: '0 auto',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        flexShrink={0}
        mr={{ sm: 3, xs: 0 }}
        mb={{ xs: 2, sm: 0 }}
      >
        <Box
          component="img"
          src={
            user.profilePicture ||
            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
          }
          alt={`${user.name}'s avatar`}
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid #1976d2',
          }}
        />
      </Box>
  
      <Box flexGrow={1}>
        <Typography variant="h6" fontWeight="bold">
          {user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.location}
        </Typography>
        <Typography variant="body2" color="text.secondary" my={1}>
          <strong>Email:</strong> {user.email}
        </Typography>
      </Box>
  
      <Box
        display="flex"
        flexDirection={{ xs: 'row', sm: 'column' }}
        justifyContent="center"
        alignItems="center"
        mt={{ xs: 2, sm: 0 }}
        ml={{ sm: 3, xs: 0 }}
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ mb: { sm: 1, xs: 0 }, mr: { xs: 1, sm: 0 } }}
          onClick={() => onApprove(user.id)}
        >
          Onboard
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => onDecline(user.id)}
        >
          Decline
        </Button>
      </Box>
    </Card>
  );
};

export default App;
