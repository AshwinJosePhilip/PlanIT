import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizerEvents } from '../../services/eventService';
import { getOrganizerBookings, updateBookingStatus } from '../../services/bookingService';
import { toast } from 'react-toastify';
import './OrganizerDashboard.css';

const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState('events');
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (activeTab === 'events') {
                    const eventsData = await getOrganizerEvents();
                    setEvents(eventsData);
                } else if (activeTab === 'bookings') {
                    const bookingsData = await getOrganizerBookings();
                    setBookings(bookingsData);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const handleUpdateBooking = async (bookingId, status) => {
        try {
            await updateBookingStatus(bookingId, status);
            const updatedBookings = await getOrganizerBookings();
            setBookings(updatedBookings);
            toast.success('Booking status updated successfully');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCreateEvent = () => {
        navigate('/events/create');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="organizer-dashboard">
            <div className="dashboard-header">
                <h1>Organizer Dashboard</h1>
                <button className="create-event-btn" onClick={handleCreateEvent}>
                    Create New Event
                </button>
            </div>

            <div className="dashboard-tabs">
                <button 
                    className={activeTab === 'events' ? 'active' : ''} 
                    onClick={() => setActiveTab('events')}
                >
                    My Events
                </button>
                <button 
                    className={activeTab === 'bookings' ? 'active' : ''} 
                    onClick={() => setActiveTab('bookings')}
                >
                    Bookings
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'events' ? (
                    <div className="events-list">
                        {events.map(event => (
                            <div key={event._id} className="event-card">
                                <img src={event.image} alt={event.name} />
                                <div className="event-info">
                                    <h3>{event.name}</h3>
                                    <p>{event.description}</p>
                                    <p className="event-date">
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    <div className="event-actions">
                                        <button onClick={() => navigate(`/events/${event._id}/edit`)}>
                                            Edit
                                        </button>
                                        <button onClick={() => navigate(`/events/${event._id}`)}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bookings-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Customer</th>
                                    <th>Tickets</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td>{booking.event.name}</td>
                                        <td>{booking.user.name}</td>
                                        <td>{booking.numTickets}</td>
                                        <td>${booking.totalPrice}</td>
                                        <td>
                                            <span className={`status ${booking.status}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select 
                                                value={booking.status}
                                                onChange={(e) => handleUpdateBooking(
                                                    booking._id, 
                                                    e.target.value
                                                )}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizerDashboard;
