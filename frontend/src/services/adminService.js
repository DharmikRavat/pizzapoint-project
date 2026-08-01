import api from '../utils/api';

export const getAdminDashboardStats = async () => {
    try {
        const response = await api.get('/admin/dashboard');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching admin stats", error);
        throw error;
    }
};

export const getAllCustomers = async () => {
    try {
        const response = await api.get('/admin/customers');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching customers", error);
        throw error;
    }
};
