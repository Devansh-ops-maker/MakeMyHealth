const Prescription = require('../models/prescription.js');

exports.createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription({
      ...req.body,
      prescriptionId: generateUniqueCode()
    });
    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const prescriptions = await Prescription
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ dateCreated: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateUniqueCode = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 5);
  return (timestamp + randomStr).toUpperCase().slice(-8);
};
