import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import prescriptionController from '../controllers/prescriptionController.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  restrictTo('doctor'),
  prescriptionController.createPrescription
);

router.get(
  '/:id',
  restrictTo('patient'),
  prescriptionController.viewPrescription
);

router.patch(
  '/:id',
  restrictTo('pharmacist'),
  prescriptionController.updatePrescription
);

export default router;
