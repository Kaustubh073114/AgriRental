const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  type:        { type: String, required: true },
  description: { type: String },
  pricePerDay: { type: Number, required: true },
  location:    { type: String, required: true },
  images:      [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  isVerified:  { type: Boolean, default: false },
  avgRating:   { type: Number, default: 0 },
  totalRatings:{ type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
