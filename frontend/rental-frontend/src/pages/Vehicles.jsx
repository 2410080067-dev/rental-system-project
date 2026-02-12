import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaMotorcycle, FaTools, FaBox, FaSearch, FaStar } from 'react-icons/fa';
import { getAllVehicles, searchVehicles, getVehiclesByPriceRange } from '../services/vehicleService';
import './Vehicles.css';

/**
 * Vehicles page - Display all vehicles available for rent
 */
const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
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
    setError('');
    if (category === 'All') {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(
        vehicles.filter((v) => v.type?.toUpperCase() === category.toUpperCase())
      );
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredVehicles(vehicles);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await searchVehicles(searchQuery);
      setFilteredVehicles(data);
      if (data.length === 0) {
        setError(`No vehicles found for "${searchQuery}"`);
      }
    } catch (err) {
      // Fallback: filter locally if API search fails
      const query = searchQuery.toLowerCase();
      const localResults = vehicles.filter(v =>
        v.name?.toLowerCase().includes(query) ||
        v.category?.toLowerCase().includes(query) ||
        v.description?.toLowerCase().includes(query)
      );
      setFilteredVehicles(localResults);
      if (localResults.length === 0) {
        setError(`No vehicles found for "${searchQuery}"`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePriceFilter = async () => {
    if (!minPrice && !maxPrice) {
      setFilteredVehicles(vehicles);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getVehiclesByPriceRange(minPrice || 0, maxPrice || 99999);
      setFilteredVehicles(data);
      if (data.length === 0) {
        setError('No vehicles found in this price range');
      }
    } catch (err) {
      // Fallback: filter locally
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || 99999;
      const localResults = vehicles.filter(v => v.pricePerDay >= min && v.pricePerDay <= max);
      setFilteredVehicles(localResults);
      if (localResults.length === 0) {
        setError('No vehicles found in this price range');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategory('All');
    setError('');
    setFilteredVehicles(vehicles);
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'car':
        return <FaCar size={22} color="#4361ee" />;
      case 'bike':
        return <FaMotorcycle size={22} color="#e63946" />;
      case 'tool':
        return <FaTools size={22} color="#2a9d8f" />;
      default:
        return <FaBox size={22} color="#6c757d" />;
    }
  };

  return (
    <div className="vehicles-page">
      <div className="container py-5">
        <h1 className="mb-5">Available Vehicles</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Search & Filter Section */}
        <div className="filter-section mb-5">
          {/* Search Bar */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search vehicles by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                  <FaSearch /> Search
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <input type="number" className="form-control" placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <input type="number" className="form-control" placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                <button className="btn btn-outline-primary" onClick={handlePriceFilter}>Filter</button>
              </div>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={handleClearFilters}>Clear</button>
            </div>
          </div>

          {/* Category Filter */}
          <h5>Filter by Type:</h5>
          <div className="btn-group" role="group">
            {['All', 'CAR', 'BIKE', 'TOOL'].map((category) => (
              <button
                key={category}
                type="button"
                className={`btn ${
                  selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category === 'All' ? 'All' : category.charAt(0) + category.slice(1).toLowerCase()}
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
                  <div className="vehicle-image-wrapper">
                    <img
                      src={vehicle.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                      alt={vehicle.name}
                      className="vehicle-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                    <span
                      className={`badge vehicle-badge ${
                        vehicle.available ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {vehicle.available ? 'Available' : 'Not Available'}
                    </span>
                  </div>

                  <div className="vehicle-body">
                  <h4>{getCategoryIcon(vehicle.category)} {vehicle.name}</h4>
                  <p className="text-muted mb-2">{vehicle.category}</p>

                  {vehicle.averageRating > 0 && (
                    <div className="mb-2">
                      <FaStar color="#ffc107" /> <strong>{vehicle.averageRating.toFixed(1)}</strong>
                      <small className="text-muted"> ({vehicle.totalReviews} reviews)</small>
                    </div>
                  )}

                  {vehicle.description && (
                    <p className="description">{vehicle.description}</p>
                  )}

                  <div className="price-section">
                    <h5>${vehicle.pricePerDay}/day</h5>
                  </div>

                  <div className="d-flex gap-2">
                    <Link
                      to={`/vehicles/${vehicle.id}`}
                      className="btn btn-outline-primary w-50"
                    >
                      Details
                    </Link>
                    {vehicle.available ? (
                      <Link
                        to={`/book/${vehicle.id}`}
                        className="btn btn-primary w-50"
                      >
                        Book Now
                      </Link>
                    ) : (
                      <button className="btn btn-secondary w-50" disabled>
                        Unavailable
                      </button>
                    )}
                  </div>
                  </div>
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
