import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>PlanIt Events & Services</h3>
                    <p>Making your special moments extraordinary with our professional event planning and management services.</p>
                    <div className="footer-social">
                        <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={20} />
                        </a>
                        <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                            <FaLinkedinIn size={20} />
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/programs">Programs</Link></li>
                        <li><Link to="/events">Events</Link></li>
                        <li><Link to="/testimonials">Testimonials</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Our Programs</h3>
                    <ul className="footer-links">
                        <li><Link to="/programs/wedding">Wedding Events</Link></li>
                        <li><Link to="/programs/birthday">Birthday Celebrations</Link></li>
                        <li><Link to="/programs/corporate">Corporate Events</Link></li>
                        <li><Link to="/programs/concerts">Concerts</Link></li>
                        <li><Link to="/programs/social">Social Gatherings</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact Info</h3>
                    <div className="footer-contact">
                        <div className="contact-item">
                            <FaPhone />
                            <span>+1 234 567 8900</span>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope />
                            <span>info@planitevents.com</span>
                        </div>
                        <div className="contact-item">
                            <FaMapMarkerAlt />
                            <span>123 Event Street, City, Country</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} PlanIt Events & Services. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
