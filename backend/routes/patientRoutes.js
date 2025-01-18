import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import patientController from '../controllers/patientController.js';

const router = express.Router();

router.use(protect);

router.get('/',restrictTo('patient'),patientController.getProfileByName);

export default router;
