import express from 'express';
import * as authController from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register/doctor', authController.registerDoctor);
router.post('/register/patient', authController.registerPatient);
router.post('/register/pharmacist', authController.registerPharmacist);
router.post('/login', authController.login);


export default router;
