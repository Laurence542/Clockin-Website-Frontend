import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import ContentArea from '../../../components/ContentArea';
import { CircularProgress, IconButton, } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import '../../../styles/role.css';

const AddRole = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);

  // Fetch saved roles based on the authenticated user's selected guild
  const fetchRoles = async () => {
    setRoleLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/roles`,
        { withCredentials: true }
      );
      setRoles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle form submission to save a new role
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName) {
      setMessage("Please fill in the role name.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/roles`,
        { name: roleName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      setRoleName('');
      fetchRoles();
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error saving role."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of a role with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) {
      return;
    }
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/roles/${id}`,
        { withCredentials: true }
      );
      setMessage("Role deleted successfully.");
      fetchRoles();
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error deleting role."
      );
    }
  };

  return (
    <div>
      <Navbar />
      <ContentArea>
        <div className="add-role-container">
          <IconButton onClick={() => navigate(-1)} sx={{ color: "white" , marginBottom: "-100px"}}>
            <ArrowBackIcon />
          </IconButton>
          <h2>Add Role</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <label>Role Name:</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="buttonsubmit">
              {loading ? "Saving..." : "Save Role"}
            </button>
          </form>

          <div className="saved-roles">
            <h3>Saved Roles</h3>
            {roleLoading ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <CircularProgress color="inherit" />
              </div>
            ) : roles.length === 0 ? (
              <p>No roles saved yet.</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {roles.map((role) => (
                  <li key={role._id} className="role-item">
                    <div>
                      <strong>Name:</strong> {role.name}
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(role._id)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </ContentArea>
    </div>
  );
};

export default AddRole;
