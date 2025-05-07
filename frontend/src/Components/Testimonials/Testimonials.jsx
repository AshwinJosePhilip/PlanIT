import React, { useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import './Testimonials.css';
import user1 from '../../assets/user-1.jpeg';
import user2 from '../../assets/user-2.jpeg';
import user3 from '../../assets/user-3.webp';
import user4 from '../../assets/user-4.webp';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Bride',
    image: user1,
    text: 'PlanIt made our dream wedding a reality! Their attention to detail and professional service exceeded our expectations.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Corporate Client',
    image: user2,
    text: 'Organized our annual conference flawlessly. The team\'s expertise in corporate events is unmatched.'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Birthday Celebrant',
    image: user3,
    text: 'My 30th birthday party was absolutely perfect! Every detail was carefully planned and executed.'
  },
  {
    id: 4,
    name: 'David Williams',
    role: 'Event Host',
    image: user4,
    text: 'Professional, creative, and highly responsive. PlanIt delivers excellence every single time.'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.3
  });

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  }, [handleNext, handlePrev]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div 
      className={`testimonials ${isVisible ? 'visible' : ''}`}
      ref={containerRef}
      role="region"
      aria-label="Customer Testimonials"
    >
      <div className="testimonial-container">
        <button 
          className="nav-button prev"
          onClick={handlePrev}
          aria-label="Previous testimonial"
        >
          ❮
        </button>
        
        <div 
          className="testimonial-content"
          aria-live="polite"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`testimonial-card ${index === currentIndex ? 'active' : ''}`}
              role="tabpanel"
              aria-hidden={index !== currentIndex}
              onTransitionEnd={() => setIsAnimating(false)}
            >
              <div className="testimonial-image">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  loading="lazy"
                />
              </div>
              <div className="testimonial-text">
                <p>{testimonial.text}</p>
                <div className="testimonial-author">
                  <h3>{testimonial.name}</h3>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="nav-button next"
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          ❯
        </button>
      </div>

      <div className="testimonial-dots" role="tablist">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setIsAnimating(true);
              setCurrentIndex(index);
            }}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Testimonial ${index + 1}`}
            tabIndex={index === currentIndex ? 0 : -1}
          />
        ))}
      </div>

      <div className="testimonial-progress" aria-hidden="true">
        <div 
          className="progress-bar" 
          style={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Testimonials;
