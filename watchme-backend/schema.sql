-- Drop table if exists
DROP TABLE IF EXISTS shows;

-- Create shows table
CREATE TABLE shows (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- movie, tv show, anime, etc.
    status VARCHAR(50) NOT NULL, -- watching, completed, plan to watch, etc.
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
    notes TEXT,
    watched_at DATE NOT NULL,
    genre VARCHAR(100) NOT NULL,
    poster_url TEXT NOT NULL
);