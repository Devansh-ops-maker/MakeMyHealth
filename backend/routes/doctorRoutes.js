import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import doctorController from '../controllers/doctorController.js';

const router = express.Router();

router.use(protect);

router.get('/',restrictTo('doctor'),doctorController.getProfileByName);

export default router;
