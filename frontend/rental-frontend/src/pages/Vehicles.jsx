import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllVehicles } from '../services/vehicleService';
import './Vehicles.css';

/**
 * Vehicles page - Display all vehicles available for rent
 */
const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await getAllVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(vehicles.filter((v) => v.category === category));
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Car':
        return '🚗';
      case 'Bike':
        return '🏍️';
      case 'Tool':
        return '🔧';
      default:
        return '📦';
    }
  };

  return (
    <div className="vehicles-page">
      <div className="container py-5">
        <h1 className="mb-5">Available Vehicles</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Category Filter */}
        <div className="filter-section mb-5">
          <h5>Filter by Category:</h5>
          <div className="btn-group" role="group">
            {['All', 'Car', 'Bike', 'Tool'].map((category) => (
              <button
                key={category}
                type="button"
                className={`btn ${
                  selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
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
        ) : filteredVehicles.length > 0 ? (
          <div className="row">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="col-md-6 col-lg-4 mb-4">
                <div className="vehicle-card">
                  <div className="vehicle-header">
                    <span className="vehicle-icon">{getCategoryIcon(vehicle.category)}</span>
                    <span
                      className={`badge ${
                        vehicle.status === 'Available' ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </div>

                  <h4>{vehicle.name}</h4>
                  <p className="text-muted mb-2">{vehicle.category}</p>

                  {vehicle.description && (
                    <p className="description">{vehicle.description}</p>
                  )}

                  <div className="price-section">
                    <h5>${vehicle.pricePerDay}/day</h5>
                  </div>

                  {vehicle.status === 'Available' ? (
                    <Link
                      to={`/book/${vehicle.id}`}
                      className="btn btn-primary w-100"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <button className="btn btn-secondary w-100" disabled>
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center">
            No vehicles found in the selected category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
