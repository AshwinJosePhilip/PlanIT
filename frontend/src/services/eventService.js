import api from './api';

export const getEvents = async () => {
    try {
        const response = await api.get('/events');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching events' };
    }
};

export const getEventById = async (eventId) => {
    try {
        const response = await api.get(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching event' };
    }
};

export const createEvent = async (eventData) => {
    try {
        const response = await api.post('/events', eventData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error creating event' };
    }
};

export const updateEvent = async (eventId, eventData) => {
    try {
        const response = await api.put(`/events/${eventId}`, eventData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error updating event' };
    }
};

export const deleteEvent = async (eventId) => {
    try {
        const response = await api.delete(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error deleting event' };
    }
};

export const getOrganizerEvents = async () => {
    try {
        const response = await api.get('/events/organizer');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching organizer events' };
    }
};
