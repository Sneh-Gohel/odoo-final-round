// File Path: src/controllers/job.controller.ts (FOR CONFIRMATION)

import { Request, Response } from 'express';
import { createJob, getJobsForUser } from '../services/job.service';
import db from '../config/db';

interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}

export const addJobController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized, user ID missing.' });
        }
        const [profiles]: any = await db.execute('SELECT id FROM company_profiles WHERE user_id = ?', [userId]);
        if (profiles.length === 0) {
            return res.status(403).json({ message: 'No company profile found for this user.' });
        }
        const companyId = profiles[0].id;
        const result = await createJob(req.body, companyId);
        res.status(201).json(result);
    } catch (error: any) {
        console.error("Add Job Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

// This is the function being exported and used in our fix.
export const getJobsController = async (req: AuthRequest, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        const jobs = await getJobsForUser(userPayload);
        res.status(200).json(jobs);
    } catch (error: any) {
        console.error("Get Jobs Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};