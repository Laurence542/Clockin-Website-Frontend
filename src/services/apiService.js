import axios from 'axios';

// Get stored authentication data
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const guildId = localStorage.getItem('selectedGuildId');

    if (!token || !guildId) {
        throw new Error('Authentication or Guild ID is missing.');
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'X-Selected-Guild': guildId,
        },
        withCredentials: true,
    };
};

// Fetch earnings
export const fetchEarnings = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/earnings`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching earnings data:", error);
        throw error;
    }
};

// Fetch weekly earnings
export const fetchWeeklyEarnings = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/earnings/week`, getAuthHeaders());
        return response.data.weeklyEarnings;
    } catch (error) {
        console.error("Error fetching weekly earnings data:", error);
        throw error;
    }
};

// Fetch monthly earnings
export const fetchMonthlyEarnings = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/earnings/month`, getAuthHeaders());
        return response.data.monthlyEarnings;
    } catch (error) {
        console.error("Error fetching monthly earnings data:", error);
        throw error;
    }
};

// Fetch user tasks
export const fetchUserTasks = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-tasks`, getAuthHeaders());
        return response.data.taskHeadings;
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        throw error;
    }
};

// Clock out in progress
export const handleClockOutInProgress = async ({ timer, HOURLY_RATE, workDescription, selectedTaskId, selectedTaskHeading }) => {
    try {
        const earnings = (timer / 3600 * HOURLY_RATE).toFixed(2);
        const payload = {
            clockInTime: new Date(Date.now() - timer * 1000).toISOString(),
            clockOutTime: new Date().toISOString(),
            totalEarnings: earnings,
            workDescription,
            taskHeading: selectedTaskHeading,
            taskId: selectedTaskId,
            status: "In progress",
            guildId: localStorage.getItem('selectedGuildId'),
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/ClockOutInProgress`, payload, getAuthHeaders());
    } catch (error) {
        console.error("Error saving work session:", error);
        throw error;
    }
};

// Clock out complete
export const handleClockOutComplete = async ({ timer, HOURLY_RATE, workDescription, selectedTaskId, selectedTaskHeading }) => {
    try {
        const earnings = (timer / 3600 * HOURLY_RATE).toFixed(2);
        const payload = {
            clockInTime: new Date(Date.now() - timer * 1000).toISOString(),
            clockOutTime: new Date().toISOString(),
            totalEarnings: earnings,
            workDescription,
            taskHeading: selectedTaskHeading,
            taskId: selectedTaskId,
            status: "Complete",
            guildId: localStorage.getItem('selectedGuildId'),
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/clockout`, payload, getAuthHeaders());
    } catch (error) {
        console.error("Error saving work session:", error);
        throw error;
    }
};
