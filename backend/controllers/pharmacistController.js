const Pharmacist = require('../models/pharmacist');

exports.createPharmacist = async (req, res) => {
  try {
    const pharmacist = new Pharmacist(req.body);
    await pharmacist.save();
    res.status(201).json(pharmacist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPharmacists = async (req, res) => {
  try {
    const { pharmacy, status, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (pharmacy) query.associatedPharmacy = pharmacy;
    if (status) query.status = status;

    const pharmacists = await Pharmacist.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Pharmacist.countDocuments(query);

    res.json({
      pharmacists,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPharmacists: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPharmacistById = async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findById(req.params.id);
    if (!pharmacist) return res.status(404).json({ error: 'Pharmacist not found' });
    res.json(pharmacist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePharmacist = async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pharmacist) return res.status(404).json({ error: 'Pharmacist not found' });
    res.json(pharmacist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePharmacist = async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findByIdAndDelete(req.params.id);
    if (!pharmacist) return res.status(404).json({ error: 'Pharmacist not found' });
    res.json({ message: 'Pharmacist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
