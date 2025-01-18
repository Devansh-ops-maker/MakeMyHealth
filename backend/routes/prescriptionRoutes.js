import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import prescriptionController from '../controllers/prescriptionController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Create prescription - doctors only

router.post('/', restrictTo('doctor'), prescriptionController.createPrescription);
router.get('/searchPatient', restrictTo('patient'), prescriptionController.getPrescriptionsForPatient);
router.get('/id/:id', restrictTo('doctor', 'pharmacist', 'patient'), prescriptionController.viewPrescription);
router.patch('/id/:id', restrictTo('pharmacist'), prescriptionController.updatePrescription);
router.get('/searchDoctor',restrictTo('doctor'),prescriptionController.getPrescriptionsForDoctor);
router.get('/searchPharmacist',restrictTo('pharmacist'),prescriptionController.getAllPrescriptions);

export default router;
