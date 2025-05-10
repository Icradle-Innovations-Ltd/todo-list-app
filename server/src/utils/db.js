const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Get the database path from environment variables or use default
const dbPath = process.env.DB_PATH || './data/tasks.db';
const fullDbPath = path.resolve(__dirname, '../../', dbPath);

// Ensure the data directory exists
const dataDir = path.dirname(fullDbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create a new database connection
const db = new sqlite3.Database(fullDbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize the database with the tasks table
const initializeDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      priority TEXT,
      category TEXT,
      recurring TEXT,
      checklist TEXT,
      notes TEXT,
      status TEXT DEFAULT 'Pending',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err.message);
    } else {
      console.log('Tasks table created or already exists.');
    }
  });
};

module.exports = {
  db,
  initializeDatabase
};