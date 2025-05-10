const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Get JWT secret from environment variables or use a default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Add the user ID to the request object
    req.userId = user.id;
    next();
  });
};

// Generate a JWT token for a user
const generateToken = (user) => {
  // Create a payload with user ID and username (avoid including sensitive data)
  const payload = {
    id: user.id,
    username: user.username
  };
  
  // Sign the token with the secret key and set expiration
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    // Get the user from the database
    const user = await User.getById(req.userId);
    
    // Check if the user is an admin (you might want to add an isAdmin field to your users table)
    if (user.username === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied: Admin privileges required' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  authenticateToken,
  generateToken,
  isAdmin
};