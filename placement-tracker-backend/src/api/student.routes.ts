

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import Joi from 'joi';

import { getJobsController } from '../controllers/job.controller'; 
// 1. Import the new controller for submitting tests
import { submitTestController } from '../controllers/test.controller';
import { 
    getDashboardData, 
    getStudentProfileController, 
    uploadResumeController, 
    updateStudentProfileController, 
    getStudentHistoryController
} from '../controllers/student.controller';
import { protect, isStudent } from '../middlewares/auth.middleware';

const router = Router();

// --- Multer Configuration ---
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

// --- Validation Schemas ---
const updateProfileSchema = Joi.object({
    full_name: Joi.string().required(),
    enrollment_no: Joi.string().required(),
    institute_name: Joi.string().required(),
    branch: Joi.string().required(),
    current_year: Joi.number().integer().min(1).max(5).required(),
    cgpa: Joi.number().min(0).max(10).required(),
    skills: Joi.string().allow('').optional(),
    active_backlogs: Joi.number().integer().min(0).required()
});

// 2. DEFINED the missing schema for test submission
const submitTestSchema = Joi.object({
    answers: Joi.array().items(
        Joi.object({
            questionId: Joi.number().integer().required(),
            selectedOptionId: Joi.number().integer().required()
        })
    ).min(1).required()
});

// --- Validation Middleware ---
const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};

// --- ROUTES ---

router.get('/dashboard', protect, isStudent, getDashboardData);
router.post('/resume/upload', protect, isStudent, upload.single('resume'), uploadResumeController);
router.get('/jobs', protect, isStudent, getJobsController);
router.get('/profile', protect, isStudent, getStudentProfileController);
router.put('/profile', protect, isStudent, validateRequest(updateProfileSchema), updateStudentProfileController);
router.get('/history', protect, isStudent, getStudentHistoryController);

// 3. This route is now correct and will work
router.post('/tests/:testId/submit', protect, isStudent, validateRequest(submitTestSchema), submitTestController);

export default router;