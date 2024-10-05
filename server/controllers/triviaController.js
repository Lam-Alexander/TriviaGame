const pool = require('../db'); // Import your pool from db.js

// Get all questions
const getQuestions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM questions');
        
        // Combine correct_answer and wrong_answers into one answers array
        const formattedQuestions = result.rows.map((question) => {
            return {
                questionText: question.question_text,
                correctAnswer: question.correct_answer,
                answers: [question.correct_answer, ...question.wrong_answers], // Combine correct and wrong answers
            };
        });

        res.json(formattedQuestions); // Return all questions in the new format
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error: ' + error.message); // Include error message in response
    }
};


// Add a new question
const addQuestion = async (req, res) => {
    const { question_text, correct_answer, wrong_answers } = req.body;

    try {
        // Check if the question already exists
        const existingQuestion = await pool.query(
            'SELECT * FROM questions WHERE question_text = $1 AND correct_answer = $2',
            [question_text, correct_answer]
        );

        if (existingQuestion.rows.length > 0) {
            return res.status(409).json({ message: 'Question already exists.' }); // Return 409 Conflict
        }

        const result = await pool.query(
            'INSERT INTO questions (question_text, correct_answer, wrong_answers) VALUES ($1, $2, $3::text[]) RETURNING *',
            [question_text, correct_answer, wrong_answers]
        );

        res.status(201).json(result.rows[0]); // Return the newly created question
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error: ' + error.message);
    }
};


module.exports = { getQuestions, addQuestion };
