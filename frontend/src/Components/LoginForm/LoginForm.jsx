import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './LoginForm.css';
// Import images
import i1 from '../../assets/i1.jpg';
import i2 from '../../assets/i2.jpg';
import i3 from '../../assets/i3.jpg';
import i4 from '../../assets/i4.jpg';
import i5 from '../../assets/i5.jpg';
import i6 from '../../assets/i6.jpg';

const LoginForm = () => {
  const formRef = useFocusTrap();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ 
    email: localStorage.getItem('rememberedEmail') || '', 
    password: '',
    rememberMe: Boolean(localStorage.getItem('rememberedEmail'))
  });
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [i1, i2, i3, i4, i5, i6];

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url('${images[currentImageIndex]}')` }}>
      <div className="login-form-container" ref={formRef}>
        <h2 className="login-title" tabIndex="-1">Member Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="visually-hidden">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              disabled={loading}
              aria-label="Email address"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="visually-hidden">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              disabled={loading}
              aria-label="Password"
              autoComplete="current-password"
            />
          </div>
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
                aria-label="Remember my email"
              />
              <span>Remember Me</span>
            </label>
          </div>
          <div className="form-submit">
            {loading && <LoadingSpinner size="small" />}
            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <div className="register-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;