import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllVehicles, addVehicle, updateVehicle, deleteVehicle } from '../services/vehicleService';
import { getAllBookings } from '../services/bookingService';
import { isAdmin } from '../services/authService';
import './AdminDashboard.css';

/**
 * Admin Dashboard - Manage vehicles and view bookings
 */
const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Car',
    pricePerDay: '',
    description: '',
    status: 'Available',
  });

  useEffect(() => {
    if (!isAdmin()) {
      setError('You do not have admin access');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehiclesData, bookingsData] = await Promise.all([
        getAllVehicles(),
        getAllBookings(),
      ]);
      setVehicles(vehiclesData);
      setBookings(bookingsData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.pricePerDay) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateVehicle(editingId, formData);
        alert('Vehicle updated successfully');
        setEditingId(null);
      } else {
        await addVehicle(formData);
        alert('Vehicle added successfully');
      }
      setFormData({
        name: '',
        category: 'Car',
        pricePerDay: '',
        description: '',
        status: 'Available',
      });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      name: vehicle.name,
      category: vehicle.category,
      pricePerDay: vehicle.pricePerDay,
      description: vehicle.description,
      status: vehicle.status,
    });
    setEditingId(vehicle.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(id);
        alert('Vehicle deleted successfully');
        fetchData();
      } catch (err) {
        alert(err.message || 'Failed to delete vehicle');
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Car',
      pricePerDay: '',
      description: '',
      status: 'Available',
    });
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

  return (
    <div className="admin-dashboard">
      <div className="container-fluid py-4">
        <h1 className="mb-4">Admin Dashboard</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'vehicles' ? 'active' : ''}`}
              onClick={() => setActiveTab('vehicles')}
            >
              Vehicles Management
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings ({bookings.length})
            </button>
          </li>
        </ul>

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="vehicles-section">
            {!showAddForm ? (
              <button
                className="btn btn-primary mb-4"
                onClick={() => setShowAddForm(true)}
              >
                + Add New Vehicle
              </button>
            ) : (
              <div className="add-vehicle-form">
                <h4>{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h4>
                <form onSubmit={handleAddOrUpdate}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Vehicle Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Tool">Tool</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Price Per Day *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleFormChange}
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-control"
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn btn-success me-2">
                      {editingId ? 'Update' : 'Add'} Vehicle
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!showAddForm && (
              <div className="vehicles-table">
                <table className="table table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price/Day</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>
                          <strong>{vehicle.name}</strong>
                        </td>
                        <td>{vehicle.category}</td>
                        <td>${vehicle.pricePerDay}</td>
                        <td>
                          <span
                            className={`badge ${
                              vehicle.status === 'Available'
                                ? 'bg-success'
                                : 'bg-warning'
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => handleEdit(vehicle)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(vehicle.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {vehicles.length === 0 && (
                  <div className="alert alert-info">No vehicles found</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="bookings-table">
              <table className="table table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Vehicle</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <strong>#{booking.id}</strong>
                      </td>
                      <td>{booking.user?.name}</td>
                      <td>{booking.vehicle?.name}</td>
                      <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                      <td>${booking.totalAmount}</td>
                      <td>
                        <span
                          className={`badge ${
                            booking.status === 'Active'
                              ? 'bg-warning'
                              : booking.status === 'Completed'
                              ? 'bg-success'
                              : 'bg-danger'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="alert alert-info">No bookings found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
