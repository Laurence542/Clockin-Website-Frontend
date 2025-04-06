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


import React, { useState } from 'react'; 
import { Box } from '@mui/material';
import SideMenu from './SideMenu';
import MenuIcon from '@mui/icons-material/Menu';

export default function ContentArea({ children }) {
  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box display="flex">
      {menuOpen ? <SideMenu /> : <MenuIcon onClick={toggleMenu} />}
      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          pl: menuOpen ? 0 : 0,
          transition: 'padding-left 0.3s',
          overflowY: 'auto',
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
