
import db from '../config/db';
import { PoolConnection } from 'mysql2/promise';

export const createTestShell = async (testData: any, creatorInfo: { role: string; profileId: number }) => {
    const { title, duration_minutes, purpose, jobId } = testData;
    const { role, profileId } = creatorInfo;

    let query = '';
    let params = [];

    // The logic is now more specific to handle all cases
    if (role === 'TPO' && purpose === 'PREPARATION') {
        // Case 1: TPO creates a practice test
        query = 'INSERT INTO tests (title, duration_minutes, purpose, created_by_tpo_id) VALUES (?, ?, ?, ?)';
        params = [title, duration_minutes, purpose, profileId];
    } else if (role === 'COMPANY' && purpose === 'PREPARATION') {
        // Case 2: Company creates a practice test (uses the new column)
        query = 'INSERT INTO tests (title, duration_minutes, purpose, created_by_company_id) VALUES (?, ?, ?, ?)';
        params = [title, duration_minutes, purpose, profileId];
    } else if (role === 'COMPANY' && purpose === 'EVALUATION' && jobId) {
        // Case 3: Company creates an evaluation test for a specific job
        query = 'INSERT INTO tests (title, duration_minutes, purpose, job_id, created_by_company_id) VALUES (?, ?, ?, ?, ?)';
        params = [title, duration_minutes, purpose, jobId, profileId];
    } else {
        // If none of the valid conditions are met, throw the error.
        throw new Error('Invalid test creation parameters.');
    }

    try {
        const [result]: any = await db.execute(query, params);
        return { testId: result.insertId, message: 'Test created successfully. You can now add questions.' };
    } catch (error) {
        console.error("Error creating test shell:", error);
        throw new Error('Database error while creating the test.');
    }
};


export const addQuestionToTest = async (testId: number, questionData: any) => {
    const { question_text, options } = questionData;
    const connection: PoolConnection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Step 1: Insert the question and get its new ID.
        const questionQuery = 'INSERT INTO questions (test_id, question_text) VALUES (?, ?)';
        const [questionResult]: any = await connection.execute(questionQuery, [testId, question_text]);
        const questionId = questionResult.insertId;

        // Step 2: Prepare and insert all options for that question.
        const optionsQuery = 'INSERT INTO options (question_id, option_text, is_correct) VALUES ?';
        const optionsValues = options.map((opt: any) => [questionId, opt.text, opt.is_correct]);
        await connection.query(optionsQuery, [optionsValues]);

        await connection.commit();
        return { questionId, message: 'Question added successfully.' };
    } catch (error) {
        await connection.rollback();
        console.error("Error adding question:", error);
        throw new Error('Transaction failed while adding question.');
    } finally {
        connection.release();
    }
};

export const deleteQuestion = async (questionId: number) => {
    const query = 'DELETE FROM questions WHERE id = ?';
    try {
        const [result]: any = await db.execute(query, [questionId]);
        if (result.affectedRows === 0) {
            throw new Error('Question not found or already deleted.');
        }
        return { message: 'Question deleted successfully.' };
    } catch (error) {
        console.error("Error deleting question:", error);
        throw error;
    }
};

export const deleteTest = async (testId: number) => {
    const query = 'DELETE FROM tests WHERE id = ?';
    try {
        const [result]: any = await db.execute(query, [testId]);
        if (result.affectedRows === 0) {
            throw new Error('Test not found or already deleted.');
        }
        return { message: 'Test and all its questions/options deleted successfully.' };
    } catch (error) {
        console.error("Error deleting test:", error);
        throw error;
    }
};
