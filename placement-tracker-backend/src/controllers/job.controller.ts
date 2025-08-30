import { Request, Response } from 'express';
import { createJob } from '../services/job.service';
import db from '../config/db';

interface AuthRequest extends Request {
    user?: {
        userId: number; // This is the ID from the 'users' table
        role: string;
    };
}

export const addJobController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Not authorized, user ID missing.' });
        }

        // We need the ID from 'company_profiles', not the 'users' table.
        // So, we find the company profile linked to this user ID.
        const [profiles]: any = await db.execute('SELECT id FROM company_profiles WHERE user_id = ?', [userId]);

        if (profiles.length === 0) {
            return res.status(403).json({ message: 'No company profile found for this user.' });
        }
        const companyId = profiles[0].id;

        // Now we call the service with the job data and the correct company ID
        const result = await createJob(req.body, companyId);

        res.status(201).json(result);

    } catch (error: any) {
        console.error("Add Job Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};