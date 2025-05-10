const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

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

// Initialize the database with all required tables
const initializeDatabase = () => {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      profilePicture TEXT,
      theme TEXT DEFAULT 'light',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      lastLogin TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or already exists.');
      
      // Create test user if it doesn't exist
      createTestUserIfNotExists();
    }
  });

  // Check if tasks table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'", (err, table) => {
    if (err) {
      console.error('Error checking for tasks table:', err.message);
      return;
    }
    
    if (!table) {
      // If tasks table doesn't exist, create it with user_id column
      db.run(`
        CREATE TABLE tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          title TEXT NOT NULL,
          description TEXT,
          dueDate TEXT,
          priority TEXT,
          category TEXT,
          recurring TEXT,
          checklist TEXT,
          notes TEXT,
          status TEXT DEFAULT 'Pending',
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tasks table:', err.message);
        } else {
          console.log('Tasks table created.');
        }
      });
    } else {
      // If tasks table exists, check if user_id column exists
      db.all("PRAGMA table_info(tasks)", (err, columns) => {
        if (err) {
          console.error('Error getting tasks table info:', err.message);
          return;
        }
        
        // Check if user_id column exists
        const hasUserIdColumn = columns && Array.isArray(columns) && columns.some(col => col.name === 'user_id');
        
        if (!hasUserIdColumn) {
          // Add user_id column to existing tasks table
          db.run("ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id)", (err) => {
            if (err) {
              console.error('Error adding user_id column to tasks table:', err.message);
            } else {
              console.log('Added user_id column to tasks table.');
              // Migrate existing tasks to test user
              migrateExistingTasks();
            }
          });
        } else {
          console.log('Tasks table already has user_id column.');
          // Migrate existing tasks if needed
          migrateExistingTasks();
        }
      });
    }
  });

  // Create user_activity table for tracking and analytics
  db.run(`
    CREATE TABLE IF NOT EXISTS user_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      action_type TEXT NOT NULL,
      action_details TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating user_activity table:', err.message);
    } else {
      console.log('User activity table created or already exists.');
    }
  });
};

// Create a test user if it doesn't exist
const createTestUserIfNotExists = () => {
  db.get('SELECT * FROM users WHERE username = ?', ['testuser'], (err, row) => {
    if (err) {
      console.error('Error checking for test user:', err.message);
    } else if (!row) {
      // Create a test user with hashed password
      bcrypt.hash('password123', 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err.message);
        } else {
          db.run(
            'INSERT INTO users (username, email, password, firstName, lastName, theme) VALUES (?, ?, ?, ?, ?, ?)',
            ['testuser', 'test@example.com', hash, 'Test', 'User', 'light'],
            function(err) {
              if (err) {
                console.error('Error creating test user:', err.message);
              } else {
                console.log('Test user created with ID:', this.lastID);
                // Create some sample tasks for the test user
                createSampleTasksForTestUser(this.lastID);
              }
            }
          );
        }
      });
    }
  });
};

// Create sample tasks for the test user
const createSampleTasksForTestUser = (userId) => {
  const sampleTasks = [
    {
      title: 'Complete project proposal',
      description: 'Finish the draft and send for review',
      priority: 'High',
      category: 'Work',
      status: 'Pending',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow
    },
    {
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, and vegetables',
      priority: 'Medium',
      category: 'Personal',
      status: 'Pending',
      checklist: JSON.stringify([
        { text: 'Milk', completed: false },
        { text: 'Eggs', completed: false },
        { text: 'Bread', completed: false },
        { text: 'Vegetables', completed: false }
      ])
    },
    {
      title: 'Go for a run',
      description: '30 minutes jogging in the park',
      priority: 'Low',
      category: 'Health',
      status: 'Completed',
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      title: 'Read a book',
      description: 'Finish chapter 5',
      priority: 'Medium',
      category: 'Personal',
      status: 'Completed',
      createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
    },
    {
      title: 'Weekly team meeting',
      description: 'Discuss project progress',
      priority: 'High',
      category: 'Work',
      status: 'Pending',
      recurring: 'Weekly',
      dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0] // Day after tomorrow
    }
  ];

  // Insert sample tasks
  const stmt = db.prepare(`
    INSERT INTO tasks (
      user_id, title, description, dueDate, priority, category, 
      recurring, checklist, notes, status, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleTasks.forEach(task => {
    stmt.run(
      userId,
      task.title,
      task.description || '',
      task.dueDate || null,
      task.priority || 'Medium',
      task.category || '',
      task.recurring || 'None',
      task.checklist || '[]',
      task.notes || '',
      task.status || 'Pending',
      task.createdAt || new Date().toISOString()
    );
  });

  stmt.finalize();
  console.log('Sample tasks created for test user');
};

// Migrate existing tasks to associate with the test user
const migrateExistingTasks = () => {
  // First check if the user_id column exists
  db.all("PRAGMA table_info(tasks)", (err, columns) => {
    if (err) {
      console.error('Error getting tasks table info:', err.message);
      return;
    }
    
    // Check if user_id column exists
    const hasUserIdColumn = columns && Array.isArray(columns) && columns.some(col => col.name === 'user_id');
    
    if (hasUserIdColumn) {
      // If user_id column exists, migrate tasks
      db.get('SELECT COUNT(*) as count FROM tasks WHERE user_id IS NULL', (err, result) => {
        if (err) {
          console.error('Error checking for tasks to migrate:', err.message);
        } else if (result && result.count > 0) {
          // Get the test user ID
          db.get('SELECT id FROM users WHERE username = ?', ['testuser'], (err, user) => {
            if (err || !user) {
              console.error('Error finding test user for migration:', err ? err.message : 'User not found');
            } else {
              // Update all tasks without a user_id to belong to the test user
              db.run('UPDATE tasks SET user_id = ? WHERE user_id IS NULL', [user.id], function(err) {
                if (err) {
                  console.error('Error migrating tasks:', err.message);
                } else {
                  console.log(`Migrated ${this.changes} existing tasks to test user`);
                }
              });
            }
          });
        } else {
          console.log('No tasks need migration.');
        }
      });
    } else {
      console.log('Cannot migrate tasks: user_id column does not exist yet.');
    }
  });
};

module.exports = {
  db,
  initializeDatabase
};