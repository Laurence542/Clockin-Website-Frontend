import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import YearCalendar from '../components/YearCalendar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CalendarView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [workHistory, setWorkHistory] = useState([]);
  const [timeOffRequests, setTimeOffRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  // New state for holiday details dialog
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [openHolidayDialog, setOpenHolidayDialog] = useState(false);

  // Filter state variables
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');

  // User name display: use firstName and secondName if available
  const [userName, setUserName] = useState('John Doe');

  useEffect(() => {
    const fetchWorkHistory = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
          { withCredentials: true }
        );
        setWorkHistory(response.data.workHistory || []);
        setTimeOffRequests(response.data.timeOffRequests || []);
        // Update userName to use firstName and secondName if available
        setUserName(
          response.data.firstName && response.data.secondName
            ? `${response.data.firstName} ${response.data.secondName}`
            : (response.data.username || 'John Doe')
        );
      } catch (error) {
        console.error('Error fetching work history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkHistory();
  }, [userId]);

  // Handle day click: open holiday dialog if the day is a holiday, else clock-in details
  const handleDayClick = (date) => {
    // Check for an approved holiday on this date
    const holiday = timeOffRequests.find((request) => {
      if (request.status !== 'approved') return false;
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      return date >= start && date <= end;
    });
    if (holiday) {
      setSelectedHoliday(holiday);
      setOpenHolidayDialog(true);
      return;
    }

    // Otherwise, check for clock-in sessions on the day
    const sessionsOnDate = workHistory.filter((session) => {
      if (!session.clockInTime) return false;
      const clockDate = new Date(session.clockInTime);
      return clockDate.toDateString() === date.toDateString();
    });
    if (sessionsOnDate.length > 0) {
      setSelectedSessions(sessionsOnDate);
      setOpenDialog(true);
    }
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedSessions([]);
  };

  const closeHolidayDialog = () => {
    setOpenHolidayDialog(false);
    setSelectedHoliday(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <ContentArea>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6">Loading Calendar...</Typography>
          </Box>
        </ContentArea>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ContentArea>
        <Box sx={{ maxWidth: '1200px', margin: '2rem auto' }}>
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* Left: Back Button */}
            <Box sx={{ flex: '1 0 auto' }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ color: '#fafafa' }}
              >
                Back
              </Button>
            </Box>

            {/* Center: User Names & Title */}
            <Box sx={{ flex: '1 1 auto', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fafafa' }}>
                {userName}
              </Typography>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: '#fafafa' }}
              >
                Yearly Calendar View
              </Typography>
            </Box>

            {/* Right: Filter Section */}
            <Box
              sx={{
                flex: '0 0 auto',
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
              }}
            >
              <TextField
                label="Year"
                type="number"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                InputProps={{ inputProps: { min: 1900, max: 2100 } }}
                size="small"
                variant="outlined"
                sx={{
                  backgroundColor: '#333',
                  borderRadius: 1,
                  '& .MuiInputLabel-root': {
                    color: '#fafafa',
                    marginBottom: '4px',
                  },
                  '& .MuiInputBase-input': {
                    color: '#fafafa',
                    padding: '15px',
                  },
                }}
              />
              <TextField
                label="Month"
                select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                size="small"
                variant="outlined"
                sx={{
                  minWidth: 100,
                  backgroundColor: '#333',
                  borderRadius: 1,
                  '& .MuiInputLabel-root': {
                    color: '#fafafa',
                    marginBottom: '4px',
                  },
                  '& .MuiInputBase-input': {
                    color: '#fafafa',
                    padding: '10px',
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="1">Jan</MenuItem>
                <MenuItem value="2">Feb</MenuItem>
                <MenuItem value="3">Mar</MenuItem>
                <MenuItem value="4">Apr</MenuItem>
                <MenuItem value="5">May</MenuItem>
                <MenuItem value="6">Jun</MenuItem>
                <MenuItem value="7">Jul</MenuItem>
                <MenuItem value="8">Aug</MenuItem>
                <MenuItem value="9">Sep</MenuItem>
                <MenuItem value="10">Oct</MenuItem>
                <MenuItem value="11">Nov</MenuItem>
                <MenuItem value="12">Dec</MenuItem>
              </TextField>
              <TextField
                label="Day"
                type="number"
                placeholder="1-31"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                InputProps={{ inputProps: { min: 1, max: 31 } }}
                size="small"
                variant="outlined"
                sx={{
                  backgroundColor: '#333',
                  borderRadius: 1,
                  '& .MuiInputLabel-root': {
                    color: '#fafafa',
                    marginBottom: '4px',
                  },
                  '& .MuiInputBase-input': {
                    color: '#fafafa',
                    padding: '10px',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Calendar Component */}
          <YearCalendar
            year={Number(filterYear)}
            workHistory={workHistory}
            timeOffRequests={timeOffRequests}
            onDayClick={handleDayClick}
            filterMonth={filterMonth ? Number(filterMonth) : null}
            filterDay={filterDay ? Number(filterDay) : null}
          />
        </Box>

        {/* Clock-in Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={closeDialog}
          PaperProps={{
            sx: {
              backgroundColor: '#222',
              borderRadius: 2,
              color: '#fafafa',
            },
          }}
        >
          <DialogTitle
            sx={{
              borderBottom: '1px solid #444',
              color: '#fafafa',
              fontWeight: 'bold',
            }}
          >
            Clock In Details
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              backgroundColor: '#333',
              color: '#fafafa',
              p: 2,
            }}
          >
            {selectedSessions.map((session, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid #444',
                  borderRadius: 2,
                  backgroundColor: '#222',
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  Task: {session.taskHeading}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Clock In: {new Date(session.clockInTime).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Clock Out: {new Date(session.clockOutTime).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Total Worked Time: {session.totalWorkedTime}
                </Typography>
                {session.totalBreakTime && (
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    Total Break Time: {session.totalBreakTime}
                  </Typography>
                )}
                {session.clockDates &&
                  session.clockDates.breaks &&
                  session.clockDates.breaks.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 'bold', color: '#fafafa' }}
                      >
                        Breaks:
                      </Typography>
                      {session.clockDates.breaks.map((brk, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{ color: '#ccc' }}
                        >
                          Break {idx + 1}:{' '}
                          {brk.breakStart
                            ? new Date(brk.breakStart).toLocaleTimeString()
                            : 'N/A'}{' '}
                          -{' '}
                          {brk.breakEnd
                            ? new Date(brk.breakEnd).toLocaleTimeString()
                            : 'N/A'}
                        </Typography>
                      ))}
                    </Box>
                  )}
              </Box>
            ))}
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: '#222',
              borderTop: '1px solid #444',
              p: 1,
            }}
          >
            <Button
              onClick={closeDialog}
              variant="contained"
              sx={{ backgroundColor: '#2e7d32', color: '#fafafa' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Holiday Details Dialog */}
        <Dialog
          open={openHolidayDialog}
          onClose={closeHolidayDialog}
          PaperProps={{
            sx: {
              backgroundColor: '#222',
              borderRadius: 2,
              color: '#fafafa',
            },
          }}
        >
          <DialogTitle
            sx={{
              borderBottom: '1px solid #444',
              color: '#fafafa',
              fontWeight: 'bold',
            }}
          >
            Holiday Details
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              backgroundColor: '#333',
              color: '#fafafa',
              p: 2,
            }}
          >
            {selectedHoliday && (
              <Box>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  Reason: {selectedHoliday.reason}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Start Date:{' '}
                  {new Date(selectedHoliday.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  End Date:{' '}
                  {new Date(selectedHoliday.endDate).toLocaleDateString()}
                </Typography>
                {selectedHoliday.note && (
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    Note: {selectedHoliday.note}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: '#222',
              borderTop: '1px solid #444',
              p: 1,
            }}
          >
            <Button
              onClick={closeHolidayDialog}
              variant="contained"
              sx={{ backgroundColor: '#2e7d32', color: '#fafafa' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </ContentArea>
    </>
  );
};

export default CalendarView;
