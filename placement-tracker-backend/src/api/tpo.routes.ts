// File Path: src/api/tpo.routes.ts (CORRECTED & COMPLETE)

import { Router } from 'express';
import { getJobWithApplicantsForTpoController } from '../controllers/tpo.controller';
import { protect, isTpo } from '../middlewares/auth.middleware';

const router = Router();

// This line defines the secure route for TPOs to view applicants for any job.
// It is protected by the 'protect' and 'isTpo' middleware.
router.get('/jobs/:jobId/applicants', protect, isTpo, getJobWithApplicantsForTpoController);

// This is the line that was likely missing or incorrect.
// It makes the router available to be imported by your main 'index.ts' file.
export default router;