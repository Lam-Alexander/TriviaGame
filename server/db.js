const { Pool } = require('pg');

// Create a new Pool instance using environment variables
const pool = new Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: 'trivia_game' // Ensure this matches your actual database name
});

module.exports = pool;
