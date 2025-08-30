
import { Request, Response } from 'express';
import { getCompanyProfile } from '../services/company.service';

// Interface to represent an authenticated request.
interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}

/**
 * Handles the request to fetch the logged-in company's dashboard/profile data.
 */
export const getCompanyDashboardController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Not authorized, user ID missing from token.' });
        }

        const companyProfile = await getCompanyProfile(userId);

        res.status(200).json(companyProfile);

    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Company Dashboard Controller Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};