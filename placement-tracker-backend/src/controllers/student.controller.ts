import { Request, Response } from 'express';
import { getDashboardStats } from '../services/student.service';

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        // Get the student ID from the request body
        const { studentId } = req.body;

        // A quick check to make sure the ID was provided
        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is required in the request body.' });
        }

        const stats = await getDashboardStats(studentId);

        res.status(200).json(stats);
    } catch (error: any) {
        console.error("Dashboard Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};