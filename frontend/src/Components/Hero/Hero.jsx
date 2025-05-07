import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Hero.css';

// Import all hero images
import i1 from '../../assets/i1.jpg';
import i2 from '../../assets/i2.jpg';
import i3 from '../../assets/i3.jpg';
import i4 from '../../assets/i4.jpg';
import i5 from '../../assets/i5.jpg';
import i6 from '../../assets/i6.jpg';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [i1, i2, i3, i4, i5, i6];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate('/contact');
    } else {
      navigate('/login');
    }
  };

  return (
    <div 
      className="hero container" 
      style={{ 
        backgroundImage: `url(${images[currentImageIndex]})`,
      }}
    >
      <div className={`hero-text ${isVisible ? 'visible' : ''}`}>
        <h1 
          className="animate-slide-up"
          role="heading" 
          aria-level="1"
        >
          Planning, Executing and Perfecting your most memorable moments
        </h1>
        {isAuthenticated ? (
          <>
            <p className="animate-slide-up delay-1">
              Welcome back, {user?.name || 'Valued Customer'}!
            </p>
            <p className="animate-slide-up delay-2">
              Ready to plan your next unforgettable event?
            </p>
            <button 
              className="btn explore-btn animate-slide-up delay-3"
              onClick={handleButtonClick}
              aria-label="Start planning your event"
            >
              Plan New Event
            </button>
          </>
        ) : (
          <>
            <p className="animate-slide-up delay-1">
              Join us to create unforgettable experiences
            </p>
            <button 
              className="btn explore-btn animate-slide-up delay-2"
              onClick={handleButtonClick}
              aria-label="Get started with PlanIt"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Hero;
