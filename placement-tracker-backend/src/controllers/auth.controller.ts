// File Path: src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { registerNewUser } from '../services/auth.service';

/**
 * Handles the registration request.
 */
export const registerController = async (req: Request, res: Response) => {
    try {
        const result = await registerNewUser(req.body);
        // Send a 201 Created status for successful registration
        res.status(201).json(result);
    } catch (error: any) {
        // Check for a specific database error for duplicate emails
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        
        // For any other errors, send a generic server error response
        console.error('Registration Controller Error:', error);
        res.status(500).json({ message: 'An internal error occurred during registration.' });
    }
};