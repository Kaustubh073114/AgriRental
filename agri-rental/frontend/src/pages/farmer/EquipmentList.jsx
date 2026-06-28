import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import EquipmentCard from '../../components/EquipmentCard';
import './EquipmentList.css';

const TYPES = ['All', 'Tractor', 'Harvester', 'Plough', 'Seeder', 'Sprayer', 'Rotavator', 'Other'];

export default function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', location: '', minPrice: '', maxPrice: '' });
  const [search, setSearch] = useState('');

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type && filters.type !== 'All') params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      const { data } = await API.get(`/equipment?${params}`);
      setEquipment(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEquipment(); }, []);

  const filtered = equipment.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1 className="page-title">Browse Equipment</h1>

      <div className="filter-bar card">
        <input
          className="search-input"
          placeholder="🔍  Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-row">
          <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
            {TYPES.map(t => <option key={t} value={t === 'All' ? '' : t}>{t}</option>)}
          </select>
          <input placeholder="Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
          <input type="number" placeholder="Min Price (₹)" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
          <input type="number" placeholder="Max Price (₹)" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
          <button className="btn btn-primary btn-sm" onClick={fetchEquipment}>Apply</button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setFilters({ type: '', location: '', minPrice: '', maxPrice: '' }); setSearch(''); fetchEquipment(); }}>Clear</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading equipment...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">No equipment found. Try changing filters.</div>
      ) : (
        <>
          <p className="result-count">{filtered.length} equipment found</p>
          <div className="eq-grid">
            {filtered.map(e => <EquipmentCard key={e._id} equipment={e} />)}
          </div>
        </>
      )}
    </div>
  );
}
