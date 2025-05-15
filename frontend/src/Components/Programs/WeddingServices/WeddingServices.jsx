import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WeddingServices.css';
import ceremony from '../../../assets/programs-1.jpg';
import reception from '../../../assets/gallery-1.jpg';
import destination from '../../../assets/gallery-2.jpeg';
import themed from '../../../assets/gallery-3.jpeg';

const WeddingServices = () => {
  const navigate = useNavigate();

  const weddingOptions = [
    {
      title: "Traditional Ceremony",
      subtitle: "Classic and elegant wedding ceremonies tailored to your cultural preferences",
      image: ceremony,
      link: "/wedding/traditional"
    },
    {
      title: "Reception Planning",
      subtitle: "Create unforgettable celebrations with custom themes, catering, and entertainment",
      image: reception,
      link: "/wedding/reception"
    },
    {
      title: "Destination Weddings",
      subtitle: "Turn your dream destination into the perfect wedding venue",
      image: destination,
      link: "/wedding/destination"
    },
    {
      title: "Themed Weddings",
      subtitle: "Unique and creative themed weddings that tell your story",
      image: themed,
      link: "/wedding/themed"
    }
  ];

  return (
    <div className="wedding-page">
      <div className="wedding-header">
        <h1>Wedding Services</h1>
        <p>Make your special day truly unforgettable with our comprehensive wedding planning services</p>
      </div>
      <div className="wedding-options">
        {weddingOptions.map((option, index) => (
          <div 
            className="wedding-option-card" 
            key={index}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="card-image-container">
              <img 
                src={option.image} 
                alt={option.title} 
                className="wedding-option-image" 
              />
            </div>
            <div className="card-text">
              <h2>{option.title}</h2>
              <p>{option.subtitle}</p>
            </div>
            <button 
              className="see-more-button" 
              onClick={() => navigate(option.link)}
              aria-label={`See more about ${option.title}`}
            >
              See More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeddingServices;
