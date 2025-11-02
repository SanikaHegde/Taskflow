const express = require('express');
const path = require('path');
require('dotenv').config();
const db = require('./db'); // PostgreSQL connection

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'Medium',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// ✅ Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new task
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;
    const result = await db.query(
      'INSERT INTO tasks (title, description, priority, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, priority, due_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark as completed
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE tasks SET status = $1 WHERE id = $2', ['completed', id]);
    res.json({ message: 'Task marked as completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
