const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Get all tasks (supports searching by title)
// 1. Get tasks (supports searching, filtering by status, and backend pagination)
app.get('/api/tasks', (req, res) => {
    const { search, status, sortBy, dateFilter } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default to 5 tasks per page
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];
    const conditions = [];

    // Filter by search query
    if (search) {
        conditions.push('title LIKE ?');
        params.push(`%${search}%`);
    }

    // Filter by completion status
    if (status === 'Active') {
        conditions.push('isCompleted = 0');
    } else if (status === 'Inactive') {
        conditions.push('isCompleted = 1');
    }

    // Filter by creation date (using datetime() and date() to normalize mixed date formats)
    if (dateFilter === 'Today') {
        conditions.push("date(createdAt, 'localtime') = date('now', 'localtime')");
    } else if (dateFilter === 'Week') {
        conditions.push("datetime(createdAt) >= datetime('now', '-7 days')");
    }

    if (conditions.length > 0) {
        whereClause = ' WHERE ' + conditions.join(' AND ');
    }

    // Define Sorting Order (Default: Newest First) - using datetime() to normalize sorting
    let orderClause = ' ORDER BY datetime(createdAt) DESC';
    if (sortBy === 'oldest') {
        orderClause = ' ORDER BY datetime(createdAt) ASC';
    }

    const countQuery = `SELECT COUNT(*) as count FROM tasks${whereClause}`;
    const dataQuery = `SELECT * FROM tasks${whereClause}${orderClause} LIMIT ? OFFSET ?`;

    db.get(countQuery, params, (err, countResult) => {
        if (err) return res.status(500).json({ error: err.message });
        const totalTasks = countResult ? countResult.count : 0;
        const totalPages = Math.ceil(totalTasks / limit);

        db.all(dataQuery, [...params, limit, offset], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            const tasks = rows.map(task => ({
                ...task,
                isCompleted: task.isCompleted === 1
            }));

            res.json({
                tasks,
                pagination: {
                    totalTasks,
                    totalPages,
                    currentPage: page,
                    limit
                }
            });
        });
    });
});

// 2. Add a new task
app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const now = new Date().toISOString();
    const query = 'INSERT INTO tasks (title, description, isCompleted, createdAt) VALUES (?, ?, ?, ?)';
    db.run(query, [title, description, 0, now], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, description, isCompleted: false, createdAt: now });
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