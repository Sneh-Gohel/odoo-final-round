
import { Request, Response } from 'express';
// Import both service functions
import { registerNewUser, loginUser } from '../services/auth.service';

export const registerController = async (req: Request, res: Response) => {
    try {
        const result = await registerNewUser(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        console.error('Registration Controller Error:', error);
        res.status(500).json({ message: 'An internal error occurred during registration.' });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const result = await loginUser(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        // For security, send a generic 401 Unauthorized for any login failure
        if (error.message === 'Authentication failed' || error.message === 'User profile data is missing.') {
             return res.status(401).json({ message: 'Invalid credentials or role.' });
        }

        console.error('Login Controller Error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};