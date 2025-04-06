import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import ContentArea from '../../../components/ContentArea';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Button, 
  FormControl,
  InputLabel,
  MenuItem,
  Select ,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const WorkHistory = () => {
  const navigate = useNavigate();
  const [workhistory, setWorkhistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("All");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchWorkHistory = async () => {
      try {
        setLoading(true);
        // No local storage for guild; backend determines it via authentication
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/admin/workhistory?page=${currentPage}&limit=${itemsPerPage}`,
          {
            method: 'GET',
            credentials: 'include', // ensure cookies/credentials are sent
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch work history: ${response.statusText}`);
        }

        const data = await response.json();
        setWorkhistory(data.workhistory || []);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching work history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkHistory();
  }, [currentPage]);

  // Filter the work history based on the selected filter
  const filteredWorkHistory = workhistory.filter((work) => {
    if (filter === "All") return true;
    return work.status === filter;
  });

  if (loading) {
    return (
      <div>
        <Navbar />
        <ContentArea>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80vh',
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
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4, color: '#ff5252' }}>
            {error}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Box>
        </ContentArea>
      </div>
    );
  }

  // If there are no work sessions, display only the no-sessions message.
  if (workhistory.length === 0) {
    return (
      <div>
        <Navbar />
        <ContentArea>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column', // Stack items vertically
              alignItems: 'center',
              justifyContent: 'center',
              mt: 4,
              gap: 2,
            }}
          >
            <Typography variant="body1" sx={{ color: '#fafafa' }}>
              No work sessions available at the moment.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
              onClick={() => navigate('/create/workhistory')}
            >
              Add new Work History
            </Button>
          </Box>
        </ContentArea>


      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ContentArea>
        <Box sx={{ maxWidth: "950px", margin: "0 auto", px: 2 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={10}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                
              <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
                <ArrowBackIcon />
                </IconButton>

                <Typography variant="h5" sx={{ flex: 1, textAlign: 'center', color: '#fafafa' }}>
                 Work History
                </Typography>
                

                {/* Dropdown Filter */}
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel sx={{ color: 'white' }}>Filter Tasks</InputLabel>
                  <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    sx={{ backgroundColor: '#1c1c1c', color: 'white', borderRadius: '5px' }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="In progress">In progress</MenuItem>
                    <MenuItem value="Complete">Complete</MenuItem>
                  </Select>
                </FormControl>

              </Box>

              {filteredWorkHistory
                .sort((a, b) => new Date(b.clockInTime) - new Date(a.clockInTime))
                .map((work, index) => (
                  <Card
                    key={index}
                    sx={{
                      borderRadius: '10px',
                      backgroundColor: '#1c1c1c',
                      color: '#fff',
                      mb: 2,
                      maxWidth: '100%', 
                      wordBreak: 'break-word',
                    }}
                  >
                    <CardContent
                      sx={{
                        padding: 2,
                        overflowWrap: 'break-word',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      <Typography variant="h5" sx={{ color: '#f5f5f5' }}>
                        {work.taskHeading || "No Task Heading"}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#d1d1d1',
                          mt: 1,
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal',
                        }}
                      >
                        {work.workDescription}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#d1d1d1',
                          mt: 1,
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal',
                        }}
                      >
                        Assigned to: {work.firstName ? `${work.firstName} ${work.secondName}` : "Unknown"}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#d1d1d1',
                          mt: 1,
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal',
                        }}
                      >
                        Role: {work.role || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#bdbdbd', mt: 2, wordBreak: 'break-word' }}
                      >
                        Clock-In:{' '}
                        {work.clockInTime
                          ? new Date(work.clockInTime).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true,
                            })
                          : 'N/A'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#bdbdbd', mt: 2, wordBreak: 'break-word' }}
                      >
                        Clock-Out:{' '}
                        {work.clockOutTime
                          ? new Date(work.clockOutTime).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true,
                            })
                          : 'N/A'}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#d1d1d1', mt: 1 }}>
                        Total Worked Time: {work.totalWorkedTime}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#d1d1d1', mt: 2 }}>
                        Total Earnings: ${work.totalEarnings ? work.totalEarnings.toFixed(2) : '0.00'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: work.status === 'Complete' ? '#4caf50' : '#ff9800',
                          mt: 2,
                          wordBreak: 'break-word',
                        }}
                      >
                        Status: {work.status || 'Pending'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button 
            variant="contained" 
            color="primary" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
            sx={{ mx: 1 }}
          >
            Previous
          </Button>

          <Typography variant="h6" sx={{ mx: 2, color: '#fafafa' }}>
            Page {currentPage} of {totalPages}
          </Typography>

          <Button 
            variant="contained" 
            color="primary" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
            sx={{ mx: 1 }}
          >
            Next
          </Button>
        </Box>
      </ContentArea>
    </div>
  );
};

export default WorkHistory;
