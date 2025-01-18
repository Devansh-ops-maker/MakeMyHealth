import jwt from "jsonwebtoken";
import Doctor from '../models/doctor.js';
import Patient from '../models/patient.js';
import Pharmacist from '../models/pharmacist.js';

export const protect = async (req, res, next) => {
  try {
    // Get token and check if it exists
    let token;
    
    // Only try to split if authorization header exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to access this resource.',
      });
    }

    // Token verification
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user based on role in the token
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

      // Everything ok, attach user to request
      req.user = user;
      req.userRole = decoded.role;
      next();
      
    } catch (err) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.',
      });
    }
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({
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
