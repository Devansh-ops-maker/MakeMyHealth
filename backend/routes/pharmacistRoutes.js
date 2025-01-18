import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import pharmacistController from '../controllers/pharmacistController.js';

const router = express.Router();

router.use(protect);

router.get('/',restrictTo('pharmacist'),pharmacistController.getProfileByName);

export default router;
