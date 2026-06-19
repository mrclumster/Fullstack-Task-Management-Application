const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Get all tasks (supports searching by title)
app.get('/api/tasks', (req, res) => {
    const { search } = req.query;
    let query = 'SELECT * FROM tasks';
    const params = [];

    if (search) {
        query += ' WHERE title LIKE ?';
        params.push(`%${search}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Convert integer boolean to true/false for the React frontend
        const tasks = rows.map(task => ({
            ...task,
            isCompleted: task.isCompleted === 1
        }));
        res.json(tasks);
    });
});

// 2. Add a new task
app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const query = 'INSERT INTO tasks (title, description, isCompleted) VALUES (?, ?, ?)';
    db.run(query, [title, description, 0], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, description, isCompleted: false });
    });
});

// 3. Update a task (edit details or toggle completion)
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;
    
    // Convert true/false boolean back to 1 or 0 for SQLite
    const completedInt = isCompleted ? 1 : 0;

    const query = 'UPDATE tasks SET title = ?, description = ?, isCompleted = ? WHERE id = ?';
    db.run(query, [title, description, completedInt, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        
        res.json({ id: Number(id), title, description, isCompleted });
    });
});

// 4. Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    
    db.run(query, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        
        res.json({ message: 'Task deleted successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});