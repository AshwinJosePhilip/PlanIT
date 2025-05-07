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
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Name is required' : '';
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
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
        <h2 className="registration-title">Create Account</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              disabled={loading}
              className={errors.name ? 'error' : ''}
              aria-label="Full Name"
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
              aria-label="Email Address"
            />
            <ValidationMessage message={errors.email} />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              disabled={loading}
              className={errors.password ? 'error' : ''}
              aria-label="Password"
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
              aria-label="Confirm Password"
            />
            <ValidationMessage message={errors.confirmPassword} />
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