const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db"); // Import the db connection
const seedDatabase = require("./seed"); // Import the seed function

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route to verify server is running
app.get("/", (req, res) => {
    res.json({ message: "WatchMe API is running!" });
});

// Routes
const showRoutes = require("./routes/shows");
app.use("/api/shows", showRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong on the server" });
});

// Function to initialize the database and start the server
async function initializeApp() {
    try {
        // Seed the database with sample data
        await seedDatabase();
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🔗 API available at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to initialize app:", error);
        process.exit(1);
    }
}

// Initialize the application
initializeApp();
