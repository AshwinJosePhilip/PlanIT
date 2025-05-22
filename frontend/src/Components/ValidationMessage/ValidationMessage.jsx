import React from 'react';
import PropTypes from 'prop-types';
import './ValidationMessage.css';

const ValidationMessage = ({ message, id }) => {
    if (!message) return null;

    return (
        <div 
            className="validation-message error" 
            id={id}
            role="alert"
        >
            {message.message || message}
        </div>
    );
};

ValidationMessage.propTypes = {
    message: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            message: PropTypes.string
        })
    ]),
    id: PropTypes.string
};

export default ValidationMessage;