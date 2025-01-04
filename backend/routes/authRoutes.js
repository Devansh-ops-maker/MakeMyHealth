const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register/doctor', authController.registerDoctor);
router.post('/register/patient', authController.registerPatient);
router.post('/register/pharmacist', authController.registerPharmacist);
router.post('/login', authController.login);

module.exports = router;
