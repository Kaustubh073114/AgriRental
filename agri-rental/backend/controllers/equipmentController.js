const Equipment = require('../models/Equipment');

exports.getAllEquipment = async (req, res) => {
  try {
    const { type, location, minPrice, maxPrice } = req.query;
    const filter = { isVerified: true, isAvailable: true };
    if (type) filter.type = new RegExp(type, 'i');
    if (location) filter.location = new RegExp(location, 'i');
    if (minPrice || maxPrice) filter.pricePerDay = {};
    if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    const equipment = await Equipment.find(filter).populate('owner', 'name phone location');
    res.json(equipment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate('owner', 'name phone location email');
    if (!equipment) return res.status(404).json({ message: 'Not found' });
    res.json(equipment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createEquipment = async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => f.filename) : [];
    const equipment = await Equipment.create({ ...req.body, owner: req.user.id, images });
    res.status(201).json(equipment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findOne({ _id: req.params.id, owner: req.user.id });
    if (!equipment) return res.status(404).json({ message: 'Not found or unauthorized' });
    Object.assign(equipment, req.body);
    await equipment.save();
    res.json(equipment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteEquipment = async (req, res) => {
  try {
    await Equipment.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOwnerEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({ owner: req.user.id });
    res.json(equipment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
