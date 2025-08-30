import { Router } from 'express';
import authRoutes from './auth.routes'; // This import needs a valid module

const router = Router();

// This line connects the auth routes to your main API router
router.use('/auth', authRoutes);

export default router;