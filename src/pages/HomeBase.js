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
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardSummary.css';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import Card from './Card';
import axios from 'axios';
import { Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import CircularProgress from '@mui/material/CircularProgress';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function DashboardSummary() {
  const navigate = useNavigate();

  // State that is now solely controlled by backend responses.
  const [timerDetails, setTimerDetails] = useState({
    clockInTime: null,
    elapsedSeconds: 0,
    earnedAmount: "€0.00",
    isPaused: false,
    isClockedIn: false,
  });
  const [isNoTaskModalOpen, setIsNoTaskModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workDescription, setWorkDescription] = useState("");
  const [earnings, setEarnings] = useState({ today: 0, yesterday: 0, totalRevenue: 0 });
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [isCheckingVoiceState, setIsCheckingVoiceState] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedTaskHeading, setSelectedTaskHeading] = useState("");
  const [loading, setLoading] = useState(true);

  // Define fetchEarnings in the outer scope so handlers can use it.
  const fetchEarnings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/earnings`, {
        withCredentials: true,
      });
      setEarnings(response.data);
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    }
  };

  // Poll the backend for timer details every second.
  useEffect(() => {
    const fetchTimerDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/timer-details`, {
          withCredentials: true,
        });
        setTimerDetails(response.data);
      } catch (error) {
        console.error("Error fetching timer details:", error);
      }
    };

    fetchTimerDetails();
    const interval = setInterval(fetchTimerDetails, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weekly/monthly charts and tasks on mount.
  useEffect(() => {
    const fetchWeeklyEarnings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/earnings/week`, {
          withCredentials: true,
        });
        setWeeklyEarnings(response.data.weeklyEarnings);
      } catch (error) {
        console.error("Error fetching weekly earnings data:", error);
      }
    };

    const fetchMonthlyEarnings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/earnings/month`, {
          withCredentials: true,
        });
        setMonthlyEarnings(response.data.monthlyEarnings);
      } catch (error) {
        console.error("Error fetching monthly earnings data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-tasks`, {
          withCredentials: true,
        });
        setTasks(response.data.taskHeadings);
      } catch (error) {
        console.error("Error fetching user tasks:", error.message);
      }
    };

    fetchEarnings();
    fetchWeeklyEarnings();
    fetchMonthlyEarnings();
    fetchUserTasks();
  }, []);

  // Chart data definitions.
  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Weekly Earnings (€)',
        data: weeklyEarnings,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Earnings (€)',
        data: monthlyEarnings,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  // Helper to format elapsed seconds into HH:MM:SS.
  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  // Handler for clocking in or out.
  const handleClockToggle = async () => {
    if (!timerDetails.clockInTime) {
      setIsCheckingVoiceState(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/clockin`, { withCredentials: true });
        alert(response.data.message);
        // The new timer state will be updated by the polling.
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to clock in. Please try again.';
        if (errorMessage === 'No tasks found for this guild.') {
          setIsNoTaskModalOpen(true);
        } else {
          alert(errorMessage);
        }
      } finally {
        setIsCheckingVoiceState(false);
      }
    } else {
      // Open modal when already clocked in.
      setIsModalOpen(true);
    }
  };

  // Handler for pausing/resuming work.
  const handlePauseToggle = async () => {
    try {
      if (timerDetails.isPaused) {
        const voiceCheckResponse = await axios.get(`${process.env.REACT_APP_API_URL}/check-voice-channel`, {
          withCredentials: true,
        });
        if (voiceCheckResponse.data.inVoiceChannel) {
          const resumeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/update-status-to-work`, {
            withCredentials: true,
          });
          alert(resumeResponse.data.message);
        } else {
          alert('You must be in an allowed voice channel to continue working.');
        }
      } else {
        const breakResponse = await axios.get(`${process.env.REACT_APP_API_URL}/update-status-to-break`, {
          withCredentials: true,
        });
        alert(breakResponse.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status. Please try again.');
    }
  };

  // Handle task selection change.
  const handleTaskChange = (e) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTaskHeading(task?.headline || "");
  };

  // Handler for modal submission when clocking out (task complete).
  const handleModalSubmit = async () => {
    if (!selectedTaskId) {
      alert('Please select a task.');
      return;
    }
    if (!workDescription) {
      alert('Work description can’t be empty');
      return;
    }
    // Using a simple word count; adjust as needed.
    if (workDescription.split(' ').length < 50) {
      alert('Make sure you have more than 100 words in your work description');
      return;
    }
    const clockInTimeISOString = timerDetails.clockInTime
      ? new Date(timerDetails.clockInTime).toISOString()
      : new Date().toISOString();
    const clockOutTime = new Date().toISOString();
    const earningsValue = timerDetails.earnedAmount.replace('€', '');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/clockout`,
        {
          clockInTime: clockInTimeISOString,
          clockOutTime,
          totalEarnings: earningsValue,
          workDescription,
          taskHeading: selectedTaskHeading,
          taskId: selectedTaskId,
          status: "Complete",
        },
        { withCredentials: true }
      );
      setTimerDetails({
        clockInTime: null,
        elapsedSeconds: 0,
        earnedAmount: "€0.00",
        isPaused: false,
        isClockedIn: false,
      });
      setWorkDescription("");
      setSelectedTaskId("");
      setIsModalOpen(false);
      fetchEarnings();
    } catch (error) {
      console.error("Error saving work session:", error);
      alert("Failed to save work session. Please try again.");
    }
  };

  // Handler for clocking out with "in progress" status.
  const handleClockOutInProgress = async () => {
    if (!selectedTaskId) {
      alert('Please select a task.');
      return;
    }
    if (!workDescription) {
      alert('Work description can’t be empty');
      return;
    }
    if (workDescription.split(' ').length < 50) {
      alert('Make sure you have more than 100 words in your work description');
      return;
    }
    const clockInTimeISOString = timerDetails.clockInTime
      ? new Date(timerDetails.clockInTime).toISOString()
      : new Date().toISOString();
    const clockOutTime = new Date().toISOString();
    const earningsValue = timerDetails.earnedAmount.replace('€', '');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/ClockOutInProgress`,
        {
          clockInTime: clockInTimeISOString,
          clockOutTime,
          totalEarnings: earningsValue,
          workDescription,
          taskHeading: selectedTaskHeading,
          taskId: selectedTaskId,
          status: "In progress",
        },
        { withCredentials: true }
      );
      setTimerDetails({
        clockInTime: null,
        elapsedSeconds: 0,
        earnedAmount: "€0.00",
        isPaused: false,
        isClockedIn: false,
      });
      setWorkDescription("");
      setSelectedTaskId("");
      setIsModalOpen(false);
      fetchEarnings();
    } catch (error) {
      console.error("Error saving work session:", error);
      alert("Failed to save work session. Please try again.");
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <ContentArea>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <CircularProgress size={40} color="primary" />
          </Box>
        ) : (
          <>
        {timerDetails.profileStatus === "Active" && (
          <>
              <div className="welcome-message">
                <h1>Welcome back! 😊👋</h1>
              </div>
              <div className="clock-in-container">
                <div className="clock-in-section">
                  <div className="earned-amount">{timerDetails.earnedAmount}</div>
                  <div className="button-group">
                    {timerDetails.clockInTime && (
                      <button className="pause-button" onClick={handlePauseToggle}>
                        {timerDetails.isPaused ? 'Continue Working' : 'Take a Break'}
                      </button>
                    )}
                    <button
                      className={`clock-in-button ${timerDetails.clockInTime ? 'clocked-in' : ''}`}
                      onClick={handleClockToggle}
                      disabled={isCheckingVoiceState}
                    >
                      {isCheckingVoiceState
                        ? 'Checking...'
                        : timerDetails.clockInTime
                        ? 'Clock Out'
                        : 'Clock In'}
                    </button>
                  </div>
                  <div className="total-time">{formatTime(timerDetails.elapsedSeconds)}</div>
                </div>
              </div>
            </>
          )}

            <div className="dashboard-summary">
              <Card title="Today" value={`€${earnings.today.toFixed(2)}`} change={25} timeframe="Last 30 days" />
              <Card title="Yesterday" value={`€${earnings.yesterday.toFixed(2)}`} change={-25} timeframe="Last 30 days" />
              <Card title="Total Balance" value={`€${earnings.totalRevenue.toFixed(2)}`} change={5} timeframe="Last 30 days" />
              <div className="chart-card">
                <h3>Weekly Earnings</h3>
                <Line data={weeklyChartData} />
              </div>
              <div className="chart-card">
                <h3>Monthly Earnings</h3>
                <Line data={monthlyChartData} />
              </div>
            </div>
          </>
        )}
        {isModalOpen && (
          <div className="alert-modal">
            <div className="alert-content">
              <h2>Work Description</h2>
              <select value={selectedTaskId} onChange={handleTaskChange} required>
                <option value="">Select a Task</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.headline}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Describe the work done during this session"
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                required
              />
              <div className="alert-buttons">
                <button onClick={handleModalSubmit}>Completed Task</button>
                <button onClick={handleClockOutInProgress}>Clock Out (in progress)</button>
                <button onClick={handleModalCancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </ContentArea>
    </>
  );
}

export default DashboardSummary;
