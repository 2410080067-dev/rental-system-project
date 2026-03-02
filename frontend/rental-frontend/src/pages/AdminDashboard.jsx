import React, { useState, useEffect } from 'react';
import { getAllVehicles, addVehicle, updateVehicle, deleteVehicle, toggleAvailability } from '../services/vehicleService';
import { getAllBookings, approveBooking, cancelBooking, completeBooking } from '../services/bookingService';
import { getDashboardStats } from '../services/adminService';
import { isAdmin } from '../services/authService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './AdminDashboard.css';

const COLORS = ['#4361ee', '#f72585', '#4cc9f0', '#7209b7', '#3a0ca3'];

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sedan',
    type: 'CAR',
    pricePerDay: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Debug: Log current user info
    console.log('Current role:', localStorage.getItem('userRole'));
    console.log('Is admin:', isAdmin());
    
    if (!isAdmin()) {
      setError('You do not have admin access. Please log in with an admin account.');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehiclesData, bookingsData, statsData] = await Promise.all([
        getAllVehicles(),
        getAllBookings(),
        getDashboardStats(),
      ]);
      setVehicles(vehiclesData);
      setBookings(bookingsData);
      setStats(statsData);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFormData({ name: '', category: 'Sedan', type: 'CAR', pricePerDay: '', description: '', imageUrl: '' });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      name: vehicle.name,
      category: vehicle.category,
      type: vehicle.type || 'CAR',
      pricePerDay: vehicle.pricePerDay,
      description: vehicle.description || '',
      imageUrl: vehicle.imageUrl || '',
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
        alert(err.response?.data?.message || 'Failed to delete vehicle');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAvailability(id);
      fetchData();
    } catch (err) {
      alert('Failed to toggle availability');
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await cancelBooking(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeBooking(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: '', category: 'Sedan', type: 'CAR', pricePerDay: '', description: '', imageUrl: '' });
  };

  const getStatusBadge = (status) => {
    const map = { PENDING: 'bg-warning', APPROVED: 'bg-info', COMPLETED: 'bg-success', CANCELLED: 'bg-danger' };
    return map[status] || 'bg-secondary';
  };

  // Prepare chart data
  const bookingStatusData = stats ? [
    { name: 'Pending', value: stats.pendingBookings },
    { name: 'Approved', value: stats.approvedBookings },
    { name: 'Completed', value: stats.completedBookings },
    { name: 'Cancelled', value: stats.cancelledBookings },
  ].filter(d => d.value > 0) : [];

  const monthlyRevenueData = stats?.monthlyRevenue || [];

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
            <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'vehicles' ? 'active' : ''}`} onClick={() => setActiveTab('vehicles')}>
              Vehicles ({vehicles.length})
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
              Bookings ({bookings.length})
            </button>
          </li>
        </ul>

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === 'dashboard' && stats && (
          <div>
            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card text-white bg-primary h-100">
                  <div className="card-body">
                    <h6 className="card-title">Total Users</h6>
                    <h2>{stats.totalUsers}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-white bg-success h-100">
                  <div className="card-body">
                    <h6 className="card-title">Total Vehicles</h6>
                    <h2>{stats.totalVehicles}</h2>
                    <small>{stats.availableVehicles} available</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-white bg-info h-100">
                  <div className="card-body">
                    <h6 className="card-title">Total Bookings</h6>
                    <h2>{stats.totalBookings}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-white bg-warning h-100">
                  <div className="card-body">
                    <h6 className="card-title">Total Revenue</h6>
                    <h2>₹{stats.totalRevenue?.toFixed(2) || '0.00'}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="row">
              <div className="col-lg-8 mb-4">
                <div className="card">
                  <div className="card-header"><h5 className="mb-0">Monthly Revenue</h5></div>
                  <div className="card-body">
                    {monthlyRevenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(val) => `₹${val.toFixed(2)}`} />
                          <Bar dataKey="revenue" fill="#4361ee" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted text-center py-5">No revenue data yet</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-4">
                <div className="card">
                  <div className="card-header"><h5 className="mb-0">Booking Status</h5></div>
                  <div className="card-body">
                    {bookingStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={bookingStatusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                            {bookingStatusData.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted text-center py-5">No bookings yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== VEHICLES TAB ===== */}
        {activeTab === 'vehicles' && (
          <div className="vehicles-section">
            {!showAddForm ? (
              <button className="btn btn-primary mb-4" onClick={() => setShowAddForm(true)}>
                + Add New Vehicle
              </button>
            ) : (
              <div className="add-vehicle-form card p-4 mb-4">
                <h4>{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h4>
                <form onSubmit={handleAddOrUpdate}>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Vehicle Name *</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleFormChange} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Category *</label>
                      <select className="form-control" name="category" value={formData.category} onChange={handleFormChange} required>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Sports">Sports</option>
                        <option value="Bike">Bike</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Type *</label>
                      <select className="form-control" name="type" value={formData.type} onChange={handleFormChange} required>
                        <option value="CAR">Car</option>
                        <option value="BIKE">Bike</option>
                        <option value="TOOL">Tool</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Price Per Day *</label>
                      <input type="number" className="form-control" name="pricePerDay" value={formData.pricePerDay} onChange={handleFormChange} step="0.01" required />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Image URL</label>
                      <input type="text" className="form-control" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleFormChange} rows="2" />
                  </div>
                  <div>
                    <button type="submit" className="btn btn-success me-2">{editingId ? 'Update' : 'Add'} Vehicle</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {!showAddForm && (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price/Day</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <img src={v.imageUrl || 'https://via.placeholder.com/50'} alt={v.name} style={{ width: 50, height: 35, objectFit: 'cover', borderRadius: 4 }} />
                        </td>
                        <td><strong>{v.name}</strong></td>
                        <td>{v.category}</td>
                        <td>₹{v.pricePerDay}</td>
                        <td>{v.averageRating > 0 ? `${v.averageRating.toFixed(1)} ★` : 'N/A'}</td>
                        <td>
                          <span className={`badge ${v.available ? 'bg-success' : 'bg-danger'}`} style={{ cursor: 'pointer' }} onClick={() => handleToggle(v.id)}>
                            {v.available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(v)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(v.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== BOOKINGS TAB ===== */}
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-light">
                  <tr>
                    <th>#ID</th>
                    <th>User</th>
                    <th>Vehicle</th>
                    <th>Dates</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td><strong>#{b.id}</strong></td>
                      <td>{b.userName}</td>
                      <td>{b.vehicleName}</td>
                      <td>{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</td>
                      <td>₹{b.totalPrice}</td>
                      <td><span className={`badge ${getStatusBadge(b.status)}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'PENDING' && (
                          <>
                            <button className="btn btn-sm btn-success me-1" onClick={() => handleApprove(b.id)}>Approve</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleCancelBooking(b.id)}>Cancel</button>
                          </>
                        )}
                        {b.status === 'APPROVED' && (
                          <button className="btn btn-sm btn-primary" onClick={() => handleComplete(b.id)}>Complete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && <div className="alert alert-info">No bookings found</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
