import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const TYPES = ['Tractor', 'Harvester', 'Plough', 'Seeder', 'Sprayer', 'Rotavator', 'Other'];

export default function AddEquipment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', type: 'Tractor', description: '', pricePerDay: '', location: '' });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const f = (field) => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach(img => formData.append('images', img));
      await API.post('/equipment', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add equipment');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <h1 className="page-title">Add New Equipment</h1>
      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Equipment Name *</label>
            <input type="text" {...f('name')} required placeholder="e.g. Mahindra Tractor 575" />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Type *</label>
              <select {...f('type')}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price per Day (₹) *</label>
              <input type="number" {...f('pricePerDay')} required placeholder="e.g. 1500" min="1" />
            </div>
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input type="text" {...f('location')} required placeholder="City, State" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} {...f('description')} placeholder="Describe condition, features, usage instructions..." />
          </div>
          <div className="form-group">
            <label>Equipment Images (max 5)</label>
            <input
              type="file" multiple accept="image/*"
              onChange={e => setImages(Array.from(e.target.files).slice(0, 5))}
            />
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <img key={i} src={URL.createObjectURL(img)} alt=""
                    style={{ width: '70px', height: '55px', objectFit: 'cover', borderRadius: '6px' }} />
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/owner/dashboard')}>Cancel</button>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '.75rem' }}>
            ℹ️ Your equipment will be reviewed by admin before it goes live.
          </p>
        </form>
      </div>
    </div>
  );
}
