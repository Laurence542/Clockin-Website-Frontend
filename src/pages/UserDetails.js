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


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ContentArea from "../components/ContentArea";
import Stack from "@mui/material/Stack";
import {
  CircularProgress,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to format dates to a UK human-readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
          { withCredentials: true }
        );
        setUserDetail(response.data);
      } catch (err) {
        setError("Failed to fetch user details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

   // Terminate handler: show confirmation and update profileStatus if confirmed
   const handleTerminate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to terminate this contractor?"
    );
    if (confirmed) {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}/terminate`,
          { profileStatus: "Terminated" },
          { withCredentials: true }
        );
        alert("Contractor terminated successfully!");
        navigate(-1);
      } catch (err) {
        console.error("Error terminating user:", err.response?.data || err.message);
        alert("Failed to terminate contractor.");
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <ContentArea>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress size={50} color="primary" />
          </Box>
        </ContentArea>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <ContentArea>
          <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>
        </ContentArea>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ContentArea>
        <Box
          sx={{
            maxWidth: "800px",
            margin: "2rem auto",
            padding: "20px",
            backgroundColor: "#2a2a2a",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h4" align="center" sx={{ color: "#fafafa", mb: 2 }}>
            {userDetail.firstName} More Details
          </Typography>
          {userDetail ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <img
                  src={
                    userDetail.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                  }
                  alt="avatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                  }}
                />
              </Box>
              <br />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#fafafa" }}>
                    Name: {userDetail.firstName} {userDetail.secondName} {userDetail.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Username: {userDetail.username || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#fafafa" }}>
                    Experience: {userDetail.experience}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Email: {userDetail.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Status: {userDetail.status || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Role: {userDetail.role || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Breaks Count: {userDetail.breaksCount}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Daily Worked: {userDetail.dailyWorked}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Weekly Worked: {userDetail.weeklyWorked}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Monthly Worked: {userDetail.monthlyWorked}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Emergency Contact: {userDetail.emergencyContact}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: "#d1d1d1" }}>
                    Contractor Status: {userDetail.employeeStatus}
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/users/${userId}/updatepersonalinformation`)}
              >
                Update Personal Information
              </Button>
              <br /><br />
              <hr />
              <Typography
                variant="body1"
                sx={{ color: "#fafafa", textAlign: "center", paddingTop: "20px" }}
              >
                Tasks
              </Typography>
              {userDetail.tasks && userDetail.tasks.length > 0 ? (
                userDetail.tasks.slice(0, 3).map((task) => (
                  <Box
                    key={task._id}
                    sx={{
                      marginBottom: 2,
                      padding: 2,
                      backgroundColor: "#424242",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: "#fafafa" }}>
                      {task.headline}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#d1d1d1" }}>
                      {task.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#d1d1d1" }}>
                      Due: {formatDate(task.dueDate)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" sx={{ color: "#fafafa" }}>
                  No tasks found.
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/users/${userId}/tasks`)}
              >
                More User Tasks
              </Button>
            </>
          ) : (
            <Typography variant="body1" sx={{ color: "#fafafa" }}>
              User details not available.
            </Typography>
          )}
          <br /><br /><hr />
          
          <Typography
            variant="body1"
            sx={{ color: "#fafafa", textAlign: "center", paddingTop: "20px" }}
          >
            Work History
          </Typography>
          {userDetail.workHistory && userDetail.workHistory.length > 0 ? (
            userDetail.workHistory.slice(0, 2).map((session) => (
              <Card
                key={session._id}
                sx={{
                  margin: "1rem auto",
                  maxWidth: "800px",
                  backgroundColor: "#424242",
                  color: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ color: "#fafafa" }}>
                    Heading: {session.taskHeading}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#d1d1d1", mt: 1 }}>
                    Description: {session.workDescription}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bdbdbd", mt: 1 }}>
                    Clock In: {formatDate(session.clockInTime)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bdbdbd", mt: 1 }}>
                    Clock Out: {formatDate(session.clockOutTime)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bdbdbd", mt: 1 }}>
                    Total Worked: {session.totalWorkedTime}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bdbdbd", mt: 1 }}>
                    Total Earnings: £{session.totalEarnings}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: "#fafafa", textAlign: "center" }}>
              No work history found.
            </Typography>
          )}
           <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/users/${userId}/workhistory`)}
            >
              More User Work History
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(`/users/${userId}/calendar`)}
            >
              View in Calendar
            </Button>
          </Box>
                
          <br></br><br></br>
          <hr></hr>

          <Typography variant="body1" sx={{ color: "#fafafa", textAlign: "center", pt: 2 }}>
            Time Off Request
          </Typography>

          {userDetail?.timeOffRequests?.length > 0 ? (
            <Stack spacing={2} className="timeoff-container">
              {userDetail.timeOffRequests.slice(0, 3).map((request, index) => (
                <Card
                  key={request._id || index}
                  sx={{
                    margin: "1rem auto",
                    maxWidth: "800px",
                    backgroundColor: "#424242",
                    color: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "#fafafa" }}>
                      Start Date: {new Date(request.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#d1d1d1", mt: 1 }}>
                      End Date: {new Date(request.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bdbdbd", mt: 1 }}>
                      Reason: {request.reason}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bdbdbd", mt: 1 }}>
                      Status: {request.status}
                    </Typography>
                    {request.note && (
                      <Typography variant="body2" sx={{ color: "#bdbdbd", mt: 1 }}>
                        Note: {request.note}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", color: "#bdbdbd", mt: 2 }}>
              No time off requests found.
            </Typography>
          )}


          <br></br>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/users/${userId}/timeoffrequest`)}
          >
            More User time Off request
          </Button>
          <br></br><br></br>
          <hr></hr>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="contained" color="error" onClick={handleTerminate}>
              Terminate
            </Button>
          </Box>

        </Box>
      </ContentArea>
    </div>
  );
};

export default UserDetail;
