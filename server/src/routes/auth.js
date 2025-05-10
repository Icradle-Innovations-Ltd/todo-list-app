const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.post('/change-password', authenticateToken, AuthController.changePassword);

module.exports = router;