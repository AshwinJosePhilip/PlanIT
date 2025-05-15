import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ValidationMessage from '../ValidationMessage/ValidationMessage';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import './Contact.css';

const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  phone: '',
  eventType: 'Wedding',
  eventDate: '',
  eventVenue: '',
  source: 'Instagram'
};

const Contact = () => {
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('contactFormData');
    return saved ? JSON.parse(saved) : INITIAL_FORM_STATE;
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setDirty, isDirty, confirmNavigation } = useUnsavedChanges();

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDirty) {
        sessionStorage.setItem('contactFormData', JSON.stringify(formData));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, isDirty]);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return !value.trim() ? 'Name is required' : '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        return !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        return !/^\+?[\d\s-]{8,}$/.test(value) ? 'Invalid phone number' : '';
      case 'eventDate':
        if (!value) return 'Event date is required';
        const date = new Date(value);
        return date < new Date() ? 'Event date cannot be in the past' : '';
      case 'eventVenue':
        return !value.trim() ? 'Event venue is required' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setDirty(true);
    
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Form submitted successfully! We will contact you soon.');
      setFormData(INITIAL_FORM_STATE);
      setDirty(false);
      sessionStorage.removeItem('contactFormData');
    } catch (error) {
      toast.error('An error occurred while submitting the form. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setDirty(false);
      sessionStorage.removeItem('contactFormData');
      toast.info('Form has been reset');
    }
  };

  const getFieldAriaLabel = (name) => {
    const labels = {
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      eventType: 'Event Type',
      eventDate: 'Event Date',
      eventVenue: 'Event Venue',
      source: 'How did you hear about us'
    };
    return `${labels[name]}${errors[name] ? `, Error: ${errors[name]}` : ''}`;
  };

  return (
    <ErrorBoundary>
      <div className="contact-section">
        <div className="title-container">
          <h2 className="section-title">Get in Touch</h2>
          <div className="title-underline"></div>
        </div>
        <div className="contact-container">
          <div className="form-container">
            <form 
              onSubmit={handleSubmit} 
              noValidate
              aria-label="Event Inquiry Form"
            >
              {/* Personal Information Section */}
              <div className="form-section">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="fullName">Full Name*</label>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      disabled={loading}
                      className={errors.fullName ? 'error' : ''}
                      aria-invalid={!!errors.fullName}
                      aria-describedby="fullName-error"
                      aria-label={getFieldAriaLabel('fullName')}
                    />
                    <ValidationMessage 
                      message={errors.fullName} 
                      id="fullName-error"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="email">Email Address*</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      disabled={loading}
                      className={errors.email ? 'error' : ''}
                      aria-invalid={!!errors.email}
                      aria-describedby="email-error"
                      aria-label={getFieldAriaLabel('email')}
                    />
                    <ValidationMessage 
                      message={errors.email} 
                      id="email-error"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone">Phone No*</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone No"
                      disabled={loading}
                      className={errors.phone ? 'error' : ''}
                      aria-invalid={!!errors.phone}
                      aria-describedby="phone-error"
                      aria-label={getFieldAriaLabel('phone')}
                    />
                    <ValidationMessage 
                      message={errors.phone} 
                      id="phone-error"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details Section */}
              <div className="form-section">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="eventType">Event Type*</label>
                    <select 
                      id="eventType"
                      name="eventType" 
                      value={formData.eventType} 
                      onChange={handleChange}
                      disabled={loading}
                      aria-label={getFieldAriaLabel('eventType')}
                    >
                      <option>Wedding</option>
                      <option>Birthday Party</option>
                      <option>Baptism</option>
                      <option>Baby Shower</option>
                      <option>Gender Reveal</option>
                      <option>Corporate Event</option>
                      <option>Seminars & Conferences</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="eventDate">Event Date*</label>
                    <input 
                      type="date" 
                      id="eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      disabled={loading}
                      className={errors.eventDate ? 'error' : ''}
                      min={new Date().toISOString().split('T')[0]}
                      aria-invalid={!!errors.eventDate}
                      aria-describedby="eventDate-error"
                      aria-label={getFieldAriaLabel('eventDate')}
                    />
                    <ValidationMessage 
                      message={errors.eventDate} 
                      id="eventDate-error"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="eventVenue">Event Venue*</label>
                    <input 
                      type="text" 
                      id="eventVenue"
                      name="eventVenue"
                      value={formData.eventVenue}
                      onChange={handleChange}
                      placeholder="Event Venue"
                      disabled={loading}
                      className={errors.eventVenue ? 'error' : ''}
                      aria-invalid={!!errors.eventVenue}
                      aria-describedby="eventVenue-error"
                      aria-label={getFieldAriaLabel('eventVenue')}
                    />
                    <ValidationMessage 
                      message={errors.eventVenue} 
                      id="eventVenue-error"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="form-section">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="source">How did you hear about us?*</label>
                    <select 
                      id="source"
                      name="source" 
                      value={formData.source} 
                      onChange={handleChange}
                      disabled={loading}
                      aria-label={getFieldAriaLabel('source')}
                    >
                      <option>Instagram</option>
                      <option>Facebook</option>
                      <option>Threads</option>
                      <option>Google</option>
                    </select>
                  </div>

                  <div className="form-buttons">
                    <button 
                      type="button" 
                      className="reset-btn" 
                      onClick={handleReset}
                      disabled={loading || !isDirty}
                      aria-label={loading || !isDirty ? 'Reset form (disabled)' : 'Reset form'}
                    >
                      Reset Form
                    </button>
                    <div className="submit-section">
                      {loading && <LoadingSpinner />}
                      <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={loading}
                        aria-busy={loading}
                        aria-label={loading ? 'Submitting form...' : 'Submit form'}
                      >
                        {loading ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="contact-details" aria-label="Contact Information">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> info@planit.com</p>
            <p><strong>Phone:</strong> (123) 456-7890</p>
            <p><strong>Address:</strong> 123 Event Street, Party City, PC 12345</p>
            <p><strong>Hours:</strong> Monday - Friday: 9 AM - 6 PM</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Contact;
