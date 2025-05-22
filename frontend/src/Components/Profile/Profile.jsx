import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyBookings } from '../../services/bookingService';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await getMyBookings();
                setBookings(data);
            } catch (error) {
                toast.error(error.message || 'Error fetching bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Calculate booking stats
    const upcomingBookings = bookings.filter(booking => 
        new Date(booking.date) >= new Date() && booking.status !== 'cancelled'
    );
    const pastBookings = bookings.filter(booking => 
        new Date(booking.date) < new Date() || booking.status === 'cancelled'
    );

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <h1>{user?.name}</h1>
                    <p className="profile-email">{user?.email}</p>
                </div>
                
                {user?.role === 'admin' && (
                    <div className="admin-access-section">
                        <button 
                            className="admin-dashboard-button"
                            onClick={() => navigate('/admin')}
                        >
                            Go to Admin Dashboard
                        </button>
                    </div>
                )}
                
                <div className="profile-sections">
                    <div className="profile-section">
                        <h2>Personal Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Name</label>
                                <p>{user?.name}</p>
                            </div>
                            <div className="info-item">
                                <label>Email</label>
                                <p>{user?.email}</p>
                            </div>
                            <div className="info-item">
                                <label>Member Since</label>
                                <p>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                            <div className="info-item">
                                <label>Role</label>
                                <p className="role-badge">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>Account Activity</h2>
                        <div className="activity-stats">
                            <div className="stat-card">
                                <h3>Events Booked</h3>
                                <p>{bookings.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Upcoming Events</h3>
                                <p>{upcomingBookings.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Past Events</h3>
                                <p>{pastBookings.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>Recent Events</h2>
                        <div className="events-list">
                            {bookings.length === 0 ? (
                                <p className="no-bookings">No events booked yet</p>
                            ) : (
                                bookings.map(booking => (
                                    <div key={booking._id} className="event-card">
                                        <div className="event-date">
                                            <span className="day">{new Date(booking.date).getDate()}</span>
                                            <span className="month">
                                                {new Date(booking.date).toLocaleString('default', { month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="event-details">
                                            <h4>{booking.service.title}</h4>
                                            <p>Location: {booking.program.title}</p>
                                            <span className={`event-status ${
                                                new Date(booking.date) >= new Date() ? 
                                                'upcoming' : 'completed'
                                            }`}>
                                                {booking.status === 'cancelled' ? 'Cancelled' :
                                                new Date(booking.date) >= new Date() ? 'Upcoming' : 'Completed'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
