// bookingRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/bookingController');
router.post('/', protect, ctrl.createBooking);
router.get('/farmer', protect, ctrl.getFarmerBookings);
router.get('/owner', protect, ctrl.getOwnerBookings);
router.put('/:id/status', protect, ctrl.updateBookingStatus);
router.put('/:id/pay', protect, ctrl.payBooking);
module.exports = router;
