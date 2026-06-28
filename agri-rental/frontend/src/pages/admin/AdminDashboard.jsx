import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Users', value: stats?.users ?? 0, icon: '👤', color: 'teal', link: '/admin/users' },
          { label: 'Equipment', value: stats?.equipment ?? 0, icon: '🚜', color: 'green', link: '/admin/equipment' },
          { label: 'Bookings', value: stats?.bookings ?? 0, icon: '📅', color: 'amber', link: '/admin/bookings' },
          { label: 'Revenue', value: `₹${(stats?.revenue ?? 0).toLocaleString('en-IN')}`, icon: '💰', color: 'green', link: '/admin/bookings' },
        ].map((s, i) => (
          <Link to={s.link} key={i} className={`admin-stat-card card color-${s.color}`} style={{ textDecoration: 'none' }}>
            <div className="admin-stat-icon">{s.icon}</div>
            <div className="admin-stat-val">{s.value}</div>
            <div className="admin-stat-lbl">{s.label}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Quick Actions</h2>
      <div className="grid-3">
        {[
          { title: 'Verify Users', desc: 'Approve new farmer and owner registrations', icon: '✅', link: '/admin/users', btn: 'Manage Users' },
          { title: 'Verify Equipment', desc: 'Review pending equipment listings before publishing', icon: '🔍', link: '/admin/equipment', btn: 'Review Listings' },
          { title: 'Monitor Bookings', desc: 'Track all bookings and payment statuses', icon: '📊', link: '/admin/bookings', btn: 'View Bookings' },
        ].map((q, i) => (
          <div key={i} className="card quick-card">
            <div className="quick-icon">{q.icon}</div>
            <h3 style={{ fontSize: '1rem', marginBottom: '.5rem' }}>{q.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.5', marginBottom: '1rem' }}>{q.desc}</p>
            <Link to={q.link} className="btn btn-primary btn-sm">{q.btn}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
