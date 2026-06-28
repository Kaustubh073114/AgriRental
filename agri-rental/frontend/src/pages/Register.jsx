import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer', phone: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      if (data.user.role === 'farmer') navigate('/equipment');
      else navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) });

  return (
    <div className="auth-wrapper">
      <div className="auth-card card">
        <div className="auth-logo">🌾</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join the AgriRental community</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" {...f('name')} required placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...f('email')} required placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" {...f('password')} required placeholder="Min 6 characters" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" {...f('phone')} placeholder="+91 XXXXXXXXXX" />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" {...f('location')} placeholder="City, State" />
          </div>
          <div className="form-group">
            <label>Register as</label>
            <select {...f('role')}>
              <option value="farmer">Farmer (I want to rent equipment)</option>
              <option value="owner">Equipment Owner (I want to list equipment)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
