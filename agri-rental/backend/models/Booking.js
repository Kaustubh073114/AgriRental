const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  farmer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  startDate: { type: Date, required: true },
  endDate:   { type: Date, required: true },
  totalDays: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  status:    { type: String, enum: ['pending', 'accepted', 'rejected', 'paid', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
