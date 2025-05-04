const pool = require('./db');

const seedDatabase = async () => {
  try {
    // First create the table schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shows (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
        notes TEXT,
        watched_at DATE NOT NULL,
        genre VARCHAR(100) NOT NULL,
        poster_url TEXT NOT NULL
      )
    `);
    
    console.log("✅ Shows table created successfully");
    console.log("✅ Database schema initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Error initializing database schema:", error.message);
    return false;
  } finally {
    // We don't close the pool here so the server can use it
    console.log("✅ Schema setup process completed");
  }
};

// Execute the seed function if this script is run directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Schema setup completed, exiting.");
      process.exit(0);
    })
    .catch(err => {
      console.error("❌ Schema setup failed:", err);
      process.exit(1);
    });
}

module.exports = seedDatabase;