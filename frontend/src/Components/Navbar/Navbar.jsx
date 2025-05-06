import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.info('You have been logged out');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/">HOME</Link>
                <Link to="/about">ABOUT</Link>
                <Link to="/events">EVENTS</Link>
            </div>
            <div className="navbar-center">
                <h1>PLANIT EVENTS & SERVICES</h1>
            </div>
            <div className="navbar-right">
                <Link to="/testimonials">TESTIMONIALS</Link>
                <Link to="/contact">CONTACT</Link>
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="nav-button">LOGOUT</button>
                ) : (
                    <Link to="/login">LOGIN</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

