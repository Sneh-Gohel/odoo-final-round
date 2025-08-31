import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { createTestController, addQuestionController, deleteQuestionController, deleteTestController, getTestDetailsController } from '../controllers/test.controller';
import { protect, isTpoOrCompany } from '../middlewares/auth.middleware';

const router = Router();

// --- Validation Schemas ---
const createTestSchema = Joi.object({
    title: Joi.string().required(),
    duration_minutes: Joi.number().integer().min(1).required(),
    purpose: Joi.string().valid('PREPARATION', 'EVALUATION').required(),
    // 'jobId' is now only required if 'purpose' is 'EVALUATION'.
    jobId: Joi.when('purpose', {
        is: 'EVALUATION',
        then: Joi.number().integer().required(),
        otherwise: Joi.optional()
    })
});

const addQuestionSchema = Joi.object({
    question_text: Joi.string().required(),
    options: Joi.array().items(
        Joi.object({
            text: Joi.string().required(),
            is_correct: Joi.boolean().required()
        })
    ).min(2).required().custom((options, helpers) => {
        // Custom validation to ensure exactly one option is correct
        const correctAnswers = options.filter((opt: any) => opt.is_correct === true);
        if (correctAnswers.length !== 1) {
            return helpers.error('any.invalid', { message: 'Exactly one option must be marked as correct.' });
        }
        return options;
    })
});

const validateRequest = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};

// --- ROUTES ---
// Create a new test shell
router.post('/create', protect, isTpoOrCompany, validateRequest(createTestSchema), createTestController);

// Add a question to a specific test
router.post('/:testId/questions/add', protect, isTpoOrCompany, validateRequest(addQuestionSchema), addQuestionController);

// Delete a specific question
router.delete('/questions/:questionId', protect, isTpoOrCompany, deleteQuestionController);

router.delete('/:testId', protect, isTpoOrCompany, deleteTestController);

router.get('/:testId', protect, getTestDetailsController);

export default router;