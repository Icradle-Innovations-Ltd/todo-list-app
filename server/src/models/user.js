const { db } = require('../utils/db');
const bcrypt = require('bcrypt');

// User model for SQLite interactions
const User = {
  // Get all users (admin function)
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, email, firstName, lastName, profilePicture, theme, createdAt, lastLogin FROM users', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Get a single user by ID
  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, username, email, firstName, lastName, profilePicture, theme, createdAt, lastLogin FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (!row) {
            reject(new Error('User not found'));
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  // Get a user by username (for login)
  getByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error('User not found'));
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get a user by email (for registration validation)
  getByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Create a new user
  create: async (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const {
          username,
          email,
          firstName,
          lastName,
          profilePicture,
          theme
        } = userData;

        db.run(
          `INSERT INTO users (
            username, email, password, firstName, lastName, profilePicture, theme
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            username,
            email,
            hashedPassword,
            firstName || '',
            lastName || '',
            profilePicture || '',
            theme || 'light'
          ],
          function(err) {
            if (err) {
              reject(err);
            } else {
              // Get the newly created user (without password)
              User.getById(this.lastID)
                .then(user => resolve(user))
                .catch(err => reject(err));
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  },

  // Update a user
  update: (id, userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // First check if the user exists
        const existingUser = await User.getById(id).catch(() => null);
        if (!existingUser) {
          return reject(new Error('User not found'));
        }

        // Prepare the update data
        const updates = [];
        const values = [];

        // Only update fields that are provided
        Object.keys(userData).forEach(key => {
          if (key !== 'id' && key !== 'password' && userData[key] !== undefined) {
            updates.push(`${key} = ?`);
            values.push(userData[key]);
          }
        });

        // Handle password update separately (with hashing)
        if (userData.password) {
          updates.push('password = ?');
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          values.push(hashedPassword);
        }

        // Add the ID at the end for the WHERE clause
        values.push(id);

        // Execute the update query
        db.run(
          `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
          values,
          function(err) {
            if (err) {
              reject(err);
            } else if (this.changes === 0) {
              reject(new Error('No user was updated'));
            } else {
              // Get the updated user
              User.getById(id)
                .then(user => resolve(user))
                .catch(err => reject(err));
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  },

  // Update last login time
  updateLastLogin: (id) => {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.run(
        'UPDATE users SET lastLogin = ? WHERE id = ?',
        [now, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, lastLogin: now });
          }
        }
      );
    });
  },

  // Delete a user
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('No user was deleted'));
        } else {
          resolve({ id, deleted: true });
        }
      });
    });
  },

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Get user statistics
  getStatistics: (userId) => {
    return new Promise((resolve, reject) => {
      const stats = {};
      
      // Get total tasks count
      db.get('SELECT COUNT(*) as total FROM tasks WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        stats.totalTasks = row.total;
        
        // Get completed tasks count
        db.get('SELECT COUNT(*) as completed FROM tasks WHERE user_id = ? AND status = "Completed"', [userId], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          stats.completedTasks = row.completed;
          
          // Get pending tasks count
          db.get('SELECT COUNT(*) as pending FROM tasks WHERE user_id = ? AND status = "Pending"', [userId], (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            stats.pendingTasks = row.pending;
            
            // Get tasks by priority
            db.all('SELECT priority, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY priority', [userId], (err, rows) => {
              if (err) {
                reject(err);
                return;
              }
              stats.tasksByPriority = rows;
              
              // Get tasks by category
              db.all('SELECT category, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY category', [userId], (err, rows) => {
                if (err) {
                  reject(err);
                  return;
                }
                stats.tasksByCategory = rows;
                
                // Get tasks completed by day (last 7 days)
                db.all(`
                  SELECT date(createdAt) as date, COUNT(*) as count 
                  FROM tasks 
                  WHERE user_id = ? AND status = "Completed" 
                  AND createdAt >= date('now', '-7 days') 
                  GROUP BY date(createdAt)
                  ORDER BY date(createdAt)
                `, [userId], (err, rows) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  stats.completedByDay = rows;
                  
                  resolve(stats);
                });
              });
            });
          });
        });
      });
    });
  }
};

module.exports = User;