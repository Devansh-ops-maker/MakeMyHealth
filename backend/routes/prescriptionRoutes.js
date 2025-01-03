const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth.js');
const {
  createPrescription,
  getPrescriptions,
  updatePrescription
} = require('../controllers/prescriptionController.js');

router.post('/', authenticateUser, createPrescription);
router.get('/', authenticateUser, getPrescriptions);
router.put('/:id', authenticateUser, updatePrescription);

module.exports = router;
