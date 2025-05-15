import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ValidationMessage from '../ValidationMessage/ValidationMessage';
import './RegistrationForm.css';
import i1 from '../../assets/i1.jpg';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    organizerName: '',
    organizationType: 'Event Management Company',
    experience: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'organizer'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Contact person\'s name is required' : '';
      case 'organizerName':
        return !value.trim() ? 'Organization name is required' : '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        return !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'role') {
      setFormData(prev => ({
        name: '',
        organizerName: '',
        organizationType: 'Event Management Company',
        experience: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: value
      }));
      setErrors({});
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    const commonFields = ['name', 'email', 'password', 'confirmPassword'];
    const organizerFields = ['organizerName', 'organizationType', 'experience'];
    
    const fieldsToValidate = formData.role === 'organizer' 
      ? [...commonFields, ...organizerFields]
      : commonFields;
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'organizer' && {
          organizerDetails: {
            organizerName: formData.organizerName,
            organizationType: formData.organizationType,
            experience: formData.experience
          }
        })
      };

      await register(registrationData);
      
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page" style={{ backgroundImage: `url(${i1})` }}>
      <div className="registration-form-container">
        <div className="role-selection">
          <div className="role-options">
            <label className={`role-option ${formData.role === 'user' ? 'active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Regular User</span>
            </label>
            <label className={`role-option ${formData.role === 'organizer' ? 'active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="organizer"
                checked={formData.role === 'organizer'}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Event Organizer</span>
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="registration-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={formData.role === 'organizer' ? "Contact Person's Name" : "Full Name"}
                disabled={loading}
                className={errors.name ? 'error' : ''}
              />
              <ValidationMessage message={errors.name} />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                disabled={loading}
                className={errors.email ? 'error' : ''}
              />
              <ValidationMessage message={errors.email} />
            </div>
          </div>

          {/* Organizer Information Section - Only shown for organizers */}
          {formData.role === 'organizer' && (
            <>
              <div className="form-section">
                <div className="form-group">
                  <input
                    type="text"
                    name="organizerName"
                    value={formData.organizerName}
                    onChange={handleChange}
                    placeholder="Organization Name"
                    disabled={loading}
                    className={errors.organizerName ? 'error' : ''}
                  />
                  <ValidationMessage message={errors.organizerName} />
                </div>

                <div className="form-group">
                  <select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors.organizationType ? 'error' : ''}
                  >
                    <option value="Event Management Company">Event Management Company</option>
                    <option value="Wedding Planner">Wedding Planner</option>
                    <option value="Corporate Events">Corporate Event Planner</option>
                    <option value="Independent">Independent Organizer</option>
                    <option value="Venue">Venue Provider</option>
                  </select>
                  <ValidationMessage message={errors.organizationType} />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors.experience ? 'error' : ''}
                  >
                    <option value="">Select Years of Experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  <ValidationMessage message={errors.experience} />
                </div>
              </div>
            </>
          )}

          {/* Password Section */}
          <div className="form-section">
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={loading}
                className={errors.password ? 'error' : ''}
              />
              <ValidationMessage message={errors.password} />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                disabled={loading}
                className={errors.confirmPassword ? 'error' : ''}
              />
              <ValidationMessage message={errors.confirmPassword} />
            </div>
          </div>

          <div className="form-submit">
            {loading && <LoadingSpinner size="small" />}
            <button 
              type="submit" 
              className="register-btn" 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;