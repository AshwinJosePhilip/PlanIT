import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getUsers, getRecentEvents, deleteUser, updateUser } from '../../services/adminService';
import ProgramManagement from './ProgramManagement/ProgramManagement';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = ({ activeTab: initialTab = 'overview' }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (activeTab === 'overview') {
                    const [statsData, eventsData] = await Promise.all([
                        getDashboardStats(),
                        getRecentEvents()
                    ]);
                    setStats(statsData.stats);
                    setRecentEvents(eventsData);
                } else if (activeTab === 'users') {
                    const userData = await getUsers();
                    setUsers(userData);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/admin/${tab === 'overview' ? '' : tab}`);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(user => user._id !== userId));
                toast.success('User deleted successfully');
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const handleUpdateUser = async (userId, userData) => {
        try {
            const updatedUser = await updateUser(userId, userData);
            setUsers(users.map(user => 
                user._id === userId ? updatedUser : user
            ));
            toast.success('User updated successfully');
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'programs':
                return <ProgramManagement />;
            case 'overview':
                return (
                    <>
                        <div className="admin-stats">
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <p>{stats?.totalUsers.value || 0}</p>
                                <span className={`trend ${stats?.totalUsers.trend >= 0 ? 'positive' : 'negative'}`}>
                                    {stats?.totalUsers.trend >= 0 ? '↑' : '↓'} {Math.abs(stats?.totalUsers.trend || 0).toFixed(1)}%
                                </span>
                            </div>
                            <div className="stat-card">
                                <h3>Active Events</h3>
                                <p>{stats?.activeEvents.value || 0}</p>
                                <span className={`trend ${stats?.activeEvents.trend >= 0 ? 'positive' : 'negative'}`}>
                                    {stats?.activeEvents.trend >= 0 ? '↑' : '↓'} {Math.abs(stats?.activeEvents.trend || 0).toFixed(1)}%
                                </span>
                            </div>
                            <div className="stat-card">
                                <h3>New Bookings</h3>
                                <p>{stats?.newBookings.value || 0}</p>
                                <span className={`trend ${stats?.newBookings.trend >= 0 ? 'positive' : 'negative'}`}>
                                    {stats?.newBookings.trend >= 0 ? '↑' : '↓'} {Math.abs(stats?.newBookings.trend || 0).toFixed(1)}%
                                </span>
                            </div>
                            <div className="stat-card">
                                <h3>Revenue</h3>
                                <p>${stats?.revenue.value.toLocaleString() || '0'}</p>
                                <span className={`trend ${stats?.revenue.trend >= 0 ? 'positive' : 'negative'}`}>
                                    {stats?.revenue.trend >= 0 ? '↑' : '↓'} {Math.abs(stats?.revenue.trend || 0).toFixed(1)}%
                                </span>
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
                                        {recentEvents.map(event => (
                                            <tr key={event._id}>
                                                <td>{event.name}</td>
                                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status ${event.status.toLowerCase()}`}>
                                                        {event.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="action-btn" onClick={() => navigate(`/admin/events/${event._id}`)}>
                                                        View
                                                    </button>
                                                    <button className="action-btn" onClick={() => navigate(`/admin/events/${event._id}/edit`)}>
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button 
                                                className="action-btn"
                                                onClick={() => handleUpdateUser(user._id, {
                                                    role: user.role === 'user' ? 'admin' : 'user'
                                                })}
                                            >
                                                {user.role === 'user' ? 'Make Admin' : 'Remove Admin'}
                                            </button>
                                            {user.role !== 'admin' && (
                                                <button 
                                                    className="action-btn"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
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
                                onClick={() => handleTabChange('overview')}
                            >
                                <i className="fas fa-chart-line"></i>
                                Overview
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'users' ? 'active' : ''}
                                onClick={() => handleTabChange('users')}
                            >
                                <i className="fas fa-users"></i>
                                Users
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'programs' ? 'active' : ''}
                                onClick={() => handleTabChange('programs')}
                            >
                                <i className="fas fa-th-large"></i>
                                Programs
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'events' ? 'active' : ''}
                                onClick={() => handleTabChange('events')}
                            >
                                <i className="fas fa-calendar-alt"></i>
                                Events
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'settings' ? 'active' : ''}
                                onClick={() => handleTabChange('settings')}
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