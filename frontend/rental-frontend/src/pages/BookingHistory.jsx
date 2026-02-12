import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { getBookingsByUserId, cancelBooking } from '../services/bookingService';
import { Link } from 'react-router-dom';
import './BookingHistory.css';

/**
 * Booking History page - Shows user's bookings
 */
const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookingsByUserId(currentUser.userId);
      setBookings(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        alert('Booking cancelled successfully');
        fetchBookings();
      } catch (err) {
        alert(err.message || 'Failed to cancel booking');
      }
    }
  };

  const filteredBookings =
    selectedStatus === 'All'
      ? bookings
      : bookings.filter((b) => b.status === selectedStatus);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning';
      case 'APPROVED':
        return 'bg-info';
      case 'COMPLETED':
        return 'bg-success';
      case 'CANCELLED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="booking-history-page">
      <div className="container py-5">
        <h1 className="mb-5">My Bookings</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Status Filter */}
        <div className="filter-section mb-4">
          <h5>Filter by Status:</h5>
          <div className="btn-group" role="group">
            {['All', 'PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                type="button"
                className={`btn ${
                  selectedStatus === status ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="bookings-grid">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h5>{booking.vehicleName || 'Vehicle'}</h5>
                  <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="label">Booking ID:</span>
                    <span className="value">#{booking.id}</span>
                  </div>

                  <div className="detail-item">
                    <span className="label">Start Date:</span>
                    <span className="value">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="label">End Date:</span>
                    <span className="value">
                      {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="label">Total Amount:</span>
                    <span className="value amount">${booking.totalPrice}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                    <>
                      <Link
                        to={`/payment/${booking.id}`}
                        className="btn btn-sm btn-success"
                      >
                        Make Payment
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <div className="text-success">
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center">
            No bookings found. <Link to="/vehicles">Browse vehicles</Link> to make your first booking.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
