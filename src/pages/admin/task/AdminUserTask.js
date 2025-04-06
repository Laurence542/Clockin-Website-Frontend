import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import ContentArea from "../../../components/ContentArea";
import {
  CircularProgress,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Pagination,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const tasksPerPage = 10;

  // Helper function to format date to UK human-readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
          { withCredentials: true }
        );
        setUserDetail(response.data);
      } catch (err) {
        setError("Failed to fetch user details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  // Handler for the filter dropdown
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  // Filter tasks based on the selected filter
  const filteredTasks =
    userDetail && userDetail.tasks
      ? filter === "All"
        ? userDetail.tasks
        : userDetail.tasks.filter((task) => task.status === filter)
      : [];

  // Calculate pagination values
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (page - 1) * tasksPerPage,
    page * tasksPerPage
  );

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Updated updateStatus function that updates the task status in the local state
  const updateStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task status.");
      }

      const updatedTask = await response.json();

      // Update local state: update the task within userDetail.tasks
      setUserDetail((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        ),
      }));

      console.log("Task status updated:", updatedTask);
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <ContentArea>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "75vh",
            }}
          >
            <CircularProgress size={50} color="primary" />
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
          <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(-1)}
            >
              Back
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
        {/* Parent container with maxWidth 800px */}
        <Box sx={{ maxWidth: "800px", margin: "0 auto", px: 2 }}>
          {/* Header with Back Icon on Left, Heading in Center, and Filter on Right */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>

            <Typography
              variant="h4"
              align="center"
              sx={{ color: "#fafafa", flexGrow: 1 }}
            >
              {userDetail.firstName} All Tasks
            </Typography>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: "white" }}>Filter Tasks</InputLabel>
              <Select
                value={filter}
                onChange={handleFilterChange}
                sx={{
                  backgroundColor: "#1c1c1c",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
                <MenuItem value="Cancel">Closed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Tasks List */}
          {userDetail ? (
            <>
              {filteredTasks && filteredTasks.length > 0 ? (
                paginatedTasks.map((task) => (
                  <Card
                    key={task._id}
                    sx={{
                      borderRadius: "10px",
                      padding: "20px",
                      margin: "2rem auto",
                      backgroundColor: "#1c1c1c",
                      color: "#fff",
                      mb: 2,
                      maxWidth: "800px",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" sx={{ color: "#f5f5f5" }}>
                        {task.headline}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#d1d1d1", mt: 1 }}
                      >
                        {task.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#bdbdbd", mt: 2 }}
                      >
                        <strong>Due Date:</strong> {formatDate(task.dueDate)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            task.status === "Complete" ? "#4caf50" : "#ff9800",
                          mt: 2,
                        }}
                      >
                        Status: {task.status}
                      </Typography>
                      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() =>
                            updateStatus(task._id, "In Progress")
                          }
                          disabled={task.status === "In Progress"}
                        >
                          Start Task
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => updateStatus(task._id, "On Hold")}
                          disabled={task.status !== "In Progress"}
                        >
                          On Hold
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => updateStatus(task._id, "Cancel")}
                          disabled={task.status === "Cancel"}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" sx={{ color: "#fafafa" }}>
                  No tasks found.
                </Typography>
              )}

              {/* Pagination Component */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography variant="body1" sx={{ color: "#fafafa" }}>
              User details not available.
            </Typography>
          )}
        </Box>
      </ContentArea>
    </div>
  );
};

export default UserDetail;
