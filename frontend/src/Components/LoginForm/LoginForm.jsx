import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './LoginForm.css';

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
  const [currentImage, setCurrentImage] = useState('/src/assets/i1.jpg');

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const images = [
    '/src/assets/i1.jpg',
    '/src/assets/i2.jpg',
    '/src/assets/i3.jpg',
    '/src/assets/i4.jpg',
    '/src/assets/i5.jpg',
    '/src/assets/i6.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        const currentIndex = images.indexOf(prevImage);
        return images[(currentIndex + 1) % images.length];
      });
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
      if (formData.email === 'admin@planit.com' && formData.password === 'admin123') {
        // Handle remember me
        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        const userData = {
          email: formData.email,
          name: 'Admin User',
          role: 'admin'
        };
        login(userData);
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
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
    <div className="login-page" style={{ backgroundImage: `url('${currentImage}')` }}>
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
            <LoadingSpinner loading={loading} />
            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;