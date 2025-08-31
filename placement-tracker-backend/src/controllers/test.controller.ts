
import { Request, Response } from 'express';
import { createTestShell, addQuestionToTest, deleteQuestion, deleteTest, getTestForStudent, getTestDetails, submitTestForGrading } from '../services/test.service';
import db from '../config/db';

interface AuthRequest extends Request {
    user?: { userId: number; role: string; };
}

export const createTestController = async (req: AuthRequest, res: Response) => {
    try {
        const { userId, role } = req.user!;
        let profileId: number;

        // Find the specific profile ID (tpo_id or company_id) based on the user's login.
        if (role === 'TPO') {
            const [profiles]: any = await db.execute('SELECT id FROM tpo_profiles WHERE user_id = ?', [userId]);
            if (profiles.length === 0) return res.status(403).json({ message: 'TPO profile not found.' });
            profileId = profiles[0].id;
        } else if (role === 'COMPANY') {
            const [profiles]: any = await db.execute('SELECT id FROM company_profiles WHERE user_id = ?', [userId]);
            if (profiles.length === 0) return res.status(403).json({ message: 'Company profile not found.' });
            profileId = profiles[0].id; // The service will use this to link to a job.
        } else {
            return res.status(403).json({ message: 'User role cannot create tests.' });
        }
        
        const result = await createTestShell(req.body, { role, profileId });
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addQuestionController = async (req: Request, res: Response) => {
    try {
        const { testId } = req.params;
        const result = await addQuestionToTest(parseInt(testId), req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteQuestionController = async (req: Request, res: Response) => {
    try {
        const { questionId } = req.params;
        const result = await deleteQuestion(parseInt(questionId));
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

export const deleteTestController = async (req: Request, res: Response) => {
    try {
        const { testId } = req.params;
        const result = await deleteTest(parseInt(testId));
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

export const getTestDetailsController = async (req: Request, res: Response) => {
    try {
        const testId = parseInt(req.params.testId, 10);
        if (isNaN(testId)) {
            return res.status(400).json({ message: 'Invalid Test ID.' });
        }

        const testData = await getTestDetails(testId);
        res.status(200).json(testData);

    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Get Test Details Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

export const submitTestController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const testId = parseInt(req.params.testId, 10);
        const { answers } = req.body; // The array of answers from the student

        if (!userId) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        if (isNaN(testId)) {
            return res.status(400).json({ message: 'Invalid Test ID.' });
        }

        const result = await submitTestForGrading(userId, testId, answers);
        res.status(200).json(result);

    } catch (error: any) {
        console.error("Submit Test Controller Error:", error);
        res.status(500).json({ message: error.message || 'An internal server error occurred.' });
    }
};