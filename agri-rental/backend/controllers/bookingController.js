const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

exports.createBooking = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate } = req.body;
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment || !equipment.isAvailable) return res.status(400).json({ message: 'Equipment not available' });
    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    if (totalDays < 1) return res.status(400).json({ message: 'Invalid dates' });
    const totalCost = totalDays * equipment.pricePerDay;
    const booking = await Booking.create({ farmer: req.user.id, equipment: equipmentId, startDate, endDate, totalDays, totalCost });
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getFarmerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ farmer: req.user.id }).populate('equipment', 'name type pricePerDay images location').sort('-createdAt');
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const myEquipment = await Equipment.find({ owner: req.user.id }).select('_id');
    const ids = myEquipment.map(e => e._id);
    const bookings = await Booking.find({ equipment: { $in: ids } })
      .populate('farmer', 'name phone email')
      .populate('equipment', 'name type pricePerDay')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('equipment');
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (String(booking.equipment.owner) !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.payBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, farmer: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (booking.status !== 'accepted') return res.status(400).json({ message: 'Booking not accepted yet' });
    booking.paymentStatus = 'paid';
    booking.status = 'paid';
    await booking.save();
    res.json({ message: 'Payment successful', booking });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
