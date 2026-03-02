import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCar, FaMotorcycle, FaTools, FaBox, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaTag, FaRupeeSign, FaCogs, FaInfoCircle, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getVehicleById } from '../services/vehicleService';
import { getReviewsByVehicleId, createReview } from '../services/reviewService';
import { isLoggedIn, getCurrentUser } from '../services/authService';
import './VehicleDetails.css';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchVehicle();
    fetchReviews();
  }, [id]);

  const fetchVehicle = async () => {
    setLoading(true);
    try {
      const data = await getVehicleById(id);
      setVehicle(data);
      setError('');
    } catch (err) {
      setError('Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getReviewsByVehicleId(id);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;
    setSubmittingReview(true);
    try {
      await createReview(user.userId, { vehicleId: parseInt(id), ...reviewForm });
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      fetchVehicle(); // refresh rating
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<FaStar key={i} color="#ffc107" />);
      else if (i - 0.5 <= rating) stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
      else stars.push(<FaRegStar key={i} color="#ffc107" />);
    }
    return stars;
  };

  const getCategoryIcon = (vehicle) => {
    switch (vehicle?.type?.toLowerCase()) {
      case 'car':
        return <FaCar size={28} color="#4361ee" />;
      case 'bike':
        return <FaMotorcycle size={28} color="#e63946" />;
      case 'tool':
        return <FaTools size={28} color="#2a9d8f" />;
      default:
        return <FaBox size={28} color="#6c757d" />;
    }
  };

  // Default vehicle images by category (fallback if DB image is broken)
  const getDefaultVehicleImage = (vehicle) => {
    const categoryImages = {
      sedan: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&fit=crop',
      suv: 'https://images.unsplash.com/photo-1519245659620-e859806a8d7b?w=600&fit=crop',
      luxury: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&fit=crop',
      sports: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&fit=crop',
      bike: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&fit=crop',
      tool: 'https://images.unsplash.com/photo-1581147060639-02378ff5ca30?w=600&fit=crop',
    };
    const cat = (vehicle?.category || vehicle?.type || '').toLowerCase();
    return categoryImages[cat] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=600&fit=crop';
  };

  const getSpecifications = (vehicle) => {
    const type = vehicle.type?.toLowerCase();

    if (type === 'car') {
      return [
        { label: 'Category', value: vehicle.category || 'Sedan' },
        { label: 'Seats', value: vehicle.category === 'SUV' ? '7 Passengers' : '5 Passengers' },
        { label: 'Transmission', value: 'Automatic' },
        { label: 'Fuel', value: 'Petrol / Diesel' },
        { label: 'AC', value: 'Yes' },
        { label: 'Mileage', value: vehicle.category === 'Sports' ? '8-12 km/l' : '15-20 km/l' },
      ];
    } else if (type === 'bike') {
      if (vehicle.name?.toLowerCase().includes('activa') || vehicle.name?.toLowerCase().includes('scooter')) {
        return [
          { label: 'Type', value: 'Scooter' },
          { label: 'Seats', value: '2 Passengers' },
          { label: 'Engine', value: '110cc' },
          { label: 'Fuel', value: 'Petrol' },
          { label: 'Mileage', value: '50-60 km/l' },
          { label: 'Start', value: 'Self Start / Kick Start' },
        ];
      }
      return [
        { label: 'Type', value: 'Motorcycle' },
        { label: 'Seats', value: '2 Passengers' },
        { label: 'Engine', value: '350cc - 500cc' },
        { label: 'Fuel', value: 'Petrol' },
        { label: 'Mileage', value: '30-40 km/l' },
        { label: 'Start', value: 'Self Start' },
      ];
    } else if (type === 'tool') {
      return [
        { label: 'Type', value: 'Power Tool' },
        { label: 'Power', value: 'Electric / Battery' },
        { label: 'Warranty', value: 'Covered' },
        { label: 'Weight', value: 'Lightweight' },
        { label: 'Usage', value: 'Professional / Home' },
        { label: 'Accessories', value: 'Included' },
      ];
    }
    return [];
  };

  const getRentalPolicies = (vehicle) => {
    const common = [
      'Valid ID proof required at pickup',
      'Security deposit applicable',
      'Late return charges apply',
      'Damage charges as per inspection',
    ];

    if (vehicle?.type?.toLowerCase() === 'car') {
      return [...common, 'Valid driving license mandatory', 'Fuel to be returned at same level'];
    } else if (vehicle?.type?.toLowerCase() === 'bike') {
      return [...common, 'Valid two-wheeler license mandatory', 'Helmet provided free of cost'];
    } else if (vehicle?.type?.toLowerCase() === 'tool') {
      return [...common, 'Return in clean condition', 'Safety gear recommended'];
    }
    return common;
  };

  if (loading) {
    return (
      <div className="vehicle-details-page">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="vehicle-details-page">
        <div className="container py-5">
          <div className="alert alert-danger text-center">
            <h4>Vehicle Not Found</h4>
            <p>{error || 'The vehicle you are looking for does not exist.'}</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/vehicles')}>
              <FaArrowLeft className="me-2" /> Back to Vehicles
            </button>
          </div>
        </div>
      </div>
    );
  }

  const specs = getSpecifications(vehicle);
  const policies = getRentalPolicies(vehicle);

  return (
    <div className="vehicle-details-page">
      <div className="container py-5">
        {/* Back Button */}
        <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/vehicles')}>
          <FaArrowLeft className="me-2" /> Back to Vehicles
        </button>

        <div className="details-card">
          <div className="row g-0">
            {/* Image Section */}
            <div className="col-lg-6">
              <div className="details-image-wrapper">
                <img
                  src={vehicle.imageUrl || getDefaultVehicleImage(vehicle)}
                  alt={vehicle.name}
                  className="details-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getDefaultVehicleImage(vehicle);
                  }}
                />
                <span className={`badge details-badge ${vehicle.available ? 'bg-success' : 'bg-danger'}`}>
                  {vehicle.available ? (
                    <><FaCheckCircle className="me-1" /> Available</>
                  ) : (
                    <><FaTimesCircle className="me-1" /> Not Available</>
                  )}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="col-lg-6">
              <div className="details-info">
                <div className="details-header">
                  <h2>{getCategoryIcon(vehicle)} {vehicle.name}</h2>
                  <span className="category-tag">
                    <FaTag className="me-1" /> {vehicle.category}
                  </span>
                </div>

                {/* Rating Display */}
                {vehicle.averageRating > 0 && (
                  <div className="details-rating mb-3">
                    <div className="d-flex align-items-center gap-2">
                      {renderStars(vehicle.averageRating)}
                      <span className="ms-2"><strong>{vehicle.averageRating.toFixed(1)}</strong> ({vehicle.totalReviews} reviews)</span>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="details-price">
                  <FaRupeeSign size={20} />
                  <span className="price-amount">{vehicle.pricePerDay}</span>
                  <span className="price-period">/ day</span>
                </div>

                {/* Specifications */}
                <div className="details-section">
                  <h5><FaCogs className="me-2" />Specifications</h5>
                  <div className="specs-grid">
                    {specs.map((spec, index) => (
                      <div key={index} className="spec-item">
                        <span className="spec-label">{spec.label}</span>
                        <span className="spec-value">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="details-actions">
                  {vehicle.available ? (
                    <Link to={`/book/${vehicle.id}`} className="btn btn-primary btn-lg w-100">
                      Book Now
                    </Link>
                  ) : (
                    <button className="btn btn-secondary btn-lg w-100" disabled>
                      Currently Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rental Policies */}
          <div className="details-policies">
            <h5><FaInfoCircle className="me-2" />Rental Policies</h5>
            <div className="policies-grid">
              {policies.map((policy, index) => (
                <div key={index} className="policy-item">
                  <FaCheckCircle className="policy-icon" />
                  <span>{policy}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="details-reviews mt-4 p-4">
            <h5><FaStar className="me-2" color="#ffc107" />Reviews & Ratings</h5>

            {/* Review Form */}
            {isLoggedIn() && (
              <div className="review-form card p-3 mb-4">
                <h6>Write a Review</h6>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-2">
                    <label className="form-label">Rating</label>
                    <select className="form-select" value={reviewForm.rating} onChange={(e) => setReviewForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}>
                      {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>{'★'.repeat(r)}{'☆'.repeat(5 - r)} ({r})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <textarea className="form-control" placeholder="Share your experience..." rows="3" value={reviewForm.comment} onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item card p-3 mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>{review.userName}</strong>
                      <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="mb-1">{renderStars(review.rating)}</div>
                    <p className="mb-0 text-muted">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
