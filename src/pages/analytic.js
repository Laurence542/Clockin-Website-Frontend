import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Line } from 'react-chartjs-2';
import { 
  Chart, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend 
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function UserAnalytics() {
  // State for active users count, earnings and dynamic chart data.
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [earnings, setEarnings] = useState({
    todayEarnings: 0,
    yesterdayEarnings: 0,
    totalEarnings: 0,
  });
  const [weeklyEarnings, setWeeklyEarnings] = useState({ labels: [], earnings: [] });
  const [monthlyEarnings, setMonthlyEarnings] = useState({ labels: [], earnings: [] });
  const [loading, setLoading] = useState(true);

  // Fetch all required data concurrently.
  useEffect(() => {
    async function fetchData() {
      try {
        const [
          activeRes,
          earningsRes,
          weeklyRes,
          monthlyRes,
        ] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/activeUsersCount`, { credentials: 'include' }),
          fetch(`${process.env.REACT_APP_API_URL}/api/earnings`, { credentials: 'include' }),
          fetch(`${process.env.REACT_APP_API_URL}/api/weeklyEarnings`, { credentials: 'include' }),
          fetch(`${process.env.REACT_APP_API_URL}/api/monthlyEarnings`, { credentials: 'include' }),
        ]);
        const activeData = await activeRes.json();
        const earningsData = await earningsRes.json();
        const weeklyData = await weeklyRes.json();
        const monthlyData = await monthlyRes.json();
        setActiveUsersCount(activeData.count);
        setEarnings(earningsData);
        setWeeklyEarnings(weeklyData);
        setMonthlyEarnings(monthlyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Dynamic chart data for weekly earnings (displayed as a Line chart)
  const weeklyChartData = {
    labels: weeklyEarnings.labels.length 
      ? weeklyEarnings.labels 
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Weekly Earnings',
        data: weeklyEarnings.earnings.length 
          ? weeklyEarnings.earnings 
          : [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Dynamic chart data for monthly earnings (displayed as a Line chart)
  const monthlyChartData = {
    labels: monthlyEarnings.labels.length 
      ? monthlyEarnings.labels 
      : [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
    datasets: [
      {
        label: 'Monthly Earnings',
        data: monthlyEarnings.earnings.length 
          ? monthlyEarnings.earnings 
          : Array(12).fill(0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Earnings Chart',
      },
    },
  };

  // Show loading spinner if data is not yet available.
  if (loading) {
    return (
      <>
      <Navbar />
      <ContentArea>
      <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh' 
      }}>
        <CircularProgress color="primary" />
      </div>
      </ContentArea>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <Box padding={8} sx={{ paddingLeft: { xs: 2, md: 33 }, paddingRight: { xs: 2, md: 2 }}}>
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {/* Users Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1c1c1c', color: '#fff', height: '200px', borderRadius: '10px', border: '1px solid #808080' }}>
              <CardContent>
                <Typography variant="h6">Active Users</Typography>
                <Typography variant="h6">{activeUsersCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Today Earning Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1c1c1c', color: '#fff', height: '200px', borderRadius: '10px', border: '1px solid #808080' }}>
              <CardContent>
                <Typography variant="h6">Today Earning</Typography>
                <Typography variant="h6">€{earnings.todayEarnings.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Yesterday Earnings Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1c1c1c', color: '#fff', height: '200px', borderRadius: '10px', border: '1px solid #808080' }}>
              <CardContent>
                <Typography variant="h6">Yesterday Earning</Typography>
                <Typography variant="h6">€{earnings.yesterdayEarnings.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Earnings Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1c1c1c', color: '#fff', height: '200px', borderRadius: '10px', border: '1px solid #808080' }}>
              <CardContent>
                <Typography variant="h6">Total Earnings</Typography>
                <Typography variant="h6">€{earnings.totalEarnings.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Weekly Earnings Chart */}
          <Grid item xs={12} sm={12} md={6}>
            <Card sx={{ backgroundColor: '#1c1c1c', color: '#fff', height: '350px', borderRadius: '10px', border: '1px solid #808080' }}>
              <CardContent>
                <Typography variant="h6">Weekly Earnings</Typography>
                <Line data={weeklyChartData} options={options} />
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Earnings Chart */}
          <Grid item xs={12} sm={12} md={6}>
            <Card sx={{ backgroundColor: '#1c1c1c', color: '#fff', height: '350px', borderRadius: '10px', border: '1px solid #808080' }}>
              <CardContent>
                <Typography variant="h6">Monthly Earnings</Typography>
                <Line data={monthlyChartData} options={options} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default UserAnalytics;
