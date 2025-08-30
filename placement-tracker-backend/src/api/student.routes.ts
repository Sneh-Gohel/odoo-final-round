

import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import { getJobsController } from '../controllers/job.controller'; 
import { getDashboardData, getStudentProfileController, uploadResumeController } from '../controllers/student.controller';
import { protect, isStudent } from '../middlewares/auth.middleware';

const router = Router();

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


router.post('/resume/upload', protect, isStudent, upload.single('resume'), uploadResumeController);

router.get('/jobs', protect, isStudent, getJobsController);

router.get('/profile', protect, isStudent, getStudentProfileController);

export default router;