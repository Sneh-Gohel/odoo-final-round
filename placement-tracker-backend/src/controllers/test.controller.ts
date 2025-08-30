
import { Request, Response } from 'express';
import { createTestShell, addQuestionToTest, deleteQuestion, deleteTest } from '../services/test.service';
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