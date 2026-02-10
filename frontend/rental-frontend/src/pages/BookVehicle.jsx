import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleById } from '../services/vehicleService';
import { createBooking } from '../services/bookingService';
import { getCurrentUser } from '../services/authService';
import './BookVehicle.css';

/**
 * Book Vehicle page - Allows users to book a vehicle
 */
const BookVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      if (days > 0) {
        setTotalDays(days);
        setTotalAmount(days * vehicle.pricePerDay);
      } else {
        setTotalDays(0);
        setTotalAmount(0);
      }
    }
  }, [startDate, endDate, vehicle]);

  const fetchVehicle = async () => {
    setLoading(true);
    try {
      const data = await getVehicleById(id);
      setVehicle(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Please login to book a vehicle');
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (totalDays <= 0) {
      setError('End date must be after start date');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        userId: currentUser.userId,
        vehicleId: vehicle.id,
        startDate,
        endDate,
      };

      const response = await createBooking(bookingData);
      if (response.success) {
        alert('Booking created successfully!');
        navigate(`/payment/${response.bookingId}`);
      } else {
        setError(response.message || 'Booking failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
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

  if (!vehicle) {
    return <div className="alert alert-danger">Vehicle not found</div>;
  }

  return (
    <div className="book-vehicle-page">
      <div className="container py-5">
        <h1 className="mb-4">Book Vehicle</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {/* Vehicle Details */}
          <div className="col-lg-6">
            <div className="vehicle-details-card">
              <h3>{vehicle.name}</h3>
              <p className="text-muted">
                Category: <strong>{vehicle.category}</strong>
              </p>
              <p className="text-muted">
                Price: <strong className="text-primary">${vehicle.pricePerDay}/day</strong>
              </p>
              <p className="text-muted">
                Status:{' '}
                <strong>
                  <span
                    className={`badge ${
                      vehicle.status === 'Available' ? 'bg-success' : 'bg-danger'
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </strong>
              </p>
              {vehicle.description && (
                <p className="mt-3">
                  <strong>Description:</strong>
                  <br />
                  {vehicle.description}
                </p>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="col-lg-6">
            <div className="booking-form-card">
              <h4>Select Dates</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    disabled={submitting}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    disabled={submitting}
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>

                {totalDays > 0 && (
                  <div className="summary-box">
                    <div className="summary-item">
                      <span>Number of Days:</span>
                      <strong>{totalDays}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Price per Day:</span>
                      <strong>${vehicle.pricePerDay}</strong>
                    </div>
                    <div className="summary-item total">
                      <span>Total Amount:</span>
                      <strong>${totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100"
                  disabled={submitting || vehicle.status !== 'Available'}
                >
                  {submitting ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookVehicle;
