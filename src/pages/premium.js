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

import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { Fragment } from 'react';
import Navbar from "../components/Navbar";

const card = (
    <Fragment>
        <CardHeader>Test</CardHeader>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          Elite
        </Typography>
        <Typography variant="body2">
          <ul>
            <li>10 Roles</li>
            <li>10 Roles</li>
            <li>10 Roles</li>
          </ul>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Fragment>
  );

const Premium = () => {
    return (
        <Fragment>
          <Navbar />
          <Box sx={{ maxWidth: 275, margin: '0 auto', paddingTop: 2 }}>
              <Card variant="outlined">{card}</Card>
              <Card variant="outlined">{card}</Card>
              <Card variant="outlined">{card}</Card>
          </Box>
        </Fragment>
    );
};
 
export default Premium;