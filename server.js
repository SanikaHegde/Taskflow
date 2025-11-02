const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO tasks (title, description, status, priority, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [title, description, 'pending', 'Medium']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark task as completed
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE tasks SET status=$1 WHERE id=$2', ['completed', id]);
    res.json({ message: 'Task marked as completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id=$1', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
