import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgressiveImage } from '../../hooks/useProgressiveImage';
import './Hero.css';
import heroImage from '../../assets/hero.jpg';
// We'll use a base64 placeholder for the low-quality image
const lowQualityImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQkIh8mJCMpKCUlKCQhJiYwMDYnJx4qLTEzNio3Oi4uLy89QTQ4QjY6Ojr/2wBDAR';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const { src, blur } = useProgressiveImage(lowQualityImage, heroImage);

  useEffect(() => {
    setIsVisible(true);
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
        backgroundImage: `url(${src})`,
        filter: blur ? 'blur(20px)' : 'none',
        transition: 'filter 0.3s ease-out'
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
