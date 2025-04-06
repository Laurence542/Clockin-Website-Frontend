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
import { Alert, AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SideMenu from './admin_sidemenu';
//import logo from '/header-logo.png'; // Pfad zum Logo-Bild

const user = null;

function Navbar() {
  const [user, setData] = useState(null);
	const [error, setError] = useState(null); // Zustand für Fehler
  
	useEffect(() => {
	  fetch(`${process.env.REACT_APP_API_URL}/user`, {
		method: 'GET',
		credentials: 'include'
	  })
		// .then(response => {
		//   if (!response.ok) {
		// 	// Setze den Fehlerstatus, wenn die Antwort nicht ok ist
		// 	throw new Error(`No user found!`);
		//   }
		//   return response.json();
		// })
		.then(json => setData(json))
		.catch(error => setError(error.message)); // Setze den Fehlerstatus im Fehlerfall
	}, []);

  if (error) {
	  return (
		<Box padding={8}>
		  <Alert severity="error">{error}</Alert> {/* Fehlermeldung anzeigen */}
		</Box>
	  );
	}

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='header'>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <SideMenu />
          
          {/* Flexbox Container für zentriertes Bild */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Link to="/guilds">
              <img src="/header-logo.png" alt="Logo" style={{ height: '50px' }} />
            </Link>
          </Box>

          {/* Premium und Sign Up Buttons */}
          <Button variant="contained" color="header" startIcon={<PremiumIcon />} href="/premium">
            Premium
          </Button>
          <Avatar src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`} alt={user?.global_name} style={{ marginLeft: 10 }}/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
