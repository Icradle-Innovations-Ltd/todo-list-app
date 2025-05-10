const { db } = require('../utils/db');

// Task model for SQLite interactions
const Task = {
  // Get all tasks for a specific user
  getAllByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY createdAt DESC', [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse the checklist JSON for each task
          const tasks = rows.map(task => {
            if (task.checklist) {
              try {
                task.checklist = JSON.parse(task.checklist);
              } catch (e) {
                task.checklist = [];
              }
            } else {
              task.checklist = [];
            }
            return task;
          });
          resolve(tasks);
        }
      });
    });
  },

  // Get all tasks (admin function)
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse the checklist JSON for each task
          const tasks = rows.map(task => {
            if (task.checklist) {
              try {
                task.checklist = JSON.parse(task.checklist);
              } catch (e) {
                task.checklist = [];
              }
            } else {
              task.checklist = [];
            }
            return task;
          });
          resolve(tasks);
        }
      });
    });
  },

  // Get a single task by ID
  getById: (id, userId = null) => {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM tasks WHERE id = ?';
      const params = [id];
      
      // If userId is provided, ensure the task belongs to this user
      if (userId) {
        query += ' AND user_id = ?';
        params.push(userId);
      }
      
      db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error('Task not found'));
        } else {
          // Parse the checklist JSON
          if (row.checklist) {
            try {
              row.checklist = JSON.parse(row.checklist);
            } catch (e) {
              row.checklist = [];
            }
          } else {
            row.checklist = [];
          }
          resolve(row);
        }
      });
    });
  },

  // Create a new task
  create: (taskData) => {
    return new Promise((resolve, reject) => {
      // Convert checklist array to JSON string if it exists
      if (taskData.checklist && Array.isArray(taskData.checklist)) {
        taskData.checklist = JSON.stringify(taskData.checklist);
      } else if (taskData.checklist) {
        try {
          // Ensure it's valid JSON if it's a string
          JSON.parse(taskData.checklist);
        } catch (e) {
          taskData.checklist = '[]';
        }
      } else {
        taskData.checklist = '[]';
      }

      const {
        user_id,
        title,
        description,
        dueDate,
        priority,
        category,
        recurring,
        checklist,
        notes,
        status
      } = taskData;

      // Ensure user_id is provided
      if (!user_id) {
        return reject(new Error('User ID is required'));
      }

      db.run(
        `INSERT INTO tasks (
          user_id, title, description, dueDate, priority, category, recurring, checklist, notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          title,
          description || '',
          dueDate || null,
          priority || 'Medium',
          category || '',
          recurring || 'None',
          checklist,
          notes || '',
          status || 'Pending'
        ],
        function(err) {
          if (err) {
            reject(err);
          } else {
            // Get the newly created task
            Task.getById(this.lastID)
              .then(task => resolve(task))
              .catch(err => reject(err));
          }
        }
      );
    });
  },

  // Update a task
  update: (id, taskData, userId = null) => {
    return new Promise((resolve, reject) => {
      // First check if the task exists and belongs to the user
      Task.getById(id, userId)
        .then(existingTask => {
          // Convert checklist array to JSON string if it exists
          if (taskData.checklist && Array.isArray(taskData.checklist)) {
            taskData.checklist = JSON.stringify(taskData.checklist);
          } else if (taskData.checklist) {
            try {
              // Ensure it's valid JSON if it's a string
              JSON.parse(taskData.checklist);
            } catch (e) {
              taskData.checklist = existingTask.checklist ? JSON.stringify(existingTask.checklist) : '[]';
            }
          }

          // Prepare the update data
          const updates = [];
          const values = [];

          // Only update fields that are provided
          Object.keys(taskData).forEach(key => {
            if (key !== 'id' && key !== 'user_id' && taskData[key] !== undefined) {
              updates.push(`${key} = ?`);
              values.push(taskData[key]);
            }
          });

          // Add the ID at the end for the WHERE clause
          values.push(id);

          // Add user_id to WHERE clause if provided
          let query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
          if (userId) {
            query += ' AND user_id = ?';
            values.push(userId);
          }

          // Execute the update query
          db.run(
            query,
            values,
            function(err) {
              if (err) {
                reject(err);
              } else if (this.changes === 0) {
                reject(new Error('No task was updated'));
              } else {
                // Get the updated task
                Task.getById(id)
                  .then(task => resolve(task))
                  .catch(err => reject(err));
              }
            }
          );
        })
        .catch(err => reject(err));
    });
  },

  // Delete a task
  delete: (id, userId = null) => {
    return new Promise((resolve, reject) => {
      let query = 'DELETE FROM tasks WHERE id = ?';
      const params = [id];
      
      // If userId is provided, ensure the task belongs to this user
      if (userId) {
        query += ' AND user_id = ?';
        params.push(userId);
      }
      
      db.run(query, params, function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('No task was deleted'));
        } else {
          resolve({ id, deleted: true });
        }
      });
    });
  },

  // Get task statistics for a user
  getStatistics: (userId) => {
    return new Promise((resolve, reject) => {
      const stats = {};
      
      // Get tasks by status
      db.all(`
        SELECT status, COUNT(*) as count 
        FROM tasks 
        WHERE user_id = ? 
        GROUP BY status
      `, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        stats.byStatus = rows;
        
        // Get tasks by priority
        db.all(`
          SELECT priority, COUNT(*) as count 
          FROM tasks 
          WHERE user_id = ? 
          GROUP BY priority
        `, [userId], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          stats.byPriority = rows;
          
          // Get tasks by category
          db.all(`
            SELECT category, COUNT(*) as count 
            FROM tasks 
            WHERE user_id = ? AND category != ''
            GROUP BY category
          `, [userId], (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            stats.byCategory = rows;
            
            // Get tasks completed by day (last 7 days)
            db.all(`
              SELECT date(createdAt) as date, COUNT(*) as count 
              FROM tasks 
              WHERE user_id = ? AND status = 'Completed' 
              AND createdAt >= date('now', '-7 days') 
              GROUP BY date(createdAt)
              ORDER BY date(createdAt)
            `, [userId], (err, rows) => {
              if (err) {
                reject(err);
                return;
              }
              stats.completedByDay = rows;
              
              // Get tasks created by day (last 7 days)
              db.all(`
                SELECT date(createdAt) as date, COUNT(*) as count 
                FROM tasks 
                WHERE user_id = ?
                AND createdAt >= date('now', '-7 days') 
                GROUP BY date(createdAt)
                ORDER BY date(createdAt)
              `, [userId], (err, rows) => {
                if (err) {
                  reject(err);
                  return;
                }
                stats.createdByDay = rows;
                
                // Get upcoming tasks (due in the next 7 days)
                db.all(`
                  SELECT * FROM tasks 
                  WHERE user_id = ? AND status != 'Completed'
                  AND dueDate IS NOT NULL
                  AND dueDate <= date('now', '+7 days')
                  ORDER BY dueDate
                `, [userId], (err, rows) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  
                  // Parse the checklist JSON for each task
                  stats.upcomingTasks = rows.map(task => {
                    if (task.checklist) {
                      try {
                        task.checklist = JSON.parse(task.checklist);
                      } catch (e) {
                        task.checklist = [];
                      }
                    } else {
                      task.checklist = [];
                    }
                    return task;
                  });
                  
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

module.exports = Task;