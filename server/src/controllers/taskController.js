const Task = require('../models/task');
const { STATUSES, PRIORITIES, RECURRING_OPTIONS } = require('../constants');

// Task controller with business logic for routes
const taskController = {
  // Get all tasks for the authenticated user
  getAllTasks: async (req, res, next) => {
    try {
      const userId = req.userId; // Set by the authenticateToken middleware
      const tasks = await Task.getAllByUser(userId);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  },

  // Get all tasks (admin function)
  getAllTasksAdmin: async (req, res, next) => {
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
      const userId = req.userId; // Set by the authenticateToken middleware
      const task = await Task.getById(taskId, userId);
      res.json(task);
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: 'Task not found' });
      }
      next(error);
    }
  },

  // Create a new task
  createTask: async (req, res, next) => {
    try {
      const userId = req.userId; // Set by the authenticateToken middleware
      const taskData = {
        ...req.body,
        user_id: userId // Add the user ID to the task data
      };
      
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
      const userId = req.userId; // Set by the authenticateToken middleware
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

      // Update the task (ensuring it belongs to the authenticated user)
      const updatedTask = await Task.update(taskId, taskData, userId);
      res.json(updatedTask);
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: 'Task not found' });
      }
      next(error);
    }
  },

  // Delete a task
  deleteTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const userId = req.userId; // Set by the authenticateToken middleware
      const result = await Task.delete(taskId, userId);
      res.json(result);
    } catch (error) {
      if (error.message === 'No task was deleted') {
        return res.status(404).json({ error: 'Task not found' });
      }
      next(error);
    }
  },

  // Toggle task status (Pending <-> Completed)
  toggleTaskStatus: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const userId = req.userId; // Set by the authenticateToken middleware
      
      // Get the current task (ensuring it belongs to the authenticated user)
      const task = await Task.getById(taskId, userId);
      
      // Toggle the status
      const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
      
      // Update the task with the new status
      const updatedTask = await Task.update(taskId, { status: newStatus }, userId);
      res.json(updatedTask);
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: 'Task not found' });
      }
      next(error);
    }
  }
};

module.exports = taskController;