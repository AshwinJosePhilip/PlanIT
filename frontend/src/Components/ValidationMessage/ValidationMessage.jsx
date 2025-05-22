import React from 'react';
import './ValidationMessage.css';

const ValidationMessage = ({ message, id }) => {
  if (!message) return null;

  return (
    <div 
      className="validation-message" 
      id={id}
      role="alert"
    >
      {message}
    </div>
  );
};

export default ValidationMessage;