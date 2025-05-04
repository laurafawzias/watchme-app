const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all shows
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM shows ORDER BY id DESC");
        // Always return an array, even if empty
        res.json(result.rows || []);
    } catch (err) {
        console.error("Database error:", err.message);
        res.status(500).json({ error: "Failed to retrieve shows from database" });
    }
});

// POST new show
router.post("/", async (req, res) => {
    try {
        const { title, type, status, rating, notes, watched_at, genre, poster_url } = req.body;
        
        if (!title || !type || !status || !rating || !watched_at || !genre) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        const result = await pool.query(
            "INSERT INTO shows (title, type, status, rating, notes, watched_at, genre, poster_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
            [
                title, 
                type, 
                status, 
                rating, 
                notes || "", 
                watched_at, 
                genre, 
                poster_url || "https://via.placeholder.com/300x450?text=No+Image"
            ]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err.message);
        res.status(500).json({ error: "Failed to add show to database" });
    }
});

// DELETE a show
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await pool.query("DELETE FROM shows WHERE id = $1 RETURNING *", [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Show not found" });
        }

        res.json({ message: "Show deleted successfully", id });
    } catch (err) {
        console.error("Database error:", err.message);
        res.status(500).json({ error: "Failed to delete show" });
    }
});

// PUT / EDIT a show
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, status, rating, notes, watched_at, genre, poster_url } = req.body;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        if (!title || !type || !status || !rating || !watched_at || !genre) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        const result = await pool.query(
            "UPDATE shows SET title = $1, type = $2, status = $3, rating = $4, notes = $5, watched_at = $6, genre = $7, poster_url = $8 WHERE id = $9 RETURNING *",
            [
                title, 
                type, 
                status, 
                rating, 
                notes || "", 
                watched_at, 
                genre, 
                poster_url || "https://via.placeholder.com/300x450?text=No+Image", 
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Show not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err.message);
        res.status(500).json({ error: "Failed to update show" });
    }
});

module.exports = router;
