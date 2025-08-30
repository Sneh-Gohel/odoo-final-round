import { Router } from 'express';
import authRoutes from './auth.routes'; 
import studentRoutes from './student.routes';
import companyRoutes from './company.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/company', companyRoutes);

export default router;