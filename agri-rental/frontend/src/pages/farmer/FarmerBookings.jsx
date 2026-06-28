import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import './FarmerBookings.css';

export default function FarmerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ bookingId: '', equipmentId: '', rating: 5, comment: '' });
  const [showReview, setShowReview] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/farmer');
      setBookings(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handlePay = async (id) => {
    try {
      await API.put(`/bookings/${id}/pay`);
      setMsg('Payment successful!');
      fetchBookings();
    } catch (err) { setMsg(err.response?.data?.message || 'Payment failed'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reviews', review);
      setMsg('Review submitted!');
      setShowReview(null);
      fetchBookings();
    } catch (err) { setMsg(err.response?.data?.message || 'Review failed'); }
  };

  if (loading) return <div className="loading">Loading your bookings...</div>;

  return (
    <div className="page">
      <h1 className="page-title">My Bookings</h1>
      {msg && <div className="success-msg">{msg}</div>}
      {bookings.length === 0 ? (
        <div className="empty">No bookings yet. <a href="/equipment">Browse equipment</a></div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b._id} className="booking-card card">
              <div className="booking-header">
                <div>
                  <h3>{b.equipment?.name}</h3>
                  <p className="booking-meta">📦 {b.equipment?.type} · 📍 {b.equipment?.location}</p>
                </div>
                <span className={`badge badge-${b.status}`}>{b.status}</span>
              </div>
              <div className="booking-details">
                <div className="detail-item"><span>From</span><strong>{new Date(b.startDate).toLocaleDateString('en-IN')}</strong></div>
                <div className="detail-item"><span>To</span><strong>{new Date(b.endDate).toLocaleDateString('en-IN')}</strong></div>
                <div className="detail-item"><span>Days</span><strong>{b.totalDays}</strong></div>
                <div className="detail-item"><span>Total</span><strong className="cost">₹{b.totalCost}</strong></div>
                <div className="detail-item"><span>Payment</span><strong>{b.paymentStatus}</strong></div>
              </div>
              <div className="booking-actions">
                {b.status === 'accepted' && b.paymentStatus === 'unpaid' && (
                  <button className="btn btn-primary btn-sm" onClick={() => handlePay(b._id)}>💳 Pay ₹{b.totalCost}</button>
                )}
                {(b.status === 'paid' || b.status === 'completed') && (
                  <button className="btn btn-amber btn-sm" onClick={() => {
                    setShowReview(b._id);
                    setReview({ bookingId: b._id, equipmentId: b.equipment._id, rating: 5, comment: '' });
                  }}>⭐ Leave Review</button>
                )}
              </div>

              {showReview === b._id && (
                <form className="review-form" onSubmit={handleReview}>
                  <div className="form-group">
                    <label>Rating</label>
                    <select value={review.rating} onChange={e => setReview({ ...review, rating: Number(e.target.value) })}>
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comment</label>
                    <textarea rows={3} value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} placeholder="Share your experience..." />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary btn-sm">Submit Review</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowReview(null)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
