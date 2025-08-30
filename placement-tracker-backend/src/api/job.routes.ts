import { Router } from 'express';
import { getJobsController } from '../controllers/job.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, getJobsController);

export default router;