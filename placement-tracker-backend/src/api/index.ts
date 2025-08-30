import { Router } from 'express';
import authRoutes from './auth.routes'; 
import studentRoutes from './student.routes';
import companyRoutes from './company.routes';
import jobRoutes from './job.routes';
import testRoutes from './test.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/company', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/tests', testRoutes);

export default router;