// File Path: src/controllers/tpo.controller.ts (CORRECT & COMPLETE)

import { Request, Response } from 'express';
import { getJobWithApplicantsForTpo } from '../services/job.service';

interface AuthRequest extends Request {
    user?: { userId: number; role: string; };
}

export const getJobWithApplicantsForTpoController = async (req: AuthRequest, res: Response) => {
    try {
        const jobId = parseInt(req.params.jobId, 10);
        if (isNaN(jobId)) {
            return res.status(400).json({ message: 'Invalid Job ID.' });
        }

        const result = await getJobWithApplicantsForTpo(jobId);
        res.status(200).json(result);

    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        console.error("TPO Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};