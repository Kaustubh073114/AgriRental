import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/admin/bookings')
      .then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => !search ||
      b.farmer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.equipment?.name?.toLowerCase().includes(search.toLowerCase())
    );

  const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalCost, 0);

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>All Bookings</h1>
        <div style={{ background: 'var(--green-light)', color: 'var(--green-dark)', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
          💰 Total Revenue: ₹{totalRevenue.toLocaleString('en-IN')}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Search by farmer or equipment..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', minWidth: '240px', fontFamily: 'inherit', outline: 'none' }}
        />
        {['all', 'pending', 'accepted', 'rejected', 'paid', 'completed'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr><th>Equipment</th><th>Farmer</th><th>Dates</th><th>Days</th><th>Amount</th><th>Status</th><th>Payment</th></tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b._id}>
                <td><strong style={{ fontSize: '13px' }}>{b.equipment?.name}</strong><br /><span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{b.equipment?.type}</span></td>
                <td><strong style={{ fontSize: '13px' }}>{b.farmer?.name}</strong><br /><span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{b.farmer?.email}</span></td>
                <td style={{ fontSize: '12px' }}>
                  {new Date(b.startDate).toLocaleDateString('en-IN')}<br />→ {new Date(b.endDate).toLocaleDateString('en-IN')}
                </td>
                <td>{b.totalDays}</td>
                <td><strong>₹{b.totalCost}</strong></td>
                <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                <td><span className={`badge ${b.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}`}>{b.paymentStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">No bookings found.</div>}
      </div>
      <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '.75rem' }}>{filtered.length} bookings shown</p>
    </div>
  );
}
