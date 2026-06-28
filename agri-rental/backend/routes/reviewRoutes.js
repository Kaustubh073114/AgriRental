const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/reviewController');
router.post('/', protect, ctrl.addReview);
router.get('/:id', ctrl.getEquipmentReviews);
module.exports = router;
