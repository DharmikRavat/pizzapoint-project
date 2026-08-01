import api from '../utils/api';

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/auth/profile', profileData);
        
        // Update local storage user object
        const currentUser = getCurrentUser();
        if (currentUser && response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
