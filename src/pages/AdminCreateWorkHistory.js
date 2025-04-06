import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ContentArea from "../components/ContentArea";
import { TextField, Button, Container, Typography, Box, MenuItem } from "@mui/material";

const AddWorkSession = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
 
    workers: [
      {
        userId: "",
        clockInTime: "",
        clockOutTime: "",
        totalEarnings: "",
        workDescription: "",
        taskId: "",
        taskHeading: "",
        status: ""
      }
    ]
  });

  const [workers, setWorkers] = useState([]);

 
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/workers`, {
          withCredentials: true,
        });
        setWorkers(response.data.workers);
      } catch (error) {
        console.error("Error fetching workers:", error);
        alert("You need to approve workers from discord request.");
      }
    };

    fetchWorkers();
  }, []);

  // Function to calculate total earnings
  const calculateEarnings = (worker) => {
    if (!worker.clockInTime || !worker.clockOutTime || !worker.userId) return "";

    // Find the selected worker in the fetched workers array
    const selectedWorker = workers.find((w) => w.userId === worker.userId);
    if (!selectedWorker || !selectedWorker.hourlyRate) return "";

    const hourlyRate = parseFloat(selectedWorker.hourlyRate);
    if (isNaN(hourlyRate)) return "";

    const clockIn = new Date(worker.clockInTime);
    const clockOut = new Date(worker.clockOutTime);
    const totalHours = (clockOut - clockIn) / (1000 * 60 * 60); // Convert ms to hours
    if (totalHours <= 0) return "";

    return (totalHours * hourlyRate).toFixed(2);
  };

  // Handle input change
  const handleChange = (e, index, field) => {
    const newWorkers = [...formData.workers];
    newWorkers[index][field] = e.target.value;

    // Auto-calculate earnings if clock-in, clock-out, or userId changes
    if (["clockInTime", "clockOutTime", "userId"].includes(field)) {
      newWorkers[index].totalEarnings = calculateEarnings(newWorkers[index]);
    }

    setFormData({ ...formData, workers: newWorkers });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      // The backend determines the guild based on the authenticated user.
      workers: formData.workers.map((worker) => ({
        userId: worker.userId,
        taskId: worker.taskId,
        taskHeading: worker.taskHeading,
        clockInTime: worker.clockInTime,
        clockOutTime: worker.clockOutTime,
        totalEarnings: worker.totalEarnings,
        workDescription: worker.workDescription,
        status: worker.status || "Pending",
      })),
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/work-sessions/add-session`,
        formattedData,
        {
          withCredentials: true, // ensures cookies are sent
        }
      );

      alert("Work session added successfully!");
      // Reset the form state if needed
      setFormData({
        workers: [
          {
            userId: "",
            clockInTime: "",
            clockOutTime: "",
            totalEarnings: "",
            workDescription: "",
            taskId: "",
            taskHeading: "",
            status: "",
          },
        ],
      });
      // Navigate to /location after successful submission
      navigate("/contractor/workhistory");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to add work session.");
    }
  };

  return (
    <>
      <Navbar />
      <ContentArea>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ mt: 4, mb: 3, textAlign: "center" }}>
            Add Work Session
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {formData.workers.map((worker, index) => (
              <Box key={index} sx={{ p: 3, borderRadius: "8px", mb: 3 }}>
                {/* Worker Dropdown */}
                <TextField
                  label="Select Worker"
                  fullWidth
                  required
                  select
                  value={worker.userId}
                  onChange={(e) => handleChange(e, index, "userId")}
                  sx={{ mb: 2 }}
                >
                  {workers.length > 0 ? (
                    workers.map((w) => (
                      <MenuItem key={w.userId} value={w.userId}>
                        {w.firstName} {w.lastName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No workers available</MenuItem>
                  )}
                </TextField>

                {/* Clock In and Clock Out Time Fields */}
                <TextField
                  label="Clock In Time"
                  type="datetime-local"
                  fullWidth
                  required
                  value={worker.clockInTime}
                  onChange={(e) => handleChange(e, index, "clockInTime")}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Clock Out Time"
                  type="datetime-local"
                  fullWidth
                  required
                  value={worker.clockOutTime}
                  onChange={(e) => handleChange(e, index, "clockOutTime")}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />

                {/* Total Earnings (Auto-calculated) */}
                <TextField
                  label="Total Earnings"
                  type="number"
                  fullWidth
                  required
                  value={worker.totalEarnings}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Work Description"
                  fullWidth
                  required
                  rows={4}
                  multiline
                  value={worker.workDescription}
                  onChange={(e) => handleChange(e, index, "workDescription")}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Task ID"
                  fullWidth
                  required
                  value={worker.taskId}
                  onChange={(e) => handleChange(e, index, "taskId")}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Task Heading"
                  fullWidth
                  required
                  value={worker.taskHeading}
                  onChange={(e) => handleChange(e, index, "taskHeading")}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Status"
                  fullWidth
                  required
                  value={worker.status}
                  onChange={(e) => handleChange(e, index, "status")}
                  sx={{ mb: 2 }}
                />

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                  Submit
                </Button>
              </Box>
            ))}
          </Box>
        </Container>
      </ContentArea>
    </>
  );
};

export default AddWorkSession;
