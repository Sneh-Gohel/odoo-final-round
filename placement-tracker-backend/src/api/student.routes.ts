import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { getDashboardData } from '../controllers/student.controller';
import { protect, isStudent } from '../middlewares/auth.middleware'

const router = Router();

const dashboardSchema = Joi.object({
    studentId: Joi.number().integer().required()
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

router.post('/dashboard', validateRequest(dashboardSchema), getDashboardData, isStudent, getDashboardData);

export default router;