import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

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
                                <p>5</p>
                            </div>
                            <div className="stat-card">
                                <h3>Upcoming Events</h3>
                                <p>2</p>
                            </div>
                            <div className="stat-card">
                                <h3>Past Events</h3>
                                <p>3</p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>Recent Events</h2>
                        <div className="events-list">
                            <div className="event-card">
                                <div className="event-date">
                                    <span className="day">15</span>
                                    <span className="month">Dec</span>
                                </div>
                                <div className="event-details">
                                    <h4>Company Christmas Party</h4>
                                    <p>Location: Grand Hotel</p>
                                    <span className="event-status upcoming">Upcoming</span>
                                </div>
                            </div>
                            <div className="event-card">
                                <div className="event-date">
                                    <span className="day">23</span>
                                    <span className="month">Nov</span>
                                </div>
                                <div className="event-details">
                                    <h4>Team Building Workshop</h4>
                                    <p>Location: Adventure Park</p>
                                    <span className="event-status completed">Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
