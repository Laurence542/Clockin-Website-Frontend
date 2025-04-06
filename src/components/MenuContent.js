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

import * as React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TaskIcon from '@mui/icons-material/Task';

export default function MenuContent() {
  const location = useLocation();
  const [isOwner, setIsOwner] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  // Load the stored selected guild from sessionStorage if available
  const [selectedGuild, setSelectedGuild] = React.useState(() => {
    const stored = sessionStorage.getItem('selectedGuild');
    return stored ? JSON.parse(stored) : null;
  });

  // Function to fetch user data and update sessionStorage accordingly
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/guilds`,
        { withCredentials: true }
      );
      const { guilds, selectedGuild: backendSelectedGuild } = response.data;

      // Cache the selected guild in sessionStorage
      sessionStorage.setItem(
        'selectedGuild',
        JSON.stringify(backendSelectedGuild)
      );
      setSelectedGuild(backendSelectedGuild);

      // Determine ownership based on the selected guild's info
      const selectedGuildInfo = guilds.find(g => g.id === backendSelectedGuild);
      setIsOwner(selectedGuildInfo ? selectedGuildInfo.isOwner : false);
    } catch (error) {
      console.error('Failed to fetch user guilds:', error.message);
      setIsOwner(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Initial fetch on mount
    fetchUserData();

    // Poll the backend every 60 seconds for updated data
    const intervalId = setInterval(fetchUserData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const ownerMenuItems = [
    { text: 'Home', icon: <HomeRoundedIcon />, path: '/analytic' },
    { text: 'Discord Request', icon: <AnalyticsRoundedIcon />, path: '/discordrequest' },
    { text: 'Contractor', icon: <PersonOutlineIcon />, path: '/employee/roster' },
    { text: 'Time Off Requests', icon: <AnalyticsRoundedIcon />, path: '/contractor/vacation' },
    { text: 'Task', icon: <TaskIcon />, path: '/contractor/task' },
    { text: 'Work History', icon: <AssignmentRoundedIcon />, path: '/contractor/workhistory' },
    { text: 'Bot', icon: <AnalyticsRoundedIcon />, path: '/Bot' },
    { text: 'Settings', icon: <AnalyticsRoundedIcon />, path: '/settings' },
  ];

  const nonOwnerMenuItems = [
    { text: 'Home', icon: <HomeRoundedIcon />, path: '/dashboard' },
    { text: 'Request Time Off', icon: <AnalyticsRoundedIcon />, path: '/request-time-off' },
    { text: 'Tasks', icon: <PeopleRoundedIcon />, path: '/my-task' },
    { text: 'Work History', icon: <AssignmentRoundedIcon />, path: '/work-history' },
    { text: 'Bot', icon: <AnalyticsRoundedIcon />, path: '/Bot' },
    { text: 'Profile', icon: <PeopleRoundedIcon />, path: '/profiles' },
  ];

  if (loading) {
    return (
      <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Stack>
    );
  }

  const menuItems = isOwner ? ownerMenuItems : nonOwnerMenuItems;

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton selected={location.pathname === item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
