const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the tasks table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            isCompleted BOOLEAN DEFAULT 0
        )`,
        (err) => {
            if (!err) {
                // 2. Migration: Add createdAt column (without non-constant DEFAULT)
                db.run(`ALTER TABLE tasks ADD COLUMN createdAt DATETIME`, (alterErr) => {
                    if (!alterErr) {
                        // Backfill existing tasks with current time
                        db.run(`UPDATE tasks SET createdAt = datetime('now') WHERE createdAt IS NULL`);
                    } else if (!alterErr.message.includes("duplicate column name")) {
                        console.error('Error running migration:', alterErr.message);
                    }
                });
            }
        });
    }
});

module.exports = db;