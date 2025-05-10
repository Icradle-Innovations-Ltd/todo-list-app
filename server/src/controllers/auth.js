const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

// Controller for authentication-related operations
const AuthController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;
      
      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }
      
      // Check if username already exists
      const existingUsername = await User.getByUsername(username).catch(() => null);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      
      // Check if email already exists
      const existingEmail = await User.getByEmail(email).catch(() => null);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      // Create the new user
      const newUser = await User.create({
        username,
        email,
        password,
        firstName,
        lastName
      });
      
      // Generate a token for the new user
      const token = generateToken(newUser);
      
      // Update last login time
      await User.updateLastLogin(newUser.id);
      
      // Return the user data and token
      res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Login a user
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate required fields
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      
      // Get the user by username
      const user = await User.getByUsername(username);
      
      // Verify the password
      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate a token
      const token = generateToken(user);
      
      // Update last login time
      await User.updateLastLogin(user.id);
      
      // Return user data (excluding password) and token
      const { password: _, ...userData } = user;
      res.json({
        message: 'Login successful',
        user: userData,
        token
      });
    } catch (error) {
      // Handle "User not found" specifically
      if (error.message === 'User not found') {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get the current user's profile
  getProfile: async (req, res) => {
    try {
      const userId = req.userId; // Set by the authenticateToken middleware
      const user = await User.getById(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Update the current user's profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.userId; // Set by the authenticateToken middleware
      const { firstName, lastName, email, theme } = req.body;
      
      // Update the user
      const updatedUser = await User.update(userId, {
        firstName,
        lastName,
        email,
        theme
      });
      
      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Change the current user's password
  changePassword: async (req, res) => {
    try {
      const userId = req.userId; // Set by the authenticateToken middleware
      const { currentPassword, newPassword } = req.body;
      
      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }
      
      // Get the user
      const user = await User.getById(userId);
      
      // Verify the current password
      const isPasswordValid = await User.verifyPassword(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      
      // Update the password
      await User.update(userId, { password: newPassword });
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = AuthController;