import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById } from '../services/bookingService';
import { processPayment } from '../services/paymentService';
import './Payment.css';

/**
 * Payment page - Process payment for bookings
 */
const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const data = await getBookingById(bookingId);
      setBooking(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all payment details');
      return;
    }

    // Simple validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }

    if (cvv.length !== 3) {
      setError('CVV must be 3 digits');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const paymentData = {
        bookingId: booking.id,
        amount: booking.totalAmount,
      };

      const response = await processPayment(paymentData);

      if (response.success) {
        alert('Payment successful! Your booking is confirmed.');
        navigate('/bookings');
      } else {
        setError(response.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return <div className="alert alert-danger">Booking not found</div>;
  }

  if (booking.status === 'Completed') {
    return (
      <div className="container py-5">
        <div className="alert alert-success text-center">
          <h4>✓ Payment Already Completed</h4>
          <p>This booking has already been paid for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container py-5">
        <h1 className="mb-4">Payment</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {/* Booking Summary */}
          <div className="col-lg-6">
            <div className="summary-card">
              <h4>Booking Summary</h4>

              <div className="summary-item">
                <span>Vehicle:</span>
                <strong>{booking.vehicle?.name}</strong>
              </div>

              <div className="summary-item">
                <span>Booking ID:</span>
                <strong>#{booking.id}</strong>
              </div>

              <div className="summary-item">
                <span>Start Date:</span>
                <strong>{new Date(booking.startDate).toLocaleDateString()}</strong>
              </div>

              <div className="summary-item">
                <span>End Date:</span>
                <strong>{new Date(booking.endDate).toLocaleDateString()}</strong>
              </div>

              <div className="summary-item">
                <span>Price Per Day:</span>
                <strong>${booking.vehicle?.pricePerDay}</strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-item total">
                <span>Total Amount Due:</span>
                <strong>${booking.totalAmount}</strong>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="col-lg-6">
            <div className="payment-form-card">
              <h4>Payment Details</h4>

              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                    maxLength="16"
                    required
                    disabled={processing}
                  />
                  <small className="text-muted">Enter 16 digits</small>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength="5"
                      required
                      disabled={processing}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength="3"
                      required
                      disabled={processing}
                    />
                  </div>
                </div>

                <div className="alert alert-info">
                  <small>
                    <strong>Test Card:</strong> Use any 16-digit number for testing
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay $${booking.totalAmount}`}
                </button>
              </form>

              <div className="payment-note mt-4">
                <small className="text-muted">
                  This is a demonstration payment system. No actual charges will be made.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
