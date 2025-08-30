import bcrypt from 'bcryptjs';
import db from '../config/db';
import { PoolConnection } from 'mysql2/promise';

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
                    userData.skills
                ]);
                break;

            case 'COMPANY':
                const companyQuery = `
                    INSERT INTO company_profiles 
                    (user_id, company_name, website_url, contact_email, hr_contact_phone) 
                    VALUES (?, ?, ?, ?, ?)`;
                await connection.execute(companyQuery, [
                    userId, userData.companyName, userData.websiteUrl,
                    userData.contactEmail, userData.hrContactPhone,userData.description
                ]);
                break;
            
            case 'TPO':
                 const tpoQuery = `
                    INSERT INTO tpo_profiles 
                    (user_id, full_name, institute_name, contact_phone) 
                    VALUES (?, ?, ?, ?)`;
                await connection.execute(tpoQuery, [
                    userId, userData.fullName, userData.instituteName, userData.contactNumber
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