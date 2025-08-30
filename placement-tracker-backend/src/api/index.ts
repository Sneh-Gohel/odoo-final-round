import { Router } from 'express';
import authRoutes from './auth.routes'; 
import studentRoutes from './student.routes';
import companyRoutes from './company.routes';
import jobRoutes from './job.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/company', companyRoutes);
router.use('/jobs', jobRoutes);

export default router;