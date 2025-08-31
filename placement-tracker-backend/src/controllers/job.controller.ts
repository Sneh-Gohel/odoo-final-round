// File Path: src/controllers/job.controller.ts (CORRECTED & COMPLETE)

import { Request, Response } from 'express';
// 1. Import all necessary functions from the service layer, including updateJobSchedule
import { 
    createJob, 
    getJobsForUser, 
    getJobWithApplicants, 
    updateJobSchedule 
} from '../services/job.service';
import db from '../config/db';

// 2. Define the AuthRequest interface
interface AuthRequest extends Request {
    user?: { userId: number; role: string; };
}

// Your existing controllers which are correct (Unchanged)
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
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

export const getJobsController = async (req: AuthRequest, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        const jobs = await getJobsForUser(userPayload);
        res.status(200).json(jobs);
    } catch (error: any) {
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

export const getJobWithApplicantsController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const jobId = parseInt(req.params.jobId, 10);

        if (!userId) { 
            return res.status(401).json({ message: 'Not authorized.' });
        }
        if (isNaN(jobId)) {
            return res.status(400).json({ message: 'Invalid Job ID.' });
        }

        const [profiles]: any = await db.execute('SELECT id FROM company_profiles WHERE user_id = ?', [userId]);
        if (profiles.length === 0) {
            return res.status(403).json({ message: 'Company profile not found for this user.' });
        }
        const companyProfileId = profiles[0].id;

        const result = await getJobWithApplicants(jobId, companyProfileId);
        res.status(200).json(result);

    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Get Job With Applicants Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

// --- THIS CONTROLLER IS NOW FIXED ---
export const updateJobScheduleController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const jobId = parseInt(req.params.jobId, 10);

        if (!userId) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        if (isNaN(jobId)) {
            return res.status(400).json({ message: 'Invalid Job ID provided.' });
        }

        const [profiles]: any = await db.execute('SELECT id FROM company_profiles WHERE user_id = ?', [userId]);
        if (profiles.length === 0) {
            return res.status(403).json({ message: 'Company profile not found for this user.' });
        }
        const companyId = profiles[0].id;

        // 3. This now correctly calls the IMPORTED function from the service
        const result = await updateJobSchedule(jobId, companyId, req.body);
        res.status(200).json(result);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// 4. The broken placeholder function has been REMOVED.