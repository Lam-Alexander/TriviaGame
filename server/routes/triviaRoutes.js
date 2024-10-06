const express = require('express');
const router = express.Router();
const { 
    getQuestions, 
    addQuestion, 
    signup, 
    login, 
    authenticate, 
    trackScore, 
    getLeaderboard 
} = require('../controllers/triviaController');

// Route to get all questions
router.get('/questions', authenticate, getQuestions); // Authenticate users before allowing access

// Route to add a new question (only accessible if authenticated)
router.post('/questions', authenticate, addQuestion);

// Route for user sign-up
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route to track a player's score
router.post('/score', authenticate, trackScore); // Must be authenticated to track score

// Route to get the leaderboard
router.get('/leaderboard', getLeaderboard); // No authentication needed to view the leaderboard

module.exports = router;
