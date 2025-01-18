import Prescription from '../models/prescription.js';

const createPrescription = async (req, res) => {
  const { doctorName,doctorEmail,doctorPhoneNumber,hospitalName, patientName, patientAge, symptoms, diagnosis, medicines } = req.body;
  try {
    const newPrescription = await Prescription.create({
      doctorName,
      doctorEmail,
      doctorPhoneNumber,
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
  export const getPrescriptionsForDoctor = async (req, res) => {
    try {
      if (req.userRole !== 'doctor') {
        return res.status(403).json({
          message: 'You are not authorized to access this resource.',
        });
      }
  
      const prescriptions = await Prescription.find({
        doctorName: req.user.name,
      }).sort({ dateCreated: -1 });
  
      if (!prescriptions.length) {
        return res.status(404).json({
          message: 'No prescriptions found for this doctor.',
        });
      }
  
      res.status(200).json({
        message: 'Prescriptions fetched successfully.',
        prescriptions,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching prescriptions.',
        error: error.message,
      });
    }
  };
  
const viewPrescription = async (req, res) => {
  const { id } = req.params;
  try {
    // Ensure `id` is not a reserved keyword like "search"
    if (id === 'search') {
      return res.status(400).json({
        message: 'Invalid request. Please use the search route for searching.',
      });
    }

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
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({})
      .sort({ dateCreated: -1 });

    if (!prescriptions.length) {
      return res.status(404).json({
        message: 'No prescriptions found in the database.',
      });
    }

    res.status(200).json({
      message: 'All prescriptions fetched successfully.',
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching prescriptions.',
      error: error.message,
    });
  }
};
export const getPrescriptionsForPatient = async (req, res) => {
  try {
    if (req.userRole !== 'patient') {
      return res.status(403).json({
        message: 'You are not authorized to access this resource.',
      });
    }

    const prescriptions = await Prescription.find({
      patientName: req.user.name,
    }).sort({ dateCreated: -1 });

    if (!prescriptions.length) {
      return res.status(404).json({
        message: 'No prescriptions found for this patient.',
      });
    }

    res.status(200).json({
      message: 'Prescriptions fetched successfully.',
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching prescriptions.',
      error: error.message,
    });
  }
};

const updatePrescription = async (req, res) => {
  const { id } = req.params;
  const { medicines } = req.body;
  try {
    // Ensure `id` is not a reserved keyword like "search"
    if (id === 'search') {
      return res.status(400).json({
        message: 'Invalid request. Please use the search route for searching.',
      });
    }

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

export default {
  createPrescription,
  viewPrescription,
  updatePrescription,
  getPrescriptionsForPatient,
  getPrescriptionsForDoctor,
  getAllPrescriptions
};
