import { Request, Response } from 'express';
import { getDashboardStats } from '../services/student.service';

interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}

export const getDashboardData = async (req: AuthRequest, res: Response) => {
    try {

        // The user ID now comes from the decoded token.
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