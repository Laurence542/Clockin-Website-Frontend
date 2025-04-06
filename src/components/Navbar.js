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

import '../App.css';
import { 
  Alert, 
  AppBar, 
  Avatar, 
  Box, 
  IconButton, 
  Toolbar, 
  useMediaQuery, 
  useTheme, 
  Drawer 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SideMenu from './SideMenu';
// import logo from '/header-logo.png'; // Pfad zum Logo-Bild

function Navbar() {
  const [user, setData] = useState(null);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (error) {
    return (
      <Box padding={8}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="header">
        <Toolbar>
          {/* Show menu icon on mobile to toggle the drawer */}
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* On desktop you can either render SideMenu inline or use another design */}
          {!isMobile && <SideMenu />}

          {/* Centered logo */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Link to="#">
              <img src="/header-logo.png" alt="Logo" style={{ height: '50px' }} />
            </Link>
          </Box>

          {/* User avatar */}
          <Avatar
            src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`}
            alt={user?.global_name}
            style={{ marginLeft: 10 }}
          />
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Improves performance on mobile
          }}
        >
          <SideMenu onClose={handleDrawerToggle} />
        </Drawer>
      )}
    </Box>
  );
}

export default Navbar;
