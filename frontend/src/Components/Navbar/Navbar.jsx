import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const handleLogout = () => {
        logout();
        toast.info('You have been logged out');
        navigate('/login');
    };

    const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setIsProfileOpen(false);
        }
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const sectionTop = section.offsetTop - navbarHeight;
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        } else if (window.location.pathname === '/') {
            // If we're on the home page but section is not found yet (initial load)
            setTimeout(() => scrollToSection(sectionId), 100);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" onClick={() => scrollToSection('home')}>HOME</Link>
                <Link to="/#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>ABOUT</Link>
                <Link to="/#events" onClick={(e) => { e.preventDefault(); scrollToSection('events'); }}>EVENTS</Link>
                <Link to="/contact">CONTACT</Link>
            </div>
            <div className="navbar-center">
                <h1>PLANIT EVENTS & SERVICES</h1>
            </div>
            <div className="navbar-right">
                <Link to="/#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>TESTIMONIALS</Link>
                <Link to="/#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>CONTACT</Link>
                {isAuthenticated ? (
                    <div className="profile-container" ref={profileRef}>
                        <button 
                            className="profile-button"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            aria-expanded={isProfileOpen}
                        >
                            <div className="profile-image">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </button>
                        {isProfileOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-header">
                                    <div className="profile-image large">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="profile-info">
                                        <p className="profile-name">{user?.name}</p>
                                        <p className="profile-email">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="profile-menu">
                                    <Link to="/profile" className="profile-item">
                                        <i className="fas fa-user"></i>
                                        My Profile
                                    </Link>
                                    <Link to="/my-events" className="profile-item">
                                        <i className="fas fa-calendar"></i>
                                        My Events
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" className="profile-item">
                                            <i className="fas fa-cog"></i>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button 
                                        onClick={handleLogout} 
                                        className="profile-item logout"
                                    >
                                        <i className="fas fa-sign-out-alt"></i>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">LOGIN</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

