import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './EquipmentDetail.css';

export default function EquipmentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [booking, setBooking] = useState({ startDate: '', endDate: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [eq, rv] = await Promise.all([
          API.get(`/equipment/${id}`),
          API.get(`/reviews/${id}`)
        ]);
        setEquipment(eq.data);
        setReviews(rv.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    if (!user) return setError('Please login to book equipment.');
    if (user.role !== 'farmer') return setError('Only farmers can book equipment.');
    try {
      await API.post('/bookings', { equipmentId: id, ...booking });
      setMsg('Booking request sent! Wait for owner approval.');
      setBooking({ startDate: '', endDate: '' });
    } catch (err) { setError(err.response?.data?.message || 'Booking failed'); }
  };

  const totalDays = booking.startDate && booking.endDate
    ? Math.max(0, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000))
    : 0;

  if (loading) return <div className="loading">Loading...</div>;
  if (!equipment) return <div className="empty">Equipment not found.</div>;

  const { name, type, description, pricePerDay, location, images, owner, avgRating, totalRatings, isAvailable } = equipment;

  return (
    <div className="page">
      <div className="detail-grid">
        <div>
          <div className="img-main">
            <img
              src={images?.[activeImg] ? `/uploads/${images[activeImg]}` : 'https://via.placeholder.com/500x300?text=No+Image'}
              alt={name}
              onError={e => e.target.src = 'https://via.placeholder.com/500x300?text=No+Image'}
            />
          </div>
          {images?.length > 1 && (
            <div className="img-thumbs">
              {images.map((img, i) => (
                <img key={i} src={`/uploads/${img}`} alt="" className={activeImg === i ? 'active' : ''} onClick={() => setActiveImg(i)} />
              ))}
            </div>
          )}

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Reviews ({totalRatings})</h3>
            {reviews.length === 0 ? <p className="empty" style={{ padding: '1rem 0' }}>No reviews yet.</p> : (
              reviews.map(r => (
                <div key={r._id} className="review-item">
                  <div className="review-top">
                    <strong>{r.farmer?.name}</strong>
                    <span className="star">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <span className={`badge ${isAvailable ? 'badge-accepted' : 'badge-rejected'}`}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
            <h1 style={{ marginTop: '.75rem', fontSize: '1.6rem' }}>{name}</h1>
            <p className="detail-type">📦 {type}</p>
            <p className="detail-loc">📍 {location}</p>
            <div className="detail-rating">
              <span className="star">★</span>
              <span>{avgRating > 0 ? Number(avgRating).toFixed(1) : 'No ratings'}</span>
              {totalRatings > 0 && <span className="gray">({totalRatings} reviews)</span>}
            </div>
            <p className="detail-desc">{description}</p>
            <div className="price-row">
              <span className="big-price">₹{pricePerDay}</span>
              <span className="gray">/day</span>
            </div>

            {owner && (
              <div className="owner-box">
                <div className="owner-avatar">{owner.name?.[0]?.toUpperCase()}</div>
                <div>
                  <div className="owner-name">{owner.name}</div>
                  <div className="owner-info">{owner.phone} · {owner.location}</div>
                </div>
              </div>
            )}
          </div>

          {isAvailable && (
            <div className="card" style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Book This Equipment</h3>
              {msg && <div className="success-msg">{msg}</div>}
              {error && <div className="error-msg">{error}</div>}
              <form onSubmit={handleBook}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={booking.startDate} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setBooking({ ...booking, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={booking.endDate} min={booking.startDate || new Date().toISOString().split('T')[0]}
                    onChange={e => setBooking({ ...booking, endDate: e.target.value })} required />
                </div>
                {totalDays > 0 && (
                  <div className="cost-preview">
                    <span>{totalDays} days × ₹{pricePerDay}</span>
                    <span className="total-cost">₹{totalDays * pricePerDay}</span>
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '.75rem' }}>
                  Send Booking Request
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
