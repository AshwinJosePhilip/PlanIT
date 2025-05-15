import api from './api';

export const getUsers = async () => {
    try {
        const response = await api.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching users' };
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error deleting user' };
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error updating user' };
    }
};

export const getDashboardStats = async () => {
    try {
        const response = await api.get('/admin/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching dashboard stats' };
    }
};

export const getRecentEvents = async () => {
    try {
        const response = await api.get('/admin/events/recent');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching recent events' };
    }
};
