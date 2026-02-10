import React from 'react';
import './Footer.css';

/**
 * Footer component
 */
const Footer = () => {
  return (
    <footer className="footer bg-primary text-white text-center py-4 mt-5">
      <div className="container">
        <p>&copy; 2026 Rental Management System. All rights reserved.</p>
        <p>
          <small>
            Providing car, bike, and tool rental services with ease and affordability.
          </small>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
