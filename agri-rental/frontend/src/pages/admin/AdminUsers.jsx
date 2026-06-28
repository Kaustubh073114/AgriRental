import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const verifyUser = async (id) => {
    try {
      await API.put(`/admin/users/${id}/verify`);
      setMsg('User verified!');
      fetchUsers();
    } catch (err) { setMsg('Action failed'); }
  };

  const banUser = async (id) => {
    if (!window.confirm('Ban this user?')) return;
    try {
      await API.put(`/admin/users/${id}/ban`);
      setMsg('User banned.');
      fetchUsers();
    } catch (err) { setMsg('Action failed'); }
  };

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="page">
      <h1 className="page-title">User Management</h1>
      {msg && <div className="success-msg">{msg}</div>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        {['all', 'farmer', 'owner'].map(r => (
          <button key={r} className={`btn btn-sm ${filter === r ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(r)} style={{ textTransform: 'capitalize' }}>
            {r} ({r === 'all' ? users.length : users.filter(u => u.role === r).length})
          </button>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Location</th><th>Verified</th><th>Banned</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td><strong>{u.name}</strong></td>
                <td style={{ fontSize: '12px' }}>{u.email}</td>
                <td><span className={`badge ${u.role === 'farmer' ? 'badge-accepted' : 'badge-pending'}`}>{u.role}</span></td>
                <td style={{ fontSize: '12px' }}>{u.phone || '—'}</td>
                <td style={{ fontSize: '12px' }}>{u.location || '—'}</td>
                <td>{u.isVerified ? '✅' : '❌'}</td>
                <td>{u.isBanned ? '🚫' : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {!u.isVerified && !u.isBanned && (
                      <button className="btn btn-primary btn-sm" onClick={() => verifyUser(u._id)}>Verify</button>
                    )}
                    {!u.isBanned && (
                      <button className="btn btn-danger btn-sm" onClick={() => banUser(u._id)}>Ban</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">No users found.</div>}
      </div>
    </div>
  );
}
