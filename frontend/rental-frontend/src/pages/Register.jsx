import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import './Register.css';

/**
 * Register page component
 */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Log payload for debugging
      console.log('Register payload:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'user',
      });
      const response = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'user',
      });

      if (response.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      // err might be an Error or an object/string thrown by service
      console.error('Registration error:', err);
      const message = (err && (err.message || err.toString())) || 'An error occurred';
      // Provide clearer guidance when axios reports a network error (CORS/offline/backend not running)
      if (message === 'Network Error') {
        setError('Network Error: could not reach backend. Ensure the Spring Boot server is running at http://localhost:8081');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-gradient" />
      <div className="floating-shapes" aria-hidden="true">
        <span className="shape shape-1" />
        <span className="shape shape-2" />
        <span className="shape shape-3" />
        <span className="shape shape-4" />
      </div>
      <div className="falling-particles" aria-hidden="true">
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
        <span className="star" />
      </div>
      <div className="racing-cars" aria-hidden="true">
        <span className="racing-car" />
        <span className="racing-car" />
        <span className="racing-car" />
        <span className="racing-car" />
        <span className="racing-car" />
        <span className="racing-car" />
        <span className="racing-car" />
        <span className="racing-car" />
        <span className="racing-car" />
        <span className="racing-car" />
      </div>
      <div className="reg-wrapper">
        <div className="reg-grid">
          <div className="reg-card slide-in-left">
          <div className="reg-header">
            <h1 className="reg-title">Create your account</h1>
            <p className="reg-subtitle">Join us and start renting premium vehicles in minutes.</p>
          </div>

          {error && <div className="reg-error">{error}</div>}

          <form className="reg-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon"><i className="fa fa-user" aria-hidden="true"></i></span>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <span className="input-icon"><i className="fa fa-envelope" aria-hidden="true"></i></span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <span className="input-icon"><i className="fa fa-phone" aria-hidden="true"></i></span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <span className="input-icon"><i className="fa fa-lock" aria-hidden="true"></i></span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <span className="input-icon"><i className="fa fa-lock" aria-hidden="true"></i></span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field"
              />
            </div>

            <button type="submit" className="reg-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Create account'}
            </button>
          </form>

          <div className="reg-footer">
            <p>Already have an account? <Link to="/login" className="reg-login-link">Login</Link></p>
          </div>
          </div>

          <div className="reg-visual slide-in-right animate-fade-in-delay-1" aria-hidden="true">
            <div className="visual-card">
              <img
                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="luxury car showcase"
              />
              <div className="visual-caption">Premium vehicles, ready for you</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
