const Review = require('../models/Review');
const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');

exports.addReview = async (req, res) => {
  try {
    const { equipmentId, bookingId, rating, comment } = req.body;
    const booking = await Booking.findOne({ _id: bookingId, farmer: req.user.id, status: { $in: ['paid', 'completed'] } });
    if (!booking) return res.status(400).json({ message: 'Can only review after completed booking' });
    const existing = await Review.findOne({ booking: bookingId });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });
    const review = await Review.create({ farmer: req.user.id, equipment: equipmentId, booking: bookingId, rating, comment });
    const reviews = await Review.find({ equipment: equipmentId });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Equipment.findByIdAndUpdate(equipmentId, { avgRating: avg.toFixed(1), totalRatings: reviews.length });
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getEquipmentReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ equipment: req.params.id }).populate('farmer', 'name');
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
