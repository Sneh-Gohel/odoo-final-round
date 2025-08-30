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

    // The 'allowed_departments' array needs to be stringified for the JSON column type in MySQL.
    const departmentsJson = JSON.stringify(allowed_departments);

    try {
        const [result]: any = await db.execute(query, [
            companyId,
            title,
            description,
            location,
            package_lpa,
            tier,
            min_cgpa,
            departmentsJson,
            max_backlogs,
            application_deadline
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
            // Students and TPOs see all jobs with status 'OPEN', with company name.
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
            // Companies see ALL of their own jobs, regardless of status.
            // First, we need to find the company_id associated with the user_id.
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
            // If the role is something else, return an empty array.
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