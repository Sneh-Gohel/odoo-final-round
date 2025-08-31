// File Path: src/services/application.service.ts (CORRECTED)

import db from '../config/db';

export const applyForJob = async (studentUserId: number, jobId: number) => {
    // --- Step 1: Fetch all necessary data ---
    const studentProfileQuery = 'SELECT * FROM student_profiles WHERE user_id = ?';
    const jobDetailsQuery = 'SELECT * FROM jobs WHERE id = ?';
    
    const [studentProfiles]: any = await db.execute(studentProfileQuery, [studentUserId]);
    const [jobDetails]: any = await db.execute(jobDetailsQuery, [jobId]);

    // Ensure both student and job exist
    if (studentProfiles.length === 0) throw new Error('Student profile not found.');
    if (jobDetails.length === 0) throw new Error('Job not found.');
    
    const student = studentProfiles[0];
    const job = jobDetails[0];

    // --- Step 2: Perform Pre-application Checks ---

    // --- THE CORRECT RESUME CHECK (as you requested) ---
    // It now only checks the student_profiles table.
    if (!student.default_resume_url) {
        throw new Error('Please upload a resume before applying for jobs.');
    }

    // Check 2b: Eligibility Criteria (Unchanged)
    if (student.cgpa < job.min_cgpa) {
        throw new Error(`Eligibility check failed: Your CGPA (${student.cgpa}) is below the required minimum (${job.min_cgpa}).`);
    }
    if (student.active_backlogs > job.max_backlogs) {
        throw new Error(`Eligibility check failed: You have more than the allowed number of backlogs.`);
    }
    const allowedDepartments = JSON.parse(job.allowed_departments || '[]');
    if (!allowedDepartments.includes(student.branch)) {
        throw new Error(`Eligibility check failed: Your branch (${student.branch}) is not eligible for this role.`);
    }

    // Check 2c: Placement Policy Rules (Unchanged)
    const acceptedOfferQuery = `
        SELECT j.package_lpa 
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.student_id = ? AND a.status = 'ACCEPTED'
        ORDER BY j.package_lpa DESC LIMIT 1
    `;
    const [offers]: any = await db.execute(acceptedOfferQuery, [student.id]);

    if (offers.length > 0) {
        const highestOfferPackage = offers[0].package_lpa;
        if (job.package_lpa < highestOfferPackage) {
            throw new Error(`Placement rule violated: You cannot apply for a job with a package lower than your accepted offer.`);
        }
        if (student.upgrade_count >= 2 && job.tier !== 'TIER_1') {
             throw new Error(`Placement rule violated: You have already used your 2 placement upgrades.`);
        }
    }
    
    // --- Step 3: Create the Application (SIMPLIFIED QUERY) ---
    // The query is now simple and does not include resume_id.
    const applyQuery = 'INSERT INTO applications (student_id, job_id, status) VALUES (?, ?, ?)';
    try {
        await db.execute(applyQuery, [student.id, jobId, 'APPLIED']);
        return { message: 'Application submitted successfully!' };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('You have already applied for this job.');
        }
        console.error("Error creating application:", error);
        throw new Error('An error occurred while submitting your application.');
    }
};
