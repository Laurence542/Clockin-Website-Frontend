import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, IconButton } from '@mui/material';
import Navbar from '../../../components/Navbar';
import ContentArea from '../../../components/ContentArea';
import '../../../styles/department.css';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddDepartment = () => {
  const navigate = useNavigate();
  const [departmentName, setDepartmentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);

  // Fetch saved departments based on the authenticated user's selected guild
  const fetchDepartments = async () => {
    setDeptLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/departments`,
        { withCredentials: true }
      );
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setDeptLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle form submission to save a new department
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName) {
      setMessage("Please fill in the department name.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/departments`,
        { name: departmentName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      setDepartmentName('');
      // Refresh the list after saving a new department
      fetchDepartments();
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error saving department."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of a department with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/departments/${id}`,
        { withCredentials: true }
      );
      setMessage("Department deleted successfully.");
      fetchDepartments();
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error deleting department."
      );
    }
  };

  return (
    <div>
      <Navbar />
      <ContentArea>
        <div className="add-department-container">
          <IconButton onClick={() => navigate(-1)} sx={{ color: "white" , marginBottom: "-100px"}}>
            <ArrowBackIcon />
          </IconButton>
          <h2>Add Department</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <label>Department Name:</label>
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="buttonsubmit">
              {loading ? "Saving..." : "Save Department"}
            </button>
          </form>

          <div className="saved-departments">
            <h3>Saved Departments</h3>
            {deptLoading ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <CircularProgress color="inherit" />
              </div>
            ) : departments.length === 0 ? (
              <p>No departments saved yet.</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {departments.map((dept) => (
                  <li key={dept._id} className="department-item">
                    <div>
                      <strong>Name:</strong> {dept.name}
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(dept._id)}
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

export default AddDepartment;
