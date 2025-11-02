const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',           // your MySQL password if any
  database: 'task_manager' // 💡 replace this with your real DB name
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL Database');
  }
});

module.exports = db;
