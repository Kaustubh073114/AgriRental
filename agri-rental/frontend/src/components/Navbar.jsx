import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = () => {
    if (!user) return (
      <>
        <Link to="/equipment">Browse Equipment</Link>
        <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
        <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
      </>
    );
    if (user.role === 'farmer') return (
      <>
        <Link to="/equipment">Browse</Link>
        <Link to="/my-bookings">My Bookings</Link>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
      </>
    );
    if (user.role === 'owner') return (
      <>
        <Link to="/owner/dashboard">Dashboard</Link>
        <Link to="/owner/add-equipment">Add Equipment</Link>
        <Link to="/owner/bookings">Bookings</Link>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
      </>
    );
    if (user.role === 'admin') return (
      <>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/equipment">Equipment</Link>
        <Link to="/admin/bookings">Bookings</Link>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
      </>
    );
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🌾 AgriRental</Link>
      <div className={`navbar-links ${open ? 'open' : ''}`}>{navLinks()}</div>
      <button className="hamburger" onClick={() => setOpen(!open)}>☰</button>
    </nav>
  );
}
