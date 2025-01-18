import jwt from 'jsonwebtoken';
import  Doctor from '../models/doctor.js';
import  Patient from '../models/patient.js';
import  Pharmacist from '../models/pharmacist.js';
import  Prescription from '../models/prescription.js';

process.env.JWT_SECRET = '65ed2a1a80f1c527e4f91badfbe8ba1ed1893461326dae1d45e0614b4aeacdba53928b1cde0bb59e9ec2ac1d10f5fda637eedfe817fed877abad57b8fd39db01';
process.env.JWT_EXPIRES_IN = '24h';

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const registerDoctor = async (req, res) => {
  try {
    const newDoctor = await Doctor.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      specialization: req.body.specialization,
      licenseNumber: req.body.licenseNumber,
      contactNumber: req.body.contactNumber,
      experience: req.body.experience,
      qualification: req.body.qualification,
      associatedHospital: req.body.associatedHospital,
      status: req.body.status,
      availability: req.body.availability,
      languages: req.body.languages,
      consultationFee: req.body.consultationFee,
      createdAt: req.body.createdAt,
    });

    const token = signToken(newDoctor._id, 'doctor');

    res.status(201).json({
      status: 'success',
      token,
      data: {
        doctor: newDoctor,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const registerPatient = async (req, res) => {
  try {
    const newPatient = await Patient.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      bloodGroup: req.body.bloodGroup,
      allergies: req.body.allergies,
      medicalHistory: req.body.medicalHistory,
      isActive: req.body.isActive,
      emergencyContact: req.body.emergencyContact,
    });

    const token = signToken(newPatient._id, 'patient');

    res.status(201).json({
      status: 'success',
      token,
      data: {
        patient: newPatient,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const registerPharmacist = async (req, res) => {
  try {
    const newPharmacist = await Pharmacist.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      licenseNumber: req.body.licenseNumber,
      associatedPharmacy: req.body.associatedPharmacy,
      contactNumber: req.body.contactNumber,
      qualifications: req.body.qualifications,
      status: req.body.status,
      createdAt: req.body.createdAt,
    });

    const token = signToken(newPharmacist._id, 'pharmacist');

    res.status(201).json({
      status: 'success',
      token,
      data: {
        pharmacist: newPharmacist,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    let user;
    switch (role) {
      case 'doctor':
        user = await Doctor.findOne({ email }).select('+password');
        break;
      case 'patient':
        user = await Patient.findOne({ email }).select('+password');
        break;
      case 'pharmacist':
        user = await Pharmacist.findOne({ email }).select('+password');
        break;
      default:
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid role',
        });
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    const token = signToken(user._id, role);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
