// File Path: src/controllers/student.controller.ts

import { Request, Response } from 'express';
// Import all necessary service functions
import { getDashboardStats, getStudentProfile, updateResumeUrl, updateStudentProfile } from '../services/student.service';
// Import the database connection to find the student's profile
import db from '../config/db';

// Interface to represent an authenticated request with a user payload
interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}

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

/**
 * Handles the resume file upload process.
 * It constructs the file URL and updates the student's profile in the database.
 */
export const uploadResumeController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId; // ID from the main 'users' table

        if (!req.file) {
            return res.status(400).json({ message: 'No file was uploaded.' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        // Find the student's profile ID using the user ID from the token
        const [profiles]: any = await db.execute('SELECT id FROM student_profiles WHERE user_id = ?', [userId]);
        if (profiles.length === 0) {
            return res.status(403).json({ message: 'No student profile found for this user.' });
        }
        const studentProfileId = profiles[0].id;

        // Construct the full, publicly accessible URL for the uploaded file
        const fileUrl = `${req.protocol}://${req.get('host')}/resumes/${req.file.filename}`;

        // Call the service to save the URL to the database
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