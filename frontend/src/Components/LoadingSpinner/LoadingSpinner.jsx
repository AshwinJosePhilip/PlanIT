import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
    return (
        <div className="loading-spinner-container" role="status">
            <div className={`loading-spinner ${size}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <span className="loading-text">{text}</span>
            <span className="sr-only">Loading content, please wait...</span>
        </div>
    );
};

export default LoadingSpinner;