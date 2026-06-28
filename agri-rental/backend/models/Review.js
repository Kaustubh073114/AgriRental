const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  farmer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  booking:   { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
