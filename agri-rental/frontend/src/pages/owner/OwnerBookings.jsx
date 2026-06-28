import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/owner');
      setBookings(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      setMsg(`Booking ${status} successfully.`);
      fetchBookings();
    } catch (err) { setMsg(err.response?.data?.message || 'Update failed'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="page">
      <h1 className="page-title">Manage Bookings</h1>
      {msg && <div className="success-msg">{msg}</div>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'accepted', 'rejected', 'paid'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s} {s !== 'all' && `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No bookings found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(b => (
            <div key={b._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{b.equipment?.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>📦 {b.equipment?.type}</p>
                </div>
                <span className={`badge badge-${b.status}`}>{b.status}</span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', background: 'var(--gray-100)', borderRadius: '8px', padding: '12px 14px', margin: '1rem 0' }}>
                <div><div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Farmer</div><strong style={{ fontSize: '14px' }}>{b.farmer?.name}</strong></div>
                <div><div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Phone</div><strong style={{ fontSize: '14px' }}>{b.farmer?.phone || 'N/A'}</strong></div>
                <div><div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Start</div><strong style={{ fontSize: '14px' }}>{new Date(b.startDate).toLocaleDateString('en-IN')}</strong></div>
                <div><div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase' }}>End</div><strong style={{ fontSize: '14px' }}>{new Date(b.endDate).toLocaleDateString('en-IN')}</strong></div>
                <div><div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Days</div><strong style={{ fontSize: '14px' }}>{b.totalDays}</strong></div>
                <div><div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Amount</div><strong style={{ fontSize: '14px', color: 'var(--green-dark)' }}>₹{b.totalCost}</strong></div>
                <div><div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Payment</div><strong style={{ fontSize: '14px' }}>{b.paymentStatus}</strong></div>
              </div>

              {b.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => updateStatus(b._id, 'accepted')}>✅ Accept</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b._id, 'rejected')}>❌ Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
