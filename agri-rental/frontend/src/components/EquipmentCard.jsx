import React from 'react';
import { Link } from 'react-router-dom';
import './EquipmentCard.css';

export default function EquipmentCard({ equipment }) {
  const { _id, name, type, pricePerDay, location, images, avgRating, totalRatings, owner } = equipment;
  const imgSrc = images?.[0] ? `/uploads/${images[0]}` : '/placeholder.jpg';

  return (
    <div className="eq-card">
      <div className="eq-card-img">
        <img src={imgSrc} alt={name} onError={e => e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'} />
        <span className="eq-type-badge">{type}</span>
      </div>
      <div className="eq-card-body">
        <h3 className="eq-name">{name}</h3>
        <p className="eq-location">📍 {location}</p>
        {owner && <p className="eq-owner">Owner: {owner.name}</p>}
        <div className="eq-footer">
          <div>
            <span className="eq-price">₹{pricePerDay}</span>
            <span className="eq-per"> /day</span>
          </div>
          <div className="eq-rating">
            <span className="star">★</span>
            <span>{avgRating > 0 ? Number(avgRating).toFixed(1) : 'New'}</span>
            {totalRatings > 0 && <span className="eq-rat-count">({totalRatings})</span>}
          </div>
        </div>
        <Link to={`/equipment/${_id}`} className="btn btn-primary btn-sm eq-btn">View Details</Link>
      </div>
    </div>
  );
}
