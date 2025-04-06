import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton ,CircularProgress } from "@mui/material";
import '../styles/voicechannel.css';
import Navbar from '../components/Navbar';
import ContentArea from '../components/ContentArea';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddVoiceChannel = () => {
  const navigate = useNavigate();
  const [channelId, setChannelId] = useState("");
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false); // For form submission
  const [message, setMessage] = useState("");
  const [voiceChannels, setVoiceChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(false); // For fetching channels

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);

  // Fetch saved voice channels based on the authenticated user's selected guild
  const fetchVoiceChannels = async () => {
    setChannelsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/voice-channels`,
        { withCredentials: true }
      );
      setVoiceChannels(response.data.data || []);
    } catch (error) {
      console.error("Error fetching voice channels:", error);
    } finally {
      setChannelsLoading(false);
    }
  };

  useEffect(() => {
    fetchVoiceChannels();
  }, []);

  // Handle form submission to save a new voice channel
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelId || !channelName) {
      setMessage("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/new-voice-channel`,
        { channelId, channelName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      setChannelId("");
      setChannelName("");
      // Refresh the list after saving a new channel
      fetchVoiceChannels();
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error saving voice channel."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of a voice channel
  const openDeleteDialog = (id) => {
    setChannelToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/voice-channels/${channelToDelete}`,
        { withCredentials: true }
      );
      setMessage("Voice channel deleted successfully.");
      fetchVoiceChannels();
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error deleting voice channel."
      );
    } finally {
      setDeleteDialogOpen(false);
      setChannelToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setChannelToDelete(null);
  };

  return (
    <div>
      <Navbar />
      <ContentArea>
        <div className="add-voice-channel-container">
          <IconButton onClick={() => navigate(-1)} sx={{ color: "white" , marginBottom: "-100px"}}>
             <ArrowBackIcon />
          </IconButton>
          <h2>Add Voice Channel</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <label>Channel ID:</label>
            <input
              type="number"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              required
            />

            <label>Channel Name:</label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
            />

            <button type="submit" disabled={loading} className="buttonsubmit">
              {loading ? "Saving..." : "Save Voice Channel"}
            </button>
          </form>

          {/* Saved Voice Channels Section */}
          <div className="saved-voice-channels">
            <h3>Saved Voice Channels</h3>
            {channelsLoading ? (
              <div className="spinner" style={{ textAlign: "center", marginTop: "20px" }}>
                <CircularProgress color="inherit" />
              </div>
            ) : voiceChannels.length === 0 ? (
              <p>No voice channels saved yet.</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {voiceChannels.map((channel) => (
                  <li key={channel._id} className="channel-item">
                    <div>
                      <strong>ID:</strong> {channel.channelId} <br />
                      <strong>Name:</strong> {channel.channelName}
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => openDeleteDialog(channel._id)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={cancelDelete}
          PaperProps={{
            sx: {
              backgroundColor: "#2c2c2e",
              color: "#fafafa",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
            },
          }}
        >
          <DialogTitle
            sx={{
              borderBottom: "1px solid #444",
              fontWeight: "bold",
              color: "#fafafa",
            }}
          >
            Confirm Delete
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: "#2c2c2e",
              color: "#ccc",
            }}
          >
            Are you sure you want to delete this voice channel?
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: "#2c2c2e",
              borderTop: "1px solid #444",
            }}
          >
            <Button onClick={cancelDelete} sx={{ color: "#4CAF50" }}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} sx={{ color: "#ff6b6b" }}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </ContentArea>
    </div>
  );
};

export default AddVoiceChannel;
