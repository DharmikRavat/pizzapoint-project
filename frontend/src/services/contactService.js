import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/contact';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Send a contact message (Public)
export const submitContactMessage = async (contactData) => {
    try {
        const response = await axios.post(`${API_URL}/`, contactData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to send message' };
    }
};

// Get all contact messages (Admin Only)
export const getAllContactMessages = async () => {
    try {
        const response = await axios.get(`${API_URL}/`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch contact messages' };
    }
};

// Update message status (Admin Only)
export const updateMessageStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/status`, { status }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update message status' };
    }
};
