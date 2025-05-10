const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Protected routes (require authentication)
router.get('/statistics', authenticateToken, UserController.getUserStatistics);
router.get('/task-statistics', authenticateToken, UserController.getTaskStatistics);

// Admin routes
router.get('/', authenticateToken, isAdmin, UserController.getAllUsers);
router.get('/:id', authenticateToken, isAdmin, UserController.getUserById);
router.delete('/:id', authenticateToken, isAdmin, UserController.deleteUser);

module.exports = router;