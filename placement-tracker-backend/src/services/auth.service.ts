// File Path: src/services/auth.service.ts

import bcrypt from 'bcryptjs';
import db from '../config/db';
import { PoolConnection } from 'mysql2/promise';
import jwt from 'jsonwebtoken';

// --- YOUR EXISTING CODE (UNCHANGED) ---
export const registerNewUser = async (userData: any) => {
    const connection: PoolConnection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const userQuery = 'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)';
        const [userResult]: any = await connection.execute(userQuery, [userData.email, hashedPassword, userData.role]);
        const userId = userResult.insertId;
        
        switch (userData.role) {
            case 'STUDENT':
                const studentQuery = `
                    INSERT INTO student_profiles 
                    (user_id, full_name, enrollment_no, institute_name, branch, current_year, cgpa, active_backlogs, skills) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                await connection.execute(studentQuery, [
                    userId,
                    userData.fullName,
                    userData.enrollmentNo,
                    userData.instituteName,
                    userData.branch,
                    userData.currentYear,
                    userData.cgpa,
                    userData.active_backlogs,
                    userData.skills || null
                ]);
                break;

            case 'COMPANY':
                const companyQuery = `
                    INSERT INTO company_profiles 
                    (user_id, company_name, website_url, description, email, hr_contact,contact) 
                    VALUES (?, ?, ?, ?, ?, ?,?)`;
                await connection.execute(companyQuery, [
                    userId,
                    userData.companyName,
                    userData.websiteUrl || null,
                    userData.description || null, 
                    userData.contactEmail,
                    userData.hrContactPhone || null ,
                    userData.contact || null 
                ]);
                break;
            
            case 'TPO':
                const tpoQuery = `
                    INSERT INTO tpo_profiles 
                    (user_id, full_name, institute_name, contact_phone) 
                    VALUES (?, ?, ?, ?)`;
                await connection.execute(tpoQuery, [
                    userId,
                    userData.fullName,
                    userData.instituteName,
                    userData.contactPhone
                ]);
                break;

            default:
                throw new Error('Invalid user role specified.');
        }

        await connection.commit();
        return { userId, message: 'User registered successfully.' };

    } catch (error) {
        await connection.rollback();
        console.error("Transaction Rollback:", error);
        throw error;
    } finally {
        connection.release();
    }
};

export const loginUser = async (loginData: any) => {
    const { email, password, role } = loginData;

    // Step 1: Find the user by their email
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    const [users]: any = await db.execute(userQuery, [email]);

    if (users.length === 0) {
        throw new Error('Authentication failed'); // Generic error
    }
    const user = users[0];

    // Step 2: Check if the role matches
    if (user.role !== role) {
        throw new Error('Authentication failed'); // Generic error
    }

    // Step 3: Compare the provided password with the stored hash
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
        throw new Error('Authentication failed'); // Generic error
    }

    // Step 4: Fetch the user's detailed profile
    const profileTableMap: { [key: string]: string } = {
        STUDENT: 'student_profiles',
        COMPANY: 'company_profiles',
        TPO: 'tpo_profiles',
    };
    const tableName = profileTableMap[user.role];
    const profileQuery = `SELECT * FROM ${tableName} WHERE user_id = ?`;
    const [profiles]: any = await db.execute(profileQuery, [user.id]);
    
    if (profiles.length === 0) {
        // This case is unlikely if registration is transactional, but it's a good safeguard.
        throw new Error('User profile data is missing.');
    }
    const userProfile = profiles[0];

    // Step 5: Create the JWT payload
    const payload = {
        userId: user.id,
        role: user.role,
        email: user.email,
    };

    const jwtSecret = process.env.JWT_SECRET || 'your_default_secret_key';
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });

    // Step 6: Return the final data structure
    return {
        message: 'Login successful!',
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: userProfile,
        },
    };
};