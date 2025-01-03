const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected routes
router.post('/', authenticateUser, authorizeRole(['admin']), createDoctor);
router.put('/:id', authenticateUser, authorizeRole(['admin', 'doctor']), updateDoctor);
router.delete('/:id', authenticateUser, authorizeRole(['admin']), deleteDoctor);

module.exports = router;
