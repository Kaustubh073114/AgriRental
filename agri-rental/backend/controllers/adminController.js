const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPendingEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({ isVerified: false }).populate('owner', 'name email');
    res.json(equipment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.verifyEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    res.json(equipment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('farmer', 'name email')
      .populate('equipment', 'name type')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [users, equipment, bookings] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Equipment.countDocuments(),
      Booking.countDocuments(),
    ]);
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } }
    ]);
    res.json({ users, equipment, bookings, revenue: revenue[0]?.total || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
