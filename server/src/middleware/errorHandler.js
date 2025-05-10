// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Check if the error is related to a task not found
  if (err.message === 'Task not found') {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  // Check if the error is related to no task being updated or deleted
  if (err.message === 'No task was updated' || err.message === 'No task was deleted') {
    return res.status(404).json({ error: err.message });
  }
  
  // Handle SQLite constraint errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({ error: 'Database constraint error' });
  }
  
  // Default to 500 server error for all other errors
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;