// File Path: src/controllers/student.controller.ts (CORRECTED & COMPLETE)

import { Request, Response } from 'express';
// 1. All necessary functions are imported from the service layer
import { 
    getDashboardStats, 
    updateResumeUrl, 
    getStudentProfile, 
    updateStudentProfile,
    getStudentHistory // This import is crucial
} from '../services/student.service';
import db from '../config/db';

// Interface to represent an authenticated request
interface AuthRequest extends Request {
    user?: { userId: number; role: string; };
}

// Your existing, working controllers (Unchanged)
export const getDashboardData = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.userId;
        if (!studentId) {
            return res.status(401).json({ message: 'Not authorized, user ID missing from token.' });
        }
        const stats = await getDashboardStats(studentId);
        res.status(200).json(stats);
    } catch (error: any) {
        console.error("Dashboard Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

export const uploadResumeController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!req.file) {
            return res.status(400).json({ message: 'No file was uploaded.' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        const [profiles]: any = await db.execute('SELECT id FROM student_profiles WHERE user_id = ?', [userId]);
        if (profiles.length === 0) {
            return res.status(403).json({ message: 'No student profile found for this user.' });
        }
        const studentProfileId = profiles[0].id;
        const fileUrl = `${req.protocol}://${req.get('host')}/resumes/${req.file.filename}`;
        await updateResumeUrl(studentProfileId, fileUrl);
        res.status(200).json({
            message: 'Resume uploaded and profile updated successfully!',
            fileUrl: fileUrl
        });
    } catch (error) {
        console.error("Upload Resume Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred during file upload.' });
    }
};

export const getStudentProfileController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized, user ID missing from token.' });
        }
        const profileData = await getStudentProfile(userId);
        res.status(200).json(profileData);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Get Student Profile Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

export const updateStudentProfileController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized, user ID missing from token.' });
        }
        const result = await updateStudentProfile(userId, req.body);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Update Student Profile Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

// --- THIS IS THE CORRECTED CONTROLLER ---
export const getStudentHistoryController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized, user ID missing from token.' });
        }

        // 2. This now correctly calls the IMPORTED 'getStudentHistory' function from the service.
        const history = await getStudentHistory(userId);
        res.status(200).json(history);

    } catch (error: any) {
        console.error("Get Student History Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

// 3. The broken placeholder function that was causing the error has been completely removed.