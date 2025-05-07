import { useState, useEffect } from 'react';
import './BackToTop.css';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
            setIsVisible(scrolled > 300);
        };

        window.addEventListener('scroll', toggleVisibility);
        // Check initial scroll position
        toggleVisibility();
        
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            className={`back-to-top ${isVisible ? 'visible' : ''}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Scroll to top"
        >
            <span className="arrow">↑</span>
        </button>
    );
};

export default BackToTop;