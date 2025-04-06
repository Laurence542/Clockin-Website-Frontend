import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid
} from '@mui/material';

// Helper to format minutes into "Hh Mm"
const formatMinutes = (total) => {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${hours}h ${minutes}m`;
};

// Helper to format a time in 24-hour format (or return empty string)
const formatTime = (time) => {
  if (!time) return '';
  return new Date(time).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Helper: parse a string like "10 hours 1 minutes" and return total minutes
const parseTimeString = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+)\s*hours?\s*(\d+)\s*minutes?/i);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 + minutes;
  }
  return 0;
};

const YearCalendar = ({
  year = new Date().getFullYear(),
  workHistory = [],
  timeOffRequests = [],
  onDayClick,
  filterMonth,
  filterDay,
}) => {
  // Returns true if the date is within any approved timeOffRequest.
  const isHolidayForDate = (date) => {
    return timeOffRequests.some((request) => {
      if (request.status !== 'approved') return false;
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      return date >= start && date <= end;
    });
  };

  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    if (filterMonth && filterMonth !== monthIndex + 1) return null;

    const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'short' });
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const daysArray = Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const day = dayIndex + 1;
      if (filterDay && day !== filterDay) return null;
      const currentDate = new Date(year, monthIndex, day);
      const weekdayShort = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
      const weekdayMapping = {
        Mon: "Mon",
        Tue: "Tue",
        Wed: "Wed",
        Thu: "Thu",
        Fri: "Fri",
        Sat: "Sat",
        Sun: "Sun"
      };
      const weekday = weekdayMapping[weekdayShort] || weekdayShort;
      return { label: `${day} ${weekday}`, date: currentDate };
    }).filter(day => day !== null);

    return (
      <Box
        key={monthIndex}
        sx={{
          border: '1px solid #444',
          p: 0.5,
          backgroundColor: '#222',
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: '#fafafa', mb: 0.5, fontSize: '1rem' }}>
          {monthName} {year}
        </Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: '#333' }}>
          <Table sx={{ width: '100%', tableLayout: 'fixed' }} aria-label="day table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fafafa', fontWeight: 'bold', fontSize: '0.7rem', padding: 0.5 }}>Day</TableCell>
                <TableCell sx={{ color: '#fafafa', fontWeight: 'bold', fontSize: '0.7rem', padding: 0.5 }}>Clock In</TableCell>
                <TableCell sx={{ color: '#fafafa', fontWeight: 'bold', fontSize: '0.7rem', padding: 0.5 }}>Clock Out</TableCell>
                <TableCell sx={{ color: '#fafafa', fontWeight: 'bold', fontSize: '0.7rem', padding: 0.5 }}>Break</TableCell>
                <TableCell sx={{ color: '#fafafa', fontWeight: 'bold', fontSize: '0.7rem', padding: 0.5 }}>T.Work</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {daysArray.map((dayObj, idx) => {
                const isHoliday = isHolidayForDate(dayObj.date);
                const holidayCellStyle = isHoliday
                  ? { backgroundColor: '#FFEB3B', color: '#000', fontSize: '0.65rem', padding: 0.5, border: 'none' }
                  : { color: '#fafafa', fontSize: '0.65rem', padding: 0.5 };

                // Get all clock-in sessions for the day.
                const sessionsForDay = workHistory.filter((session) => {
                  if (!session.clockInTime) return false;
                  const clockDate = new Date(session.clockInTime);
                  return clockDate.toDateString() === dayObj.date.toDateString();
                });

                // Prepare day label with holiday indication.
                const dayLabelContent = (
                  <>
                    {dayObj.label}
                    {isHoliday && (
                      <>
                        <br />
                        <span style={{ color: '#FFEB3B', fontSize: '0.65rem' }}>Holiday</span>
                      </>
                    )}
                  </>
                );

                // If no sessions for the day, display a single row.
                if (sessionsForDay.length === 0) {
                  return (
                    <TableRow
                      key={idx}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => onDayClick && onDayClick(dayObj.date)}
                    >
                      <TableCell sx={{ color: '#fafafa', fontSize: '0.65rem', padding: 0.5 }}>
                        {dayLabelContent}
                      </TableCell>
                      <TableCell sx={holidayCellStyle} />
                      <TableCell sx={holidayCellStyle} />
                      <TableCell sx={holidayCellStyle} />
                      <TableCell sx={holidayCellStyle} />
                    </TableRow>
                  );
                }

                // If there are sessions, display the first session in a row with the day label cell spanning multiple rows.
                return (
                  <React.Fragment key={idx}>
                    <TableRow
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => onDayClick && onDayClick(dayObj.date)}
                    >
                      <TableCell rowSpan={sessionsForDay.length} sx={{ color: '#fafafa', fontSize: '0.65rem', padding: 0.5 }}>
                        {dayLabelContent}
                      </TableCell>
                      <TableCell sx={holidayCellStyle}>
                        {formatTime(sessionsForDay[0].clockInTime)}
                      </TableCell>
                      <TableCell sx={holidayCellStyle}>
                        {formatTime(sessionsForDay[0].clockOutTime)}
                      </TableCell>
                      <TableCell sx={holidayCellStyle}>
                        {sessionsForDay[0].totalBreakTime
                          ? formatMinutes(parseTimeString(sessionsForDay[0].totalBreakTime))
                          : ''}
                      </TableCell>
                      <TableCell sx={holidayCellStyle}>
                        {sessionsForDay[0].totalWorkedTime
                          ? formatMinutes(parseTimeString(sessionsForDay[0].totalWorkedTime))
                          : ''}
                      </TableCell>
                    </TableRow>
                    {sessionsForDay.slice(1).map((session, sIndex) => (
                      <TableRow
                        key={`${idx}-${sIndex + 1}`}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => onDayClick && onDayClick(dayObj.date)}
                      >
                        <TableCell sx={holidayCellStyle}>
                          {formatTime(session.clockInTime)}
                        </TableCell>
                        <TableCell sx={holidayCellStyle}>
                          {formatTime(session.clockOutTime)}
                        </TableCell>
                        <TableCell sx={holidayCellStyle}>
                          {session.totalBreakTime
                            ? formatMinutes(parseTimeString(session.totalBreakTime))
                            : ''}
                        </TableCell>
                        <TableCell sx={holidayCellStyle}>
                          {session.totalWorkedTime
                            ? formatMinutes(parseTimeString(session.totalWorkedTime))
                            : ''}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  });

  const filteredMonths = months.filter((month) => month !== null);

  return (
    <Box sx={{ width: '100%', backgroundColor: '#121212', p: 1 }}>
      <Grid container spacing={1}>
        {filteredMonths.map((month, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            {month}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default YearCalendar;
