
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

export const getTestForStudent = async (testId: number) => {
    // Query 1: Get the main test details.
    const testQuery = 'SELECT id, title, duration_minutes FROM tests WHERE id = ?';
    const [tests]: any = await db.execute(testQuery, [testId]);

    if (tests.length === 0) {
        throw new Error('Test not found.');
    }
    const testDetails = tests[0];

    // Query 2: Get all questions and options for this test.
    // We select all fields here but will filter 'is_correct' in the next step.
    const questionsAndOptionsQuery = `
        SELECT 
            q.id AS questionId, 
            q.question_text, 
            o.id AS optionId, 
            o.option_text
        FROM questions q
        JOIN options o ON q.id = o.question_id
        WHERE q.test_id = ?
        ORDER BY q.id, o.id;
    `;
    const [rows]: any = await db.execute(questionsAndOptionsQuery, [testId]);

    // Structure the flat data into a nested JSON object.
    const questionsMap = new Map();
    rows.forEach((row: any) => {
        if (!questionsMap.has(row.questionId)) {
            questionsMap.set(row.questionId, {
                questionId: row.questionId,
                question_text: row.question_text,
                options: []
            });
        }
        questionsMap.get(row.questionId).options.push({
            optionId: row.optionId,
            option_text: row.option_text
        });
    });

    const structuredQuestions = Array.from(questionsMap.values());

    return {
        ...testDetails,
        questions: structuredQuestions
    };
};

export const getTestDetails = async (testId: number) => {
    const testQuery = 'SELECT id, title, duration_minutes FROM tests WHERE id = ?';
    const [tests]: any = await db.execute(testQuery, [testId]);

    if (tests.length === 0) {
        throw new Error('Test not found.');
    }
    const testDetails = tests[0];

    const questionsAndOptionsQuery = `
        SELECT 
            q.id AS questionId, q.question_text, 
            o.id AS optionId, o.option_text
        FROM questions q
        JOIN options o ON q.id = o.question_id
        WHERE q.test_id = ?
        ORDER BY q.id, o.id;
    `;
    const [rows]: any = await db.execute(questionsAndOptionsQuery, [testId]);

    const questionsMap = new Map();
    rows.forEach((row: any) => {
        if (!questionsMap.has(row.questionId)) {
            questionsMap.set(row.questionId, {
                questionId: row.questionId,
                question_text: row.question_text,
                options: []
            });
        }
        questionsMap.get(row.questionId).options.push({
            optionId: row.optionId,
            option_text: row.option_text
        });
    });

    const structuredQuestions = Array.from(questionsMap.values());

    return {
        ...testDetails,
        questions: structuredQuestions
    };
};

export const submitTestForGrading = async (studentUserId: number, testId: number, submittedAnswers: any[]) => {
    // Step 1: Fetch the correct answers from the database for this test.
    const answerKeyQuery = `
        SELECT q.id AS questionId, o.id AS correctOptionId 
        FROM options o
        JOIN questions q ON o.question_id = q.id
        WHERE q.test_id = ? AND o.is_correct = TRUE;
    `;
    const [correctAnswers]: any = await db.execute(answerKeyQuery, [testId]);

    if (correctAnswers.length === 0) {
        throw new Error('Could not retrieve answer key for this test. It may have no questions.');
    }

    // Step 2: Create an efficient lookup map for the correct answers.
    const answerKey = new Map<number, number>();
    correctAnswers.forEach((ans: any) => {
        answerKey.set(ans.questionId, ans.correctOptionId);
    });

    // Step 3: Grade the submission by comparing with the answer key.
    let score = 0;
    submittedAnswers.forEach((submission: any) => {
        if (answerKey.get(submission.questionId) === submission.selectedOptionId) {
            score++;
        }
    });
    const totalMarks = correctAnswers.length;

    // Step 4: Save the final score to the 'test_results' table.
    // First, get the student's profile ID.
    const [profiles]: any = await db.execute('SELECT id FROM student_profiles WHERE user_id = ?', [studentUserId]);
    if (profiles.length === 0) {
        throw new Error('Student profile not found.');
    }
    const studentProfileId = profiles[0].id;
    
    const saveResultQuery = 'INSERT INTO test_results (student_id, test_id, score, total_marks) VALUES (?, ?, ?, ?)';
    try {
        await db.execute(saveResultQuery, [studentProfileId, testId, score, totalMarks]);
    } catch (error: any) {
        // Handle cases where a student might try to submit the same test twice.
        // This requires a UNIQUE constraint on (student_id, test_id) in the test_results table.
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('You have already submitted this test.');
        }
        throw error;
    }

    // Step 5: Return the result to the student.
    return {
        message: 'Test submitted and graded successfully!',
        score,
        totalMarks
    };
};