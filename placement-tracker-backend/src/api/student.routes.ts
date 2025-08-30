import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import Joi from 'joi'; // 1. ADDED Joi import

import { getJobsController } from '../controllers/job.controller'; 
// 2. IMPORT the update controller
import { 
    getDashboardData, 
    getStudentProfileController, 
    uploadResumeController, 
    updateStudentProfileController 
} from '../controllers/student.controller';
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


// --- 3. DEFINED the Joi validation schema for updating a profile ---
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


// --- 4. IMPLEMENTED the validation middleware correctly ---
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

export default router;