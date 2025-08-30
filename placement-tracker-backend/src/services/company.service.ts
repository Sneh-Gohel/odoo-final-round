

import db from '../config/db';

export const getCompanyProfile = async (userId: number) => {
    // This query finds the company profile linked to the user's login ID.
    const query = 'SELECT * FROM company_profiles WHERE user_id = ?';

    try {
        const [profiles]: any = await db.execute(query, [userId]);

        if (profiles.length === 0) {
            throw new Error('Company profile not found for this user.');
        }

        // Return the first (and only) profile found.
        return profiles[0];

    } catch (error) {
        console.error("Error fetching company profile:", error);
        // Re-throw the error to be handled by the controller.
        throw error;
    }
};