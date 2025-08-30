import { Request, Response } from 'express';
import { applyForJob } from '../services/application.service';

interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}

export const applyForJobController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const jobId = parseInt(req.params.jobId, 10);

        if (!userId) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        if (isNaN(jobId)) {
            return res.status(400).json({ message: 'Invalid Job ID provided.' });
        }

        const result = await applyForJob(userId, jobId);
        res.status(201).json(result);

    } catch (error: any) {
        // The service throws specific, user-friendly error messages.
        // We can send these directly to the user with a 400 Bad Request status.
        res.status(400).json({ message: error.message });
    }
};