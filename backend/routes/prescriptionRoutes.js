const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth');
const prescriptionController = require('../controllers/prescriptionController');

const Prescriptionrouter = express.Router();

Prescriptionrouter.use(protect);
router.post('/', 
  restrictTo('doctor'),
  prescriptionController.createPrescription
);

Prescriptionrouter.get('/:id',
  restrictTo('patient'),
  prescriptionController.viewPrescription
);

Prescriptionrouter.patch('/:id',
  restrictTo('pharmacist'),
  prescriptionController.updatePrescription
);

module.exports = Prescriptionrouter;
