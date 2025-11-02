const express = require("express");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Connect to PostgreSQL using Render's DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new task
app.post("/tasks", async (req, res) => {
  const { title, description, due_date, priority } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, status, created_at, due_date, priority) VALUES ($1, $2, 'pending', NOW(), $3, $4) RETURNING *",
      [title, description, due_date || null, priority || "Medium"]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark task as completed
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE tasks SET status = 'completed' WHERE id = $1", [id]);
    res.json({ message: "Task marked as completed" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Render / local port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
