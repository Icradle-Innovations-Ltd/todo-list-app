const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Protected routes (require authentication)
// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', authenticateToken, taskController.getAllTasks);

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', authenticateToken, taskController.getTaskById);

// POST /api/tasks - Create a new task
router.post('/', authenticateToken, taskController.createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', authenticateToken, taskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', authenticateToken, taskController.deleteTask);

// PATCH /api/tasks/:id/toggle - Toggle task status
router.patch('/:id/toggle', authenticateToken, taskController.toggleTaskStatus);

// Admin routes
// GET /api/tasks/admin/all - Get all tasks (admin only)
router.get('/admin/all', authenticateToken, isAdmin, taskController.getAllTasksAdmin);

module.exports = router;