import api from './api';

export const createReview = async (reviewData) => {
    try {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error creating review' };
    }
};

export const getEventReviews = async (eventId) => {
    try {
        const response = await api.get(`/reviews/event/${eventId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching reviews' };
    }
};

export const getMyReviews = async () => {
    try {
        const response = await api.get('/reviews/my');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching my reviews' };
    }
};

export const updateReview = async (reviewId, reviewData) => {
    try {
        const response = await api.put(`/reviews/${reviewId}`, reviewData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error updating review' };
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error deleting review' };
    }
};
