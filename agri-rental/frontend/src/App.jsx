import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import EquipmentList from './pages/farmer/EquipmentList';
import EquipmentDetail from './pages/farmer/EquipmentDetail';
import FarmerBookings from './pages/farmer/FarmerBookings';

import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddEquipment from './pages/owner/AddEquipment';
import OwnerBookings from './pages/owner/OwnerBookings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEquipment from './pages/admin/AdminEquipment';
import AdminBookings from './pages/admin/AdminBookings';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Farmer Routes */}
        <Route path="/equipment" element={<EquipmentList />} />
        <Route path="/equipment/:id" element={<EquipmentDetail />} />
        <Route path="/my-bookings" element={
          <PrivateRoute roles={['farmer']}><FarmerBookings /></PrivateRoute>
        } />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={
          <PrivateRoute roles={['owner']}><OwnerDashboard /></PrivateRoute>
        } />
        <Route path="/owner/add-equipment" element={
          <PrivateRoute roles={['owner']}><AddEquipment /></PrivateRoute>
        } />
        <Route path="/owner/bookings" element={
          <PrivateRoute roles={['owner']}><OwnerBookings /></PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>
        } />
        <Route path="/admin/equipment" element={
          <PrivateRoute roles={['admin']}><AdminEquipment /></PrivateRoute>
        } />
        <Route path="/admin/bookings" element={
          <PrivateRoute roles={['admin']}><AdminBookings /></PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
