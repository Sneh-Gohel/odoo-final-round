import { Router } from 'express';
import { applyForJobController } from '../controllers/application.controller';
import { protect, isStudent } from '../middlewares/auth.middleware';

const router = Router();

// A POST request is appropriate here as it creates a new resource (an application).
router.post('/apply/:jobId', protect, isStudent, applyForJobController);

export default router;