
import db from '../config/db';

export const createJob = async (jobData: any, companyId: number) => {
    const {
        title,
        description,
        location,
        package_lpa,
        tier,
        min_cgpa,
        allowed_departments,
        max_backlogs,
        application_deadline
    } = jobData;

    const query = `
        INSERT INTO jobs 
        (company_id, title, description, location, package_lpa, tier, min_cgpa, allowed_departments, max_backlogs, application_deadline) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const departmentsJson = JSON.stringify(allowed_departments);

    try {
        const [result]: any = await db.execute(query, [
            companyId, title, description, location, package_lpa, tier,
            min_cgpa, departmentsJson, max_backlogs, application_deadline
        ]);
        return { jobId: result.insertId, message: 'Job posted successfully.' };
    } catch (error) {
        console.error("Error creating job in service:", error);
        throw new Error('Database error while creating job.');
    }
};

export const getJobsForUser = async (userPayload: { userId: number; role: string; }) => {
    const { userId, role } = userPayload;
    let query = '';
    let params: any[] = [];

    switch (role) {
        case 'STUDENT':
        case 'TPO':
            query = `
                SELECT 
                    j.id, j.title, j.location, j.package_lpa, j.tier,
                    j.application_deadline, c.company_name 
                FROM jobs j
                JOIN company_profiles c ON j.company_id = c.id
                WHERE j.status = 'OPEN'
                ORDER BY j.created_at DESC
            `;
            break;
        case 'COMPANY':
            const [profiles]: any = await db.execute('SELECT id FROM company_profiles WHERE user_id = ?', [userId]);
            if (profiles.length === 0) {
                throw new Error('Company profile not found for this user.');
            }
            const companyId = profiles[0].id;
            query = `
                SELECT id, title, location, package_lpa, tier, status, application_deadline 
                FROM jobs 
                WHERE company_id = ? 
                ORDER BY created_at DESC
            `;
            params = [companyId];
            break;
        default:
            return [];
    }

    try {
        const [jobs] = await db.execute(query, params);
        return jobs;
    } catch (error) {
        console.error("Error fetching jobs based on role:", error);
        throw new Error('Database error while fetching jobs.');
    }
};

export const getJobWithApplicants = async (jobId: number, companyProfileId: number) => {
    // First, get job details and verify the company owns it.
    const jobQuery = 'SELECT * FROM jobs WHERE id = ? AND company_id = ?';
    const [jobs]: any = await db.execute(jobQuery, [jobId, companyProfileId]);

    if (jobs.length === 0) {
        throw new Error('Job not found or you do not have permission to view it.');
    }
    const jobDetails = jobs[0];

    // Second, get all applicants for this job.
    const applicantsQuery = `
        SELECT 
            sp.full_name, sp.enrollment_no, sp.branch, sp.current_year, 
            sp.cgpa, sp.skills, sp.active_backlogs, sp.default_resume_url,
            a.status as application_status, a.applied_at
        FROM applications a
        JOIN student_profiles sp ON a.student_id = sp.id
        WHERE a.job_id = ?
        ORDER BY a.applied_at DESC
    `;
    const [applicants]: any = await db.execute(applicantsQuery, [jobId]);

    return { jobDetails, applicants };
};

export const updateJobSchedule = async (jobId: number, companyId: number, scheduleData: any) => {
    const { aptitude_date, gd_date, interview_date, offer_letter } = scheduleData;

    // Security Check: Verify that the company making the request owns the job.
    const [jobs]: any = await db.execute('SELECT id FROM jobs WHERE id = ? AND company_id = ?', [jobId, companyId]);
    if (jobs.length === 0) {
        throw new Error('Job not found or you do not have permission to modify it.');
    }

    const query = `
        UPDATE jobs 
        SET 
            aptitude_date = ?, 
            gd_date = ?, 
            interview_date = ?, 
            offer_letter = ? 
        WHERE id = ?
    `;
    
    try {
        await db.execute(query, [aptitude_date, gd_date, interview_date, offer_letter, jobId]);
        return { message: 'Job schedule updated successfully.' };
    } catch (error) {
        console.error("Error updating job schedule:", error);
        throw new Error('Database error while updating the job schedule.');
    }
};

export const getJobWithApplicantsForTpo = async (jobId: number) => {
    const jobQuery = 'SELECT * FROM jobs WHERE id = ?';
    const [jobs]: any = await db.execute(jobQuery, [jobId]);

    if (jobs.length === 0) {
        throw new Error('Job not found.');
    }
    const jobDetails = jobs[0];

    const applicantsQuery = `
        SELECT 
            sp.full_name, sp.enrollment_no, sp.branch, sp.cgpa, 
            sp.skills, sp.default_resume_url, a.status as application_status
        FROM applications a
        JOIN student_profiles sp ON a.student_id = sp.id
        WHERE a.job_id = ?
        ORDER BY a.applied_at DESC
    `;
    const [applicants]: any = await db.execute(applicantsQuery, [jobId]);

    return { jobDetails, applicants };
};