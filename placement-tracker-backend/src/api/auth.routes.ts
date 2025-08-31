// File Path: src/api/auth.routes.ts

import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
// Import both controllers
import { registerController, loginController } from '../controllers/auth.controller';
import { sendOtpController } from '../middlewares/auth.middleware';

const router = Router();

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long.'
    }),
    role: Joi.string().valid('STUDENT', 'COMPANY', 'TPO').required(),
    fullName: Joi.when('role', { is: ['STUDENT', 'TPO'], then: Joi.string().required() }),
    enrollmentNo: Joi.when('role', { is: 'STUDENT', then: Joi.string().required() }),
    instituteName: Joi.when('role', { is: ['STUDENT', 'TPO'], then: Joi.string().required() }),
    branch: Joi.when('role', { is: 'STUDENT', then: Joi.string().required() }), 
    currentYear: Joi.when('role', { is: 'STUDENT', then: Joi.number().integer().min(1).max(5).required() }),
    cgpa: Joi.when('role', { is: 'STUDENT', then: Joi.number().min(0).max(10).required() }),
    active_backlogs: Joi.when('role', { is: 'STUDENT', then: Joi.number().integer().min(0).required() }),
    skills: Joi.when('role', { is: 'STUDENT', then: Joi.string().allow('').optional() }),
    companyName: Joi.when('role', { is: 'COMPANY', then: Joi.string().required() }),
    websiteUrl: Joi.when('role', { is: 'COMPANY', then: Joi.string().uri().allow('').optional() }),
    contactEmail: Joi.when('role', { is: 'COMPANY', then: Joi.string().email().required() }),
    hrContactPhone: Joi.when('role', { is: 'COMPANY', then: Joi.string().allow('').optional() }),
    contact: Joi.when('role', { is: 'COMPANY', then: Joi.string().allow('').optional() }),
    description: Joi.when('role', { is: 'COMPANY', then: Joi.string().allow('').optional() }),
    contactPhone: Joi.when('role', { is: 'TPO', then: Joi.string().required() })
});


const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('STUDENT', 'COMPANY', 'TPO').required()
});

const otpSchema = Joi.object({
    email: Joi.string().email().required()
});

// --- VALIDATION MIDDLEWARE ---
const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorDetails = error.details.map(d => d.message).join(', ');
            return res.status(400).json({ message: 'Validation failed', details: errorDetails });
        }
        next();
    };
};

// --- ROUTES ---
router.post('/register', validateRequest(registerSchema), registerController);
router.post('/login', validateRequest(loginSchema), loginController);
router.post('/send-otp', validateRequest(otpSchema), sendOtpController);

export default router;