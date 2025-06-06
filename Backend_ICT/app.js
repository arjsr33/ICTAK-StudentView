const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Database connection
require('./db/dbConnect');

// Middleware
app.use(morgan('dev'));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://ictportal.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import route modules with descriptive names
const authRoutes = require('./routes/authRoutes');               // Authentication (login, register)
const studentRoutes = require('./routes/studentRoutes');         // Student management
const projectRoutes = require('./routes/projectRoutes');         // Project management
const submissionRoutes = require('./routes/submissionRoutes');   // Assignment submissions
const discussionRoutes = require('./routes/discussionRoutes');   // Discussion forums

// API Routes with clear naming
app.use('/api/auth', authRoutes);                // Authentication endpoints
app.use('/api/students', studentRoutes);         // Student-related endpoints
app.use('/api/projects', projectRoutes);         // Project-related endpoints
app.use('/api/submissions', submissionRoutes);   // Submission-related endpoints
app.use('/api/discussions', discussionRoutes);   // Discussion forum endpoints

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'https://ictportal.vercel.app'}`);
});

module.exports = app;