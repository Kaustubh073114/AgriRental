import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function AdminEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchPending = async () => {
    try {
      const { data } = await API.get('/admin/equipment/pending');
      setEquipment(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPending(); }, []);

  const verify = async (id) => {
    try {
      await API.put(`/admin/equipment/${id}/verify`);
      setMsg('Equipment verified and published!');
      fetchPending();
    } catch (err) { setMsg('Action failed'); }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1 className="page-title">Equipment Verification</h1>
      {msg && <div className="success-msg">{msg}</div>}
      <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginBottom: '1.25rem' }}>
        Equipment listed below is pending admin review before going live.
      </p>

      {equipment.length === 0 ? (
        <div className="empty">🎉 No pending equipment. All listings are verified.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {equipment.map(e => (
            <div key={e._id} className="card">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <img
                  src={e.images?.[0] ? `/uploads/${e.images[0]}` : 'https://via.placeholder.com/120x90?text=No+Image'}
                  alt={e.name}
                  onError={ev => ev.target.src = 'https://via.placeholder.com/120x90?text=No+Image'}
                  style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '4px' }}>{e.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '6px' }}>
                    📦 {e.type} · 📍 {e.location} · ₹{e.pricePerDay}/day
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginBottom: '8px' }}>
                    Owner: <strong>{e.owner?.name}</strong> ({e.owner?.email})
                  </p>
                  {e.description && (
                    <p style={{ fontSize: '12px', color: 'var(--gray-600)', lineHeight: '1.5' }}>{e.description}</p>
                  )}
                  <div style={{ marginTop: '10px' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => verify(e._id)}>✅ Verify & Publish</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
