require("dotenv").config();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to handle user sign-up
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingEmail = await pool.query(
      "SELECT * FROM players WHERE email = $1",
      [email]
    );
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Check if the username is already registered
    const existingUsername = await pool.query(
      "SELECT * FROM players WHERE username = $1",
      [username]
    );
    if (existingUsername.rows.length > 0) {
      // Corrected here
      return res.status(409).json({ message: "Username already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO players (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    // Respond with the newly created user (excluding password)
    const user = newUser.rows[0];
    delete user.password; // Optionally exclude password from response
    res.status(201).json({
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "An error occurred during signup." });
  }
};

// Update an existing question
const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question_text, correct_answer, wrong_answers } = req.body;

  try {
    // Check if the question exists
    const existingQuestion = await pool.query(
      "SELECT * FROM questions WHERE id = $1",
      [id]
    );
    if (existingQuestion.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Update the question in the database
    const updatedQuestion = await pool.query(
      "UPDATE questions SET question_text = $1, correct_answer = $2, wrong_answers = $3::text[] WHERE id = $4 RETURNING *",
      [question_text, correct_answer, wrong_answers, id]
    );

    res.status(200).json(updatedQuestion.rows[0]); // Return the updated question
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Error updating question." });
  }
};

// Function to handle user login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const userResult = await pool.query(
      "SELECT * FROM players WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password with the hashed password
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create and send JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error: " + error.message);
  }
};

// Function to authenticate user
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Save the user info in request
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Function to track a player's score (implement as needed)
const trackScore = async (req, res) => {
  // Logic to track score...
};

// Function to get the leaderboard (implement as needed)
const getLeaderboard = async (req, res) => {
  // Logic to get leaderboard...
};

// Get all questions
const getQuestions = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM questions");

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
    res.status(500).send("Server Error: " + error.message); // Include error message in response
  }
};

// Add a new question
const addQuestion = async (req, res) => {
  const questions = req.body; // Assuming req.body is an array of question objects

  if (!Array.isArray(questions)) {
    return res
      .status(400)
      .json({ message: "Request body must be an array of questions." });
  }

  try {
    const insertPromises = questions.map(async (question) => {
      const { question_text, correct_answer, wrong_answers } = question;

      // Validate input
      if (!question_text || !correct_answer || !Array.isArray(wrong_answers)) {
        throw new Error("Invalid question data.");
      }

      // Check if the question already exists
      const existingQuestion = await pool.query(
        "SELECT * FROM questions WHERE question_text = $1 AND correct_answer = $2",
        [question_text, correct_answer]
      );

      if (existingQuestion.rows.length > 0) {
        return { question_text, status: "exists" }; // Skip if already exists
      }

      // Insert the question
      const result = await pool.query(
        "INSERT INTO questions (question_text, correct_answer, wrong_answers) VALUES ($1, $2, $3::text[]) RETURNING *",
        [question_text, correct_answer, wrong_answers]
      );

      return { question_text, status: "inserted", question: result.rows[0] };
    });

    const results = await Promise.all(insertPromises);

    res.status(201).json(results); // Return results for all questions
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error: " + error.message);
  }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the question exists
    const existingQuestion = await pool.query(
      "SELECT * FROM questions WHERE id = $1",
      [id]
    );

    if (existingQuestion.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Delete the question from the database
    await pool.query("DELETE FROM questions WHERE id = $1", [id]);

    res.status(200).json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Error deleting question." });
  }
};

// Export functions for external use
module.exports = {
  getQuestions,
  addQuestion,
  signup,
  login,
  authenticate,
  trackScore,
  getLeaderboard,
  updateQuestion,
  deleteQuestion
};
