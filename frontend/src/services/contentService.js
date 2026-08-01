import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Offers ---
export const getOffers = async () => {
    try {
        const response = await axios.get(`${API_URL}/offers/`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch offers' };
    }
};

export const createOffer = async (offerData) => {
    try {
        const response = await axios.post(`${API_URL}/offers/`, offerData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create offer' };
    }
};

export const updateOffer = async (id, offerData) => {
    try {
        const response = await axios.put(`${API_URL}/offers/${id}`, offerData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update offer' };
    }
};

export const deleteOffer = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/offers/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete offer' };
    }
};

// --- About Content ---
export const getAllContent = async () => {
    try {
        const response = await axios.get(`${API_URL}/content/`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch content' };
    }
};

export const createContent = async (contentData) => {
    try {
        const response = await axios.post(`${API_URL}/content/`, contentData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create content' };
    }
};

export const updateContent = async (id, contentData) => {
    try {
        const response = await axios.put(`${API_URL}/content/${id}`, contentData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update content' };
    }
};

export const deleteContent = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/content/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete content' };
    }
};
