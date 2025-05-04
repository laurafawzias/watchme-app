const { Pool } = require("pg");
require("dotenv").config();

// Make sure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
    console.error("🔴 DATABASE_URL is not defined in .env file!");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Needed for some Neon PostgreSQL connections
    },
});

pool.connect()
    .then(() => console.log("🟢 Connected to Neon PostgreSQL!"))
    .catch(err => {
        console.error("🔴 Connection error:", err.message);
        console.error("Please check your DATABASE_URL and make sure your database is running");
    });

module.exports = pool;
