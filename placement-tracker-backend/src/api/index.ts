import { Router } from 'express';
import authRoutes from './auth.routes'; 
import studentRoutes from './student.routes';
import companyRoutes from './company.routes';
import jobRoutes from './job.routes';
import testRoutes from './test.routes';
import applicationRoutes from './application.routes';
import tpoRoutes from './tpo.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/company', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/tests', testRoutes);
router.use('/applications', applicationRoutes);
router.use('/tpo', tpoRoutes);

export default router;