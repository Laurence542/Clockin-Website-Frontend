import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, CardContent, Typography, Grid, Box, Button, FormControl,InputLabel ,MenuItem, Select } from '@mui/material';

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6; // Show 5 tasks per page

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };
  
  // Filter tasks based on selected status
  const filteredTasks = tasks.filter(task =>
    filter === 'All' ? task.status !== 'Cancel' : task.status === filter
  );
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/tasks`, {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent with request
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }

        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
}, []);


  // Updated updateStatus to use task._id
 const updateStatus = async (taskId, newStatus) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/admin/tasks/${taskId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // ensures cookies are sent
                body: JSON.stringify({ status: newStatus }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update task status.');
        }

        const updatedTask = await response.json();

        // Update local state with the new status
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, status: newStatus } : task
            )
        );

        console.log('Task status updated:', updatedTask);
    } catch (error) {
        console.error('Error updating task status:', error.message);
    }
};


    // Pagination Logic
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  if (loading) {
    return (
      <div>
        <Navbar />
        <ContentArea>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
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
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 5, color: '#fff' }}>
          {/* {error} */}
          No tasks available.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
            onClick={() => navigate('/create/task')}
          >
            Assign New Task
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
    
          {/* Dropdown Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'white' }}>Filter Tasks</InputLabel>
            <Select
              value={filter}
              onChange={handleFilterChange}
              sx={{ backgroundColor: '#1c1c1c', color: 'white', borderRadius: '5px' }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
              <MenuItem value="Cancel">Closed</MenuItem>
            </Select>
          </FormControl>

          {/* Title */}
          <Typography variant="h5" sx={{ flex: 1, textAlign: 'center', color: '#fafafa' }}>
            Contractor Tasks
          </Typography>

          {/* Create New Task Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
            onClick={() => navigate('/create/task')}
          >
            Assign New Task
          </Button>
        </Box>

        {/* Render Filtered Tasks or Show "No Tasks Found" */}
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <Card
              key={task._id}
              sx={{
                borderRadius: '10px',
                backgroundColor: '#1c1c1c',
                color: '#fff',
                mb: 2,
                maxWidth: '100%', // Prevents card from stretching
                wordBreak: 'break-word', // Ensures text does not overflow
              }}
            >
              <CardContent
                sx={{
                  padding: 2,
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal', // Ensures text wraps correctly
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: '#f5f5f5',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  {task.headline}
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
                  {task.description}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#bdbdbd', mt: 2, wordBreak: 'break-word' }}
                >
                  Due Date:{' '}
                  {new Date(task.dueDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Typography>
                <Typography variant="body1" sx={{ color: '#d1d1d1', mt: 2 }}>
                  Assign to: {task.assignedToName}
                </Typography>


                <Typography
                  variant="body1"
                  sx={{
                    color: '#d1d1d1',
                    mt: 2,
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  Department: {task.workerDepartment || 'N/A'}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#d1d1d1',
                    mt: 2,
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  Priority: {task.priority}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: task.status === 'Complete' ? '#4caf50' : '#ff9800',
                    mt: 2,
                    wordBreak: 'break-word',
                  }}
                >
                  Status: {task.status}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => updateStatus(task._id, 'In Progress')}
                    disabled={task.status === 'In Progress'}
                  >
                    Start Task
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => updateStatus(task._id, 'On Hold')}
                    disabled={task.status !== 'In Progress'}
                  >
                    On Hold
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => updateStatus(task._id, 'Cancel')}
                    disabled={task.status === 'Cancel'}
                  >
                    Cancel
                  </Button>
                </Box>
              </CardContent>
            </Card>

            ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 4, color: '#fff' }}>
              No tasks found for the selected filter.
            </Typography>
          )}


          </Grid>
        </Grid>
        {/* Pagination Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mx: 1 }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Typography variant="body1" sx={{ color: '#fff', mx: 2, display: 'flex', alignItems: 'center' }}>
                Page {currentPage} of {totalPages}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mx: 1 }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </Box>
      </Box>
    </div>
  );
};

export default TaskList;
