import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isLoggedIn, isAdmin } from '../services/authService';
import './Navbar.css';

/**
 * Navigation bar component for site-wide navigation
 */
const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const admin = isAdmin();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <span className="brand-logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 36 C10 24, 20 18, 32 18 C44 18, 54 24, 58 36 L54 40 H46 L40 36 H24 L18 40 H10 L6 36 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="20" cy="44" r="3" fill="currentColor" />
              <circle cx="44" cy="44" r="3" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-text">Rental System</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/vehicles">
                Vehicles
              </Link>
            </li>

            {loggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/bookings">
                    My Bookings
                  </Link>
                </li>
                {admin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {!loggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
