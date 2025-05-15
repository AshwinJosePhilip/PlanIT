import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (!response.data || !response.data.token) {
            throw new Error('Invalid response from server');
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code outside of 2xx
            throw error.response.data || { message: 'Authentication failed' };
        } else if (error.request) {
            // The request was made but no response was received
            throw { message: 'Server not responding. Please try again later.' };
        } else {
            // Something happened in setting up the request
            throw { message: error.message || 'An error occurred. Please try again.' };
        }
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error occurred' };
    }
};

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;