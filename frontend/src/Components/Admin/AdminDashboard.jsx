import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        <div className="admin-stats">
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <p>1,234</p>
                                <span className="trend positive">↑ 12%</span>
                            </div>
                            <div className="stat-card">
                                <h3>Active Events</h3>
                                <p>56</p>
                                <span className="trend positive">↑ 8%</span>
                            </div>
                            <div className="stat-card">
                                <h3>New Bookings</h3>
                                <p>23</p>
                                <span className="trend negative">↓ 5%</span>
                            </div>
                            <div className="stat-card">
                                <h3>Revenue</h3>
                                <p>$45,678</p>
                                <span className="trend positive">↑ 15%</span>
                            </div>
                        </div>
                        <div className="admin-tables">
                            <div className="recent-events">
                                <h2>Recent Events</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Event Name</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Johnson Wedding</td>
                                            <td>May 15, 2025</td>
                                            <td><span className="status pending">Pending</span></td>
                                            <td>
                                                <button className="action-btn">View</button>
                                                <button className="action-btn">Edit</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Tech Conference 2025</td>
                                            <td>June 1, 2025</td>
                                            <td><span className="status confirmed">Confirmed</span></td>
                                            <td>
                                                <button className="action-btn">View</button>
                                                <button className="action-btn">Edit</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                );
            case 'users':
                return (
                    <div className="admin-tables">
                        <h2>User Management</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>John Doe</td>
                                    <td>john@example.com</td>
                                    <td>User</td>
                                    <td>
                                        <button className="action-btn">Edit</button>
                                        <button className="action-btn">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            case 'events':
                return (
                    <div className="admin-tables">
                        <h2>Event Management</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Client</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Smith Anniversary</td>
                                    <td>Sarah Smith</td>
                                    <td>Jul 20, 2025</td>
                                    <td><span className="status confirmed">Confirmed</span></td>
                                    <td>
                                        <button className="action-btn">View</button>
                                        <button className="action-btn">Edit</button>
                                        <button className="action-btn">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            case 'settings':
                return (
                    <div className="admin-settings">
                        <h2>Admin Settings</h2>
                        <form>
                            <div className="form-group">
                                <label>Site Name</label>
                                <input type="text" defaultValue="PlanIt Events & Services" />
                            </div>
                            <div className="form-group">
                                <label>Contact Email</label>
                                <input type="email" defaultValue="info@planit.com" />
                            </div>
                            <button type="submit" className="action-btn">Save Changes</button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <h2>Admin Dashboard</h2>
                <nav>
                    <ul>
                        <li>
                            <button 
                                className={activeTab === 'overview' ? 'active' : ''}
                                onClick={() => setActiveTab('overview')}
                            >
                                <i className="fas fa-chart-line"></i>
                                Overview
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'users' ? 'active' : ''}
                                onClick={() => setActiveTab('users')}
                            >
                                <i className="fas fa-users"></i>
                                Users
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'events' ? 'active' : ''}
                                onClick={() => setActiveTab('events')}
                            >
                                <i className="fas fa-calendar-alt"></i>
                                Events
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'settings' ? 'active' : ''}
                                onClick={() => setActiveTab('settings')}
                            >
                                <i className="fas fa-cog"></i>
                                Settings
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="admin-content">
                <header className="admin-header">
                    <h1>Welcome, {user?.name}</h1>
                    <p>Manage your events and users</p>
                </header>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;