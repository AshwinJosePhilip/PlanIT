// src/components/Events.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Events.css';
import gallery_1 from '../../assets/gallery-1.jpg';
import gallery_2 from '../../assets/gallery-2.jpeg';
import gallery_3 from '../../assets/gallery-3.jpeg';
import gallery_4 from '../../assets/gallery-4.jpeg';
import gallery_5 from '../../assets/gallery-5.jpeg';
import gallery_6 from '../../assets/gallery-6.jpeg';
import gallery_7 from '../../assets/gallery-7.webp';
import gallery_8 from '../../assets/gallery-8.jpeg';
import gallery_9 from '../../assets/gallery-9.webp';
import gallery_10 from '../../assets/gallery-10.jpeg';
import gallery_11 from '../../assets/gallery-11.jpeg';
import gallery_12 from '../../assets/gallery-12.jpeg';

const Events = () => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const galleryRef = useRef(null);

    const images = [
        { src: gallery_1, alt: 'Gallery 1' },
        { src: gallery_2, alt: 'Gallery 2' },
        { src: gallery_3, alt: 'Gallery 3' },
        { src: gallery_4, alt: 'Gallery 4' },
        { src: gallery_5, alt: 'Gallery 5' },
        { src: gallery_6, alt: 'Gallery 6' },
        { src: gallery_7, alt: 'Gallery 7' },
        { src: gallery_8, alt: 'Gallery 8' },
        { src: gallery_9, alt: 'Gallery 9' },
        { src: gallery_10, alt: 'Gallery 10' },
        { src: gallery_11, alt: 'Gallery 11' },
        { src: gallery_12, alt: 'Gallery 12' }
    ];

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'ArrowLeft') {
            handleNavigate('prev');
        } else if (e.key === 'ArrowRight') {
            handleNavigate('next');
        }
    }, []);

    // Add keyboard event listeners
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    // Preload images
    useEffect(() => {
        const loadImage = (image) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = image.src;
                img.onload = resolve;
                img.onerror = reject;
            });
        };

        Promise.all(images.map(img => loadImage(img)))
            .then(() => setImagesLoaded(true))
            .catch(err => console.error('Error loading images:', err));
    }, []);

    // Auto-scroll effect
    useEffect(() => {
        if (!imagesLoaded) return;

        const interval = setInterval(() => {
            handleNavigate('next');
        }, 3000);

        return () => clearInterval(interval);
    }, [imagesLoaded]);

    const handleNavigate = (direction) => {
        setCurrentIndex((prevIndex) => {
            const newIndex = direction === 'next'
                ? (prevIndex + 1) % images.length
                : (prevIndex - 1 + images.length) % images.length;

            if (galleryRef.current) {
                galleryRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
            }
            return newIndex;
        });
    };

    if (!imagesLoaded) {
        return (
            <div className="loading" role="status" aria-live="polite">
                Loading gallery...
            </div>
        );
    }

    return (
        <div className='events'>
            <div className="gallery-container" role="region" aria-label="Event Gallery">
                <button 
                    className="nav-button prev" 
                    onClick={() => handleNavigate('prev')}
                    aria-label="Previous image"
                >❮</button>
                <div className="gallery-wrapper">
                    <div 
                        className="gallery" 
                        ref={galleryRef}
                        role="list"
                    >
                        {images.map((image, index) => (
                            <div 
                                className="gallery-card" 
                                key={index}
                                role="listitem"
                                aria-label={`Gallery image ${index + 1} of ${images.length}`}
                            >
                                <img 
                                    src={image.src} 
                                    alt={image.alt}
                                    className="gallery-image"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button 
                    className="nav-button next" 
                    onClick={() => handleNavigate('next')}
                    aria-label="Next image"
                >❯</button>
            </div>
            <div className="gallery-dots" role="tablist" aria-label="Gallery navigation">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => {
                            setCurrentIndex(index);
                            if (galleryRef.current) {
                                galleryRef.current.style.transform = `translateX(-${index * 100}%)`;
                            }
                        }}
                        role="tab"
                        aria-selected={index === currentIndex}
                        aria-label={`Go to image ${index + 1}`}
                        tabIndex={index === currentIndex ? 0 : -1}
                    />
                ))}
            </div>
            <div className="gallery-status" aria-live="polite" className="visually-hidden">
                Image {currentIndex + 1} of {images.length}
            </div>
        </div>
    );
};

export default Events;
