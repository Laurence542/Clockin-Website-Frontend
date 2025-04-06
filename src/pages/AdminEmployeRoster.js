import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/EmployeeRoster.css";
import ContentArea from "../components/ContentArea";
import { CircularProgress, Button } from "@mui/material";

const EmployeeRoster = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Convert decimal hours to a human-readable string.
  const convertDecimalToTime = (decimalHours) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.floor((decimalHours - hours) * 60);
    const seconds = Math.floor(((decimalHours - hours) * 60 - minutes) * 60);
    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes > 0) {
      if (timeString) timeString += ", ";
      timeString += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    if (seconds > 0 || timeString === "") {
      if (timeString) timeString += ", ";
      timeString += `${seconds} second${seconds > 1 ? "s" : ""}`;
    }
    return timeString;
  };

  // Helper function to render status with custom styling.
  const renderStatus = (status) => {
    if (!status) return status;
    const lowerStatus = status.toLowerCase();
    let style = {};
    if (lowerStatus === "break") {
      style = {
        backgroundColor: "#28a745", // green
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.3)"
      };
    } else if (lowerStatus === "offline") {
      style = {
        backgroundColor: "#ff6b6b", // light red
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.3)"
      };
    } else if (lowerStatus === "work") {
      style = {
        backgroundColor: "#007bff", // blue
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.3)"
      };
    } else {
      style = {
        backgroundColor: "#6c757d",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold"
      };
    }
    return <span style={style}>{status}</span>;
  };

  // Function to fetch users.
  const fetchUsers = async () => {
    try {
      // Ensure your backend returns both Active & Terminated users.
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users`,
        { withCredentials: true }
      );
      // Each user object now includes profileStatus.
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on mount and then set interval to automatically refresh every 5 seconds.
  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(() => {
      fetchUsers();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Derive filtered users directly at render time.
  const computedFilteredUsers = users.filter((user) => {
    const matchesStatus =
      statusFilter === "all" ||
      (user.profileStatus &&
        user.profileStatus.toLowerCase() === statusFilter.toLowerCase());
    const lowerSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      lowerSearch === "" ||
      (user.email && user.email.toLowerCase().includes(lowerSearch)) ||
      (user.name && user.name.toLowerCase().includes(lowerSearch)) ||
      (user.firstName &&
        user.firstName.toLowerCase().includes(lowerSearch)) ||
      (user.lastName && user.lastName.toLowerCase().includes(lowerSearch));
    return matchesStatus && matchesSearch;
  });

  const handleRowClick = (userId) => {
    navigate(`/user-detail/${userId}`);
  };

  // Handler to "unterminate" a contractor (set profileStatus to "Active")
  const handleUnterminate = async (userId, e) => {
    e.stopPropagation(); // Prevent row click
    const confirmed = window.confirm(
      "Are you sure you want to unterminate this contractor?"
    );
    if (confirmed) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
          { profileStatus: "Active" },
          { withCredentials: true }
        );
        // Update the users list with the updated status.
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, profileStatus: response.data.profileStatus }
              : user
          )
        );
      } catch (err) {
        console.error(
          "Failed to unterminate contractor:",
          err.response?.data || err.message
        );
        alert("Failed to unterminate contractor.");
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <ContentArea>
          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              height: "75vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        </ContentArea>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <ContentArea>
          <p>{error}</p>
        </ContentArea>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ContentArea>
        <br />
        {/* Filter container */}
        <div className="filter-container">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-dropdown"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
          >
            <option value="Active">Active</option>
            <option value="Terminated">Terminated</option>
            <option value="all">All</option>
          </select>
          <input
            type="text"
            placeholder="Search by name, email, first name, or last name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
          />
        </div>

        {computedFilteredUsers.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p className="no-users">
              No contractors found with status: {statusFilter}
            </p>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", mt: 1 }}
              onClick={() => navigate("/discordrequest")}
            >
              Add New Contractor
            </Button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Status</th>
                <th>Role</th>
                <th>Breaks Count</th>
                <th>Break Time</th>
                <th>Daily Worked</th>
                <th>Weekly Worked</th>
                <th>Monthly Worked</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {computedFilteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <img
                      src={
                        user.avatar ||
                        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                      }
                      alt="avatar"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                      }}
                    />
                  </td>
                  <td>
                    {user.firstName} {user.secondName} {user.lastName}
                  </td>
                  <td>{renderStatus(user.status)}</td>
                  <td>{user.role}</td>
                  <td>{user.breaksCount}</td>
                  <td>{convertDecimalToTime(user.breakTime)}</td>
                  <td>{user.dailyWorked}</td>
                  <td>{user.weeklyWorked}</td>
                  <td>{user.monthlyWorked}</td>
                  <td>
                    {user.profileStatus === "Terminated" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => handleUnterminate(user.id, e)}
                      >
                        Unterminate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ContentArea>
    </div>
  );
};

export default EmployeeRoster;
