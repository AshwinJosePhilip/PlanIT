import api from './api';

export const createBooking = async (bookingData) => {
    try {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error creating booking' };
    }
};

export const getMyBookings = async () => {
    try {
        const response = await api.get('/bookings/my');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching bookings' };
    }
};

export const getOrganizerBookings = async () => {
    try {
        const response = await api.get('/bookings/organizer');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching organizer bookings' };
    }
};

export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await api.put(`/bookings/${bookingId}`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error updating booking' };
    }
};

export const cancelBooking = async (bookingId) => {
    try {
        const response = await api.delete(`/bookings/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error cancelling booking' };
    }
};
