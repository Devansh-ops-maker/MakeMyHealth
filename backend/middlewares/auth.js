import jwt from "jsonwebtoken";
import * as Doctor from '../models/doctor.js';
import * as Patient from '../models/patient.js';
import * as Pharmacist from '../models/Pharmacist.js';
import * as Prescription from '../models/prescription.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to access this resource.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === 'doctor') {
      user = await Doctor.findById(decoded.id);
    } else if (decoded.role === 'patient') {
      user = await Patient.findById(decoded.id);
    } else if (decoded.role === 'pharmacist') {
      user = await Pharmacist.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};
