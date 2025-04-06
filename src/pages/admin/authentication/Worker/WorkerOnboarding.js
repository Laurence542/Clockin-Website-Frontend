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

import React, { useState } from "react";
import axios from "axios";

const WorkerOnboarding = () => {
  const [formData, setFormData] = useState({
    userId: "",
    guildId: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    role: "",
    department: "",
  });

  // Define options for dropdown fields
  const guildOptions = [
    { id: "1297549451010773072", name: "Laurence guild" },
    { id: "1158467177658204341", name: "segritude guild"},
  ];
  const roleOptions = ["Admin", "Manager", "Employee"]; 
  const departmentOptions = ["HR", "IT", "Finance", "Marketing"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/onboarding`, formData);
      alert("Worker onboarded successfully!");
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Failed to onboard worker. Please try again.");
      }
      console.error("Error onboarding worker:", error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "black" }}>
      <h2 style={{ textAlign: "center", color: "white" }}>Worker Onboarding</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => {


          if (key === "guildId" || key === "role" || key === "department") {
            const options = key === "guildId" ? guildOptions : key === "role" ? roleOptions : departmentOptions;

            return (
              <div key={key} style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "white" }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
                  required
                >
                  <option value="">Select {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                  {options.map((option) => (
                    <option key={option.id || option} value={option.id || option}>
                      {option.name || option}
                    </option>
                  ))}
                </select>

    
                {key === "guildId" && formData[key] && (
                  <div style={{ marginTop: "10px", color: "white" }}>
                    Selected Guild: {guildOptions.find((guild) => guild.id === formData[key])?.name || "None"}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={key} style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "white" }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type={key === "password" ? "password" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
                required={key !== "guildId"}
              />
            </div>
          );
        })}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Complete Onboarding
        </button>
      </form>
    </div>
  );
};

export default WorkerOnboarding;
