import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ValidationMessage from '../ValidationMessage/ValidationMessage';
import './Contact.css';

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      eventType: 'Wedding',
      eventDate: '',
      eventVenue: '',
      source: 'Instagram'
    }
  });
  const [loading, setLoading] = useState(false);
  
  const formData = watch(); // This will give us access to form values

  const toastifySuccess = () => {
    toast.success('Message sent successfully!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false
    });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const templateParams = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: data.eventDate,
        eventVenue: data.eventVenue,
        source: data.source
      };

      await emailjs.send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_USER_ID
      );

      reset();
      toastifySuccess();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
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
              onSubmit={handleSubmit(onSubmit)} 
              noValidate
              aria-label="Event Inquiry Form"
            >
              {/* Personal Information Section */}
              <div className="form-field">
                <label htmlFor="fullName">Full Name*</label>
                <input 
                  type="text" 
                  id="fullName"
                  {...register("fullName", { 
                    required: "Full name is required",
                    maxLength: {
                      value: 50,
                      message: "Name cannot exceed 50 characters"
                    }
                  })}
                  placeholder="Full Name"
                  disabled={loading}
                  className={errors.fullName ? 'error' : ''}
                  aria-invalid={!!errors.fullName}
                  aria-describedby="fullName-error"
                />
                <ValidationMessage 
                  message={errors.fullName} 
                  id="fullName-error"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email Address*</label>
                <input 
                  type="email" 
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  placeholder="Email Address"
                  disabled={loading}
                  className={errors.email ? 'error' : ''}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
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
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit phone number"
                    }
                  })}
                  placeholder="Phone No"
                  disabled={loading}
                  className={errors.phone ? 'error' : ''}
                  aria-invalid={!!errors.phone}
                  aria-describedby="phone-error"
                />
                <ValidationMessage 
                  message={errors.phone} 
                  id="phone-error"
                />
              </div>

              {/* Event Details Section */}
              <div className="form-field">
                <label htmlFor="eventType">Event Type*</label>
                <select 
                  id="eventType"
                  {...register("eventType")}
                  disabled={loading}
                  aria-label="Select event type"
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

              <div className="form-field">
                <label htmlFor="eventDate">Event Date*</label>
                <input 
                  type="date" 
                  id="eventDate"
                  {...register("eventDate", {
                    required: "Event date is required"
                  })}
                  disabled={loading}
                  className={errors.eventDate ? 'error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                  aria-invalid={!!errors.eventDate}
                  aria-describedby="eventDate-error"
                  aria-label="Event date"
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
                  {...register("eventVenue", {
                    required: "Event venue is required"
                  })}
                  placeholder="Event Venue"
                  disabled={loading}
                  className={errors.eventVenue ? 'error' : ''}
                  aria-invalid={!!errors.eventVenue}
                  aria-describedby="eventVenue-error"
                  aria-label="Event venue"
                />
                <ValidationMessage 
                  message={errors.eventVenue} 
                  id="eventVenue-error"
                />
              </div>

              {/* Additional Information Section */}
              <div className="form-field">
                <label htmlFor="source">How did you hear about us?*</label>
                <select 
                  id="source"
                  {...register("source")}
                  disabled={loading}
                  aria-label="How did you hear about us?"
                >
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>Threads</option>
                  <option>Google</option>
                </select>
              </div>

              {/* Form Actions - Full Width */}
              <div className="form-field full-width">
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="reset-btn" 
                    onClick={() => reset()}
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
