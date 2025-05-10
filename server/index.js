require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const taskRoutes = require('./src/routes/tasks');
const errorHandler = require('./src/middleware/errorHandler');
const { initializeDatabase } = require('./src/utils/db');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});