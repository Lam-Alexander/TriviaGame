require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const triviaRoutes = require("./routes/triviaRoutes"); // Import your trivia routes

const app = express();
app.use(cors());
app.use(express.json());

// Use trivia routes
app.use("/api", triviaRoutes); // Prefix all routes with /api

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
