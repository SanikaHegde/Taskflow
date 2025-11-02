const express = require('express');
const path = require('path');
const db = require('./db'); // MySQL connection
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend

// ✅ Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Add a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const sql = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
  db.query(sql, [title, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, title, description, status: 'pending' });
  });
});

// ✅ Mark as completed
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE tasks SET status="completed" WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Task marked as completed' });
  });
});

// ✅ Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Task deleted successfully' });
  });
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
