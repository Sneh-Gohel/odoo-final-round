import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendVerificationOtp } from '../services/email.service.ts';

// This extends the default Request type to include our user property
interface AuthRequest extends Request {
    user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer eyJhbGci...")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token and decode its payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret_key');

            // Attach the payload (which contains userId, role, etc.) to the request object
            req.user = decoded;

            next(); // If token is valid, proceed
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};

// A second middleware to check for a specific role
export const isStudent = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'STUDENT') {
        next();
    } else {
        res.status(403).json({ message: 'Access forbidden: Students only.' });
    }
};

export const isCompany = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'COMPANY') {
        next();
    } else {
        res.status(403).json({ message: 'Access forbidden: Companies only.' });
    }
};

export const isTpoOrCompany = (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (userRole && (userRole === 'TPO' || userRole === 'COMPANY')) {
        next();
    } else {
        res.status(403).json({ message: 'Access forbidden: Admins only.' });
    }
};

export const sendOtpController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const otp = await sendVerificationOtp(email);
        
        // Return the OTP in the response for frontend comparison
        res.status(200).json({
            message: 'OTP sent successfully to your email.',
            otp: otp 
        });

    } catch (error: any) {
        console.error("Send OTP Controller Error:", error);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
};

export const isTpo = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'TPO') {
        next();
    } else {
        res.status(403).json({ message: 'Access forbidden: TPOs only.' });
    }
};