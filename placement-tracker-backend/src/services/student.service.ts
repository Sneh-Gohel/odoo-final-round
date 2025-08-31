import db from '../config/db';

export const getDashboardStats = async (studentId: number) => {
    const applicationCountQuery = 'SELECT COUNT(*) as applicationCount FROM applications WHERE student_id = ?';
    
    const upcomingTestCountQuery = `
        SELECT COUNT(t.id) as upcomingTestCount 
        FROM tests t
        JOIN jobs j ON t.job_id = j.id
        JOIN applications a ON j.id = a.job_id
        WHERE a.student_id = ? 
          AND t.purpose = 'EVALUATION' 
          AND j.status = 'OPEN'
    `;

    try {
        const [appResult]: any = await db.execute(applicationCountQuery, [studentId]);
        const [testResult]: any = await db.execute(upcomingTestCountQuery, [studentId]);

        const applicationCount = appResult[0].applicationCount;
        const upcomingTestCount = testResult[0].upcomingTestCount;

        return { applicationCount, upcomingTestCount };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw new Error('Could not fetch dashboard data.');
    }
};

export const updateResumeUrl = async (studentId: number, resumeUrl: string) => {
    const query = 'UPDATE student_profiles SET default_resume_url = ? WHERE id = ?';
    try {
        await db.execute(query, [resumeUrl, studentId]);
        return { message: 'Resume URL updated successfully.' };
    } catch (error) {
        console.error("Error updating resume URL in service:", error);
        throw new Error('Database error while updating resume URL.');
    }
};

export const getStudentProfile = async (userId: number) => {
    // This query finds the student profile linked to their login ID.
    const query = 'SELECT * FROM student_profiles WHERE user_id = ?';
    try {
        const [profiles]: any = await db.execute(query, [userId]);
        if (profiles.length === 0) {
            throw new Error('Student profile not found for this user.');
        }
        // Return the first (and only) profile found.
        return profiles[0];
    } catch (error) {
        console.error("Error fetching student profile:", error);
        throw error; // Re-throw the error to be handled by the controller
    }
};

export const updateStudentProfile = async (userId: number, profileData: any) => {
    const {
        full_name,
        enrollment_no,
        institute_name,
        branch,
        current_year,
        cgpa,
        skills,
        active_backlogs
    } = profileData;

    const query = `
        UPDATE student_profiles 
        SET 
            full_name = ?, 
            enrollment_no = ?, 
            institute_name = ?, 
            branch = ?, 
            current_year = ?, 
            cgpa = ?, 
            skills = ?, 
            active_backlogs = ?
        WHERE user_id = ?
    `;

    try {
        const [result]: any = await db.execute(query, [
            full_name,
            enrollment_no,
            institute_name,
            branch,
            current_year,
            cgpa,
            skills,
            active_backlogs,
            userId
        ]);

        if (result.affectedRows === 0) {
            throw new Error('Profile not found for this user, could not update.');
        }

        return { message: 'Profile updated successfully.' };

    } catch (error) {
        console.error("Error updating student profile:", error);
        throw error;
    }
};

export const getStudentHistory = async (studentUserId: number) => {
    // This query uses UNION ALL to combine two sets of data into a single list.
    const historyQuery = `
        -- Part 1: Get the initial "Applied" events from the applications table
        SELECT 
            j.title AS job_title,
            c.company_name,
            a.status AS event_description,
            a.applied_at AS event_date
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN company_profiles c ON j.company_id = c.id
        JOIN student_profiles sp ON a.student_id = sp.id
        WHERE sp.user_id = ?

        UNION ALL

        -- Part 2: Get all subsequent status changes from the recruitment_events log
        SELECT 
            j.title AS job_title,
            c.company_name,
            re.event_type AS event_description,
            re.created_at AS event_date
        FROM recruitment_events re
        JOIN applications a ON re.application_id = a.id
        JOIN jobs j ON a.job_id = j.id
        JOIN company_profiles c ON j.company_id = c.id
        JOIN student_profiles sp ON a.student_id = sp.id
        WHERE sp.user_id = ?

        -- Finally, order the combined results to create a chronological timeline
        ORDER BY event_date DESC;
    `;

    try {
        const [history] = await db.execute(historyQuery, [studentUserId, studentUserId]);
        return history;
    } catch (error) {
        console.error("Error fetching student history:", error);
        throw new Error('Database error while fetching activity history.');
    }
};