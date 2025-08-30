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