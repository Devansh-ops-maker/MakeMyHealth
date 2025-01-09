import Prescription from '../models/prescription.js';

const createPrescription = async (req, res) => {
  const { hospitalName, patientName, patientAge, symptoms, diagnosis, medicines } = req.body;

  try {
    const newPrescription = await Prescription.create({
      hospitalName,
      patientName,
      patientAge,
      symptoms,
      diagnosis,
      medicines,
    });

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription: newPrescription,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating prescription',
      error: error.message,
    });
  }
};

const viewPrescription = async (req, res) => {
  const { id } = req.params;

  try {
    const prescription = await Prescription.findOne({ prescriptionId: id });

    if (!prescription) {
      return res.status(404).json({
        message: 'Prescription not found',
      });
    }

    res.status(200).json({ prescription });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching prescription',
      error: error.message,
    });
  }
};

const updatePrescription = async (req, res) => {
  const { id } = req.params;
  const { medicines } = req.body;

  try {
    const prescription = await Prescription.findOne({ prescriptionId: id });

    if (!prescription) {
      return res.status(404).json({
        message: 'Prescription not found',
      });
    }

    prescription.medicines = medicines;
    await prescription.save();

    res.status(200).json({
      message: 'Prescription updated successfully',
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating prescription',
      error: error.message,
    });
  }
};

export default { createPrescription, viewPrescription, updatePrescription };
