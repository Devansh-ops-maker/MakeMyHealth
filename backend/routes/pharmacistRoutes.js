const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const {
  createPharmacist,
  getAllPharmacists,
  getPharmacistById,
  updatePharmacist,
  deletePharmacist
} = require('../controllers/pharmacistController');

// Public routes
router.get('/', getAllPharmacists);
router.get('/:id', getPharmacistById);

// Protected routes
router.post('/', authenticateUser, authorizeRole(['admin']), createPharmacist);
router.put('/:id', authenticateUser, authorizeRole(['admin', 'pharmacist']), updatePharmacist);
router.delete('/:id', authenticateUser, authorizeRole(['admin']), deletePharmacist);

module.exports = router;
