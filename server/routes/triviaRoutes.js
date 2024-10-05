const express = require('express');
const router = express.Router();
const { getQuestions, addQuestion } = require('../controllers/triviaController');

// Route to get all questions
router.get('/questions', getQuestions);

// Route to add a new question
router.post('/questions', addQuestion);

module.exports = router;
