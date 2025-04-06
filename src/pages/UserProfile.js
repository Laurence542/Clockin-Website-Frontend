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
import CircularProgress from "@mui/material/CircularProgress";
import Navbar from "../components/Navbar";
import ContentArea from "../components/ContentArea";
import axios from "axios"; 
import "../styles/userProfile.css";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
                    withCredentials: true, // Send cookies with request
                });

                setUser(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.error || "Failed to fetch user data");
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <Navbar />
            <ContentArea>
                {loading ? (
                    <div className="loading-container">
                        <CircularProgress size={50} />
                    </div>
                ) : error ? (
                    <div className="error-container">❌ Error: {error}</div>
                ) : (
                    <div className="profile-container">
                        <div className="profile-header">
                            <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="profile-avatar"
                            />
                            <div>
                                <p><strong>Server:</strong> {user.guildName}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Status:</strong> {user.status || "N/A"}</p>
                            </div>
                        </div>
                        <div className="profile-details">
                            <p><strong>Full Name:</strong> {user.firstName} {user.secondName} {user.lastName}</p>
                            <p><strong>Experience:</strong> {user.experience}</p>
                            <p><strong>Hourly Rate:</strong> {user.hourlyRate}</p>
                            <p><strong>Worked Hours:</strong> {user.totalWorked} hrs</p>
                            <p><strong>Employee Status:</strong> {user.employeeStatus}</p>
                            <p><strong>Gender:</strong> {user.gender}</p>
                        </div>
                    </div>
                )}
            </ContentArea>
        </div>
    );
};

export default UserProfile;
