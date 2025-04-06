import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageVoiceChannels = () => {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Get guildId from local storage
    const guildId = localStorage.getItem("selectedGuildId");

    // Fetch voice channels
    useEffect(() => {
        const fetchChannels = async () => {
            if (!guildId) {
                setMessage("Error: No guild selected.");
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/voice-channels/${guildId}`);
                setChannels(response.data.channels);
            } catch (error) {
                setMessage(error.response?.data?.message || "Error fetching channels.");
            } finally {
                setLoading(false);
            }
        };

        fetchChannels();
    }, [guildId]);

    // Delete a channel
    const handleDelete = async (channelId) => {
        if (!window.confirm("Are you sure you want to delete this channel?")) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/voice-channels/${guildId}/${channelId}`);
            setChannels(channels.filter((channel) => channel.channelId !== channelId));
            setMessage("Channel deleted successfully!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error deleting channel.");
        }
    };

    return (
        <div className="manage-voice-channel-container">
            <h2>Manage Voice Channels</h2>
            {message && <p className="message">{message}</p>}

            {loading ? (
                <p>Loading channels...</p>
            ) : channels.length === 0 ? (
                <p>No voice channels found.</p>
            ) : (
                <ul className="voice-channel-list">
                    {channels.map((channel) => (
                        <li key={channel.channelId} className="voice-channel-item">
                            <span>{channel.channelName}</span>
                            <button className="delete-btn" onClick={() => handleDelete(channel.channelId)}>
                                ❌ Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageVoiceChannels;
