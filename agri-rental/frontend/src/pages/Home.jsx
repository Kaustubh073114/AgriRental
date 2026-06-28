import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Agricultural Equipment Sharing</span>
          <h1>Rent Smarter.<br />Farm Better.</h1>
          <p>Connect with equipment owners across India. Affordable, transparent, and fully digital rental platform for every farmer.</p>
          <div className="hero-btns">
            <Link to="/equipment" className="btn btn-white">Browse Equipment</Link>
            <Link to="/register" className="btn btn-outline-white">Register Free</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><span className="stat-n">500+</span><span className="stat-l">Equipment Listed</span></div>
          <div className="hero-stat"><span className="stat-n">1200+</span><span className="stat-l">Farmers Helped</span></div>
          <div className="hero-stat"><span className="stat-n">98%</span><span className="stat-l">Satisfaction Rate</span></div>
        </div>
      </section>

      <section className="how-section page">
        <div className="section-tag">How It Works</div>
        <h2 className="section-h">Simple 3-Step Process</h2>
        <div className="grid-3 steps-grid">
          {[
            { icon: '🔍', title: 'Search Equipment', desc: 'Find tractors, harvesters and more near your location with powerful filters.' },
            { icon: '📅', title: 'Book & Pay', desc: 'Select your dates, send a booking request, and pay securely after approval.' },
            { icon: '🚜', title: 'Use & Review', desc: 'Get your equipment, complete your work, and leave a rating for others.' },
          ].map((s, i) => (
            <div key={i} className="step-card card">
              <div className="step-icon">{s.icon}</div>
              <div className="step-num">Step {i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="role-section">
        <div className="page">
          <div className="section-tag">Platform Roles</div>
          <h2 className="section-h">Built for Everyone</h2>
          <div className="grid-3">
            {[
              { role: 'Farmer', color: 'green', icon: '👨‍🌾', features: ['Search & filter equipment', 'Book with date picker', 'Pay securely online', 'Rate & review owners'], link: '/register', cta: 'Join as Farmer' },
              { role: 'Equipment Owner', color: 'amber', icon: '🚜', features: ['List your equipment', 'Accept/reject bookings', 'Track your earnings', 'Manage availability'], link: '/register', cta: 'List Equipment' },
              { role: 'Admin', color: 'teal', icon: '🛠️', features: ['Verify users & equipment', 'Monitor all bookings', 'Remove fraud accounts', 'View analytics'], link: '/login', cta: 'Admin Login' },
            ].map((r, i) => (
              <div key={i} className={`role-card card role-${r.color}`}>
                <div className="role-icon">{r.icon}</div>
                <h3>{r.role}</h3>
                <ul>{r.features.map((f, j) => <li key={j}>✓ {f}</li>)}</ul>
                <Link to={r.link} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>{r.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>🌾 AgriRental — Empowering Indian Farmers · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
