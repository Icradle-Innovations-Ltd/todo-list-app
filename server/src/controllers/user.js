const User = require('../models/user');
const Task = require('../models/task');

// Controller for user-related operations
const UserController = {
  // Get all users (admin function)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get a user by ID
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.getById(userId);
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(500).json({ error: error.message });
    }
  },
  
  // Delete a user
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      await User.delete(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error.message === 'No user was deleted') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get user statistics and dashboard data
  getUserStatistics: async (req, res) => {
    try {
      const userId = req.userId; // Set by the authenticateToken middleware
      const stats = await User.getStatistics(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get task statistics for a user
  getTaskStatistics: async (req, res) => {
    try {
      const userId = req.userId; // Set by the authenticateToken middleware
      const stats = await Task.getStatistics(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = UserController;