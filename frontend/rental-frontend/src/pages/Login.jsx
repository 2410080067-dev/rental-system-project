import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import './Auth.css';

/**
 * Login page component with modern, professional UI
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        alert('Login successful!');
        navigate('/');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Animated background elements */}
        <div className="login-gradient-bg"></div>
        
        {/* Main card */}
        <div className="login-card">
          {/* Header section */}
          <div className="login-header">
            <div className="login-icon-wrapper">
              <i className="fas fa-lock"></i>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="login-alert-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Input */}
            <div className="login-form-group">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrapper">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  className="login-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="login-form-group">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-btn-submit"
              disabled={loading}
            >
              <span className="login-btn-text">
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i> Sign In
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer links */}
          <div className="login-footer">
            <div className="login-footer-item">
              <Link to="/forgot-password" className="login-link-forgot">
                <i className="fas fa-key"></i> Forgot Password?
              </Link>
            </div>
            <div className="login-divider"></div>
            <div className="login-footer-item">
              <p className="login-register-text">
                Don't have an account? <Link to="/register" className="login-link-register">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
