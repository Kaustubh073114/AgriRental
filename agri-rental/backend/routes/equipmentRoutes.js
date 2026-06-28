const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/equipmentController');

const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads');

// auto-create folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.get('/', ctrl.getAllEquipment);
router.get('/my', protect, ctrl.getOwnerEquipment);
router.get('/:id', ctrl.getEquipmentById);
router.post('/', protect, upload.array('images', 5), ctrl.createEquipment);
router.put('/:id', protect, ctrl.updateEquipment);
router.delete('/:id', protect, ctrl.deleteEquipment);

module.exports = router;
