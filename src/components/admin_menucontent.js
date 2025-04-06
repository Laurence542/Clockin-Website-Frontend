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
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { Link, useLocation } from 'react-router-dom'; 
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/analytic' },
  { text: 'Discord Request', icon: <AnalyticsRoundedIcon />, path: '/discordrequest'},
  { text: 'Contractor Roster', icon: <PersonOutlineIcon />, path: '/employee/roster'},
  { text: 'Assign Task', icon: <PeopleRoundedIcon />},
  { text: 'Work History', icon: <AssignmentRoundedIcon />},
  { text: 'Settings', icon: <SettingsRoundedIcon />},
  // { text: 'About', icon: <InfoRoundedIcon />},
  { text: 'Feedback', icon: <HelpRoundedIcon />},
];
const secondaryListItems = [
 
];

export default function MenuContent() {
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
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

      <List dense>
        {secondaryListItems.map((item, index) => (
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
