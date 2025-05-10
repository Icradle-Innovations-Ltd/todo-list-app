const { db } = require('../utils/db');

// Task model for SQLite interactions
const Task = {
  // Get all tasks
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
  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
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

      db.run(
        `INSERT INTO tasks (
          title, description, dueDate, priority, category, recurring, checklist, notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
  update: (id, taskData) => {
    return new Promise((resolve, reject) => {
      // First check if the task exists
      Task.getById(id)
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
            if (key !== 'id' && taskData[key] !== undefined) {
              updates.push(`${key} = ?`);
              values.push(taskData[key]);
            }
          });

          // Add the ID at the end for the WHERE clause
          values.push(id);

          // Execute the update query
          db.run(
            `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
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
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('No task was deleted'));
        } else {
          resolve({ id, deleted: true });
        }
      });
    });
  }
};

module.exports = Task;