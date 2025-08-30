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