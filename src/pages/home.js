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

import { Button } from "@mui/material";
import { Fragment } from "react";

const Home = () => {
    const onSignUp = () => {
        const clientId = process.env.REACT_APP_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${process.env.REACT_APP_API_URL}/api/auth/discord`);
        const responseType = 'code';
        const scope = 'identify email guilds';

        // Redirect the user to Discord's OAuth2 authorization endpoint
        window.location.href = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    };

    return (
        <Fragment>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',  
                margin: 0      
            }}>
                <img src="/header-logo.png" alt="Logo" style={{ height: '100px' }} />
                <Button variant="outlined" onClick={onSignUp} sx={{ fontSize: 20, margin: 3 }}>Login</Button>
            </div>
        </Fragment>
    );
};

export default Home;