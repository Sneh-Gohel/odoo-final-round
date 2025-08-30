import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { addJobController } from '../controllers/job.controller';
import { protect, isCompany } from '../middlewares/auth.middleware';
import { getCompanyDashboardController } from '../controllers/company.controller';

const router = Router();

// --- Validation Schema for adding a new job ---
const jobSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    package_lpa: Joi.number().min(0).required(),
    tier: Joi.string().valid('TIER_1', 'TIER_2', 'TIER_3', 'INTERNSHIP').required(),
    min_cgpa: Joi.number().min(0).max(10).required(),
    allowed_departments: Joi.array().items(Joi.string()).required(),
    max_backlogs: Joi.number().integer().min(0).required(),
    application_deadline: Joi.date().iso().required() // Requires date in 'YYYY-MM-DD' format
});

const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};


router.post('/jobs/add', protect, isCompany, validateRequest(jobSchema), addJobController);
router.get('/dashboard', protect, isCompany, getCompanyDashboardController);

export default router;