import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './OwnerDashboard.css';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [eq, bk] = await Promise.all([
          API.get('/equipment/my'),
          API.get('/bookings/owner')
        ]);
        setEquipment(eq.data);
        setBookings(bk.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const totalEarnings = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalCost, 0);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="page">
      <div className="dash-header">
        <div>
          <h1 className="page-title" style={{ marginBottom: '.25rem' }}>Welcome, {user?.name} 👋</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '13px' }}>Equipment Owner Dashboard</p>
        </div>
        <Link to="/owner/add-equipment" className="btn btn-primary">+ Add Equipment</Link>
      </div>

      <div className="grid-4 stats-row">
        {[
          { label: 'Total Equipment', value: equipment.length, icon: '🚜' },
          { label: 'Total Bookings', value: bookings.length, icon: '📅' },
          { label: 'Pending Requests', value: pendingCount, icon: '⏳' },
          { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString('en-IN')}`, icon: '💰' },
        ].map((s, i) => (
          <div key={i} className="stat-card card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-val">{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.2rem', margin: '2rem 0 1rem' }}>My Equipment</h2>
      {equipment.length === 0 ? (
        <div className="empty">No equipment listed yet. <Link to="/owner/add-equipment">Add your first one!</Link></div>
      ) : (
        <div className="grid-3">
          {equipment.map(e => (
            <div key={e._id} className="card eq-owner-card">
              <div className="eq-owner-img">
                <img
                  src={e.images?.[0] ? `/uploads/${e.images[0]}` : 'https://via.placeholder.com/300x120?text=No+Image'}
                  alt={e.name}
                  onError={ev => ev.target.src = 'https://via.placeholder.com/300x120?text=No+Image'}
                />
              </div>
              <h3 style={{ marginBottom: '4px', fontSize: '0.95rem' }}>{e.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '6px' }}>📦 {e.type} · ₹{e.pricePerDay}/day</p>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className={`badge ${e.isVerified ? 'badge-accepted' : 'badge-pending'}`}>
                  {e.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
                <span className={`badge ${e.isAvailable ? 'badge-paid' : 'badge-rejected'}`}>
                  {e.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: '1.2rem', margin: '2rem 0 1rem' }}>Recent Bookings</h2>
      {bookings.length === 0 ? (
        <div className="empty">No bookings yet.</div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Equipment</th><th>Farmer</th><th>Dates</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map(b => (
                <tr key={b._id}>
                  <td>{b.equipment?.name}</td>
                  <td>{b.farmer?.name}</td>
                  <td style={{ fontSize: '12px' }}>
                    {new Date(b.startDate).toLocaleDateString('en-IN')} → {new Date(b.endDate).toLocaleDateString('en-IN')}
                  </td>
                  <td>₹{b.totalCost}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length > 5 && <Link to="/owner/bookings" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem', display: 'inline-block' }}>View All Bookings</Link>}
        </div>
      )}
    </div>
  );
}
