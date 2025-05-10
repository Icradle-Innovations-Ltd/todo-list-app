// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Check if the error is related to a task not found
  if (err.message === 'Task not found') {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  // Check if the error is related to a user not found
  if (err.message === 'User not found') {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Check if the error is related to no task being updated or deleted
  if (err.message === 'No task was updated' || err.message === 'No task was deleted') {
    return res.status(404).json({ error: err.message });
  }
  
  // Check if the error is related to no user being updated or deleted
  if (err.message === 'No user was updated' || err.message === 'No user was deleted') {
    return res.status(404).json({ error: err.message });
  }
  
  // Handle authentication errors
  if (err.message === 'Invalid credentials') {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  if (err.message === 'Authentication token is required') {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (err.message === 'Invalid or expired token') {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  // Handle SQLite constraint errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    // Check for unique constraint violations
    if (err.message.includes('UNIQUE constraint failed: users.username')) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (err.message.includes('UNIQUE constraint failed: users.email')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    return res.status(400).json({ error: 'Database constraint error' });
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(403).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(403).json({ error: 'Token expired' });
  }
  
  // Default to 500 server error for all other errors
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;