// File Path: src/api/student.routes.ts (MODIFIED)

import { Router } from 'express';
import multer from 'multer';
import path from 'path';

// 1. IMPORT THE CORRECT CONTROLLER FOR JOBS
import { getJobsController } from '../controllers/job.controller'; 
// 2. IMPORT THE STUDENT-SPECIFIC CONTROLLERS
import { getDashboardData, uploadResumeController } from '../controllers/student.controller';
import { protect, isStudent } from '../middlewares/auth.middleware';

const router = Router();

// --- Multer Configuration (Unchanged) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/resumes/');
    },
    filename: (req: any, file, cb) => {
        const uniqueName = `student-${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// --- ROUTES ---

router.get('/dashboard', protect, isStudent, getDashboardData);

router.post('/resume/upload', protect, isStudent, upload.single('resumeFile'), uploadResumeController);

// --- 3. THE FIX: USE THE CORRECT CONTROLLER NAME ---
// This route now correctly uses the universal 'getJobsController'.
// Since it is protected by 'isStudent', only students can access it here.
router.get('/jobs', protect, isStudent, getJobsController);

export default router;