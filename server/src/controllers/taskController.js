const Task = require('../models/task');
const { STATUSES, PRIORITIES, RECURRING_OPTIONS } = require('../constants');

// Task controller with business logic for routes
const taskController = {
  // Get all tasks
  getAllTasks: async (req, res, next) => {
    try {
      const tasks = await Task.getAll();
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  },

  // Get a single task by ID
  getTaskById: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const task = await Task.getById(taskId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  // Create a new task
  createTask: async (req, res, next) => {
    try {
      const taskData = req.body;
      
      // Validate required fields
      if (!taskData.title || taskData.title.trim() === '') {
        return res.status(400).json({ error: 'Task title is required' });
      }

      // Validate priority if provided
      if (taskData.priority && !PRIORITIES.includes(taskData.priority)) {
        return res.status(400).json({ 
          error: `Priority must be one of: ${PRIORITIES.join(', ')}` 
        });
      }

      // Validate recurring option if provided
      if (taskData.recurring && !RECURRING_OPTIONS.includes(taskData.recurring)) {
        return res.status(400).json({ 
          error: `Recurring option must be one of: ${RECURRING_OPTIONS.join(', ')}` 
        });
      }

      // Validate status if provided
      if (taskData.status && !STATUSES.includes(taskData.status)) {
        return res.status(400).json({ 
          error: `Status must be one of: ${STATUSES.join(', ')}` 
        });
      }

      // Create the task
      const newTask = await Task.create(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  },

  // Update a task
  updateTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const taskData = req.body;

      // Validate priority if provided
      if (taskData.priority && !PRIORITIES.includes(taskData.priority)) {
        return res.status(400).json({ 
          error: `Priority must be one of: ${PRIORITIES.join(', ')}` 
        });
      }

      // Validate recurring option if provided
      if (taskData.recurring && !RECURRING_OPTIONS.includes(taskData.recurring)) {
        return res.status(400).json({ 
          error: `Recurring option must be one of: ${RECURRING_OPTIONS.join(', ')}` 
        });
      }

      // Validate status if provided
      if (taskData.status && !STATUSES.includes(taskData.status)) {
        return res.status(400).json({ 
          error: `Status must be one of: ${STATUSES.join(', ')}` 
        });
      }

      // Update the task
      const updatedTask = await Task.update(taskId, taskData);
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  },

  // Delete a task
  deleteTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const result = await Task.delete(taskId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // Toggle task status (Pending <-> Completed)
  toggleTaskStatus: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      
      // Get the current task
      const task = await Task.getById(taskId);
      
      // Toggle the status
      const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
      
      // Update the task with the new status
      const updatedTask = await Task.update(taskId, { status: newStatus });
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = taskController;