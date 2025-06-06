const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Express app
const app = express();

// Database connection with error handling
const connectDB = require('./db/dbConnect');

// Middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Enhanced CORS configuration
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'https://ictportal.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import route modules with error handling
let authRoutes, studentRoutes, projectRoutes, submissionRoutes, discussionRoutes;

try {
    authRoutes = require('./routes/authRoutes');
    studentRoutes = require('./routes/studentRoutes');
    projectRoutes = require('./routes/projectRoutes');
    submissionRoutes = require('./routes/submissionRoutes');
    discussionRoutes = require('./routes/discussionRoutes');
    console.log('✅ All route modules loaded successfully');
} catch (error) {
    console.error('❌ Error loading route modules:', error.message);
    console.error('Stack:', error.stack);
}

// API Routes with error handling
if (authRoutes) app.use('/api/auth', authRoutes);
if (studentRoutes) app.use('/api/students', studentRoutes);
if (projectRoutes) app.use('/api/projects', projectRoutes);
if (submissionRoutes) app.use('/api/submissions', submissionRoutes);
if (discussionRoutes) app.use('/api/discussions', discussionRoutes);

// Enhanced health check endpoint
app.get('/api/health', (req, res) => {
    const healthData = {
        success: true,
        message: 'ICTAK Backend Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        server: {
            status: 'online',
            port: process.env.PORT || 5000,
            uptime: Math.floor(process.uptime()),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
            },
            nodeVersion: process.version,
            platform: process.platform
        },
        database: {
            status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            name: mongoose.connection.name || 'unknown',
            host: mongoose.connection.host || 'unknown',
            readyState: {
                0: 'disconnected',
                1: 'connected',
                2: 'connecting',
                3: 'disconnecting'
            }[mongoose.connection.readyState]
        },
        configuration: {
            frontendUrl: process.env.FRONTEND_URL || 'https://ictportal.vercel.app',
            jwtConfigured: !!process.env.JWT_SECRET,
            mongoConfigured: !!process.env.MONGODB_URL,
            corsOrigins: [
                process.env.FRONTEND_URL || 'https://ictportal.vercel.app',
                'http://localhost:3000',
                'http://localhost:5173'
            ]
        },
        routes: {
            auth: authRoutes ? 'loaded' : 'failed',
            students: studentRoutes ? 'loaded' : 'failed',
            projects: projectRoutes ? 'loaded' : 'failed',
            submissions: submissionRoutes ? 'loaded' : 'failed',
            discussions: discussionRoutes ? 'loaded' : 'failed'
        }
    };

    res.status(200).json(healthData);
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to ICTAK Backend API',
        version: '1.0.0',
        documentation: {
            health: '/api/health',
            endpoints: {
                auth: '/api/auth',
                students: '/api/students',
                projects: '/api/projects',
                submissions: '/api/submissions',
                discussions: '/api/discussions'
            }
        },
        timestamp: new Date().toISOString()
    });
});

// API documentation endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ICTAK API Documentation',
        version: '1.0.0',
        baseUrl: req.protocol + '://' + req.get('host'),
        endpoints: {
            authentication: {
                login: {
                    method: 'POST',
                    path: '/api/auth/login',
                    description: 'Login with email and password',
                    body: { email: 'string', password: 'string' }
                },
                register: {
                    method: 'POST',
                    path: '/api/auth/register',
                    description: 'Register new student',
                    body: { name: 'string', email: 'string', password: 'string', phone: 'string', batch: 'string' }
                }
            },
            students: {
                getCourse: {
                    method: 'GET',
                    path: '/api/students/course/:studentId',
                    description: 'Get student course information'
                },
                getProjects: {
                    method: 'GET',
                    path: '/api/students/projects/:studentId',
                    description: 'Get student project assignments'
                }
            },
            projects: {
                getAvailable: {
                    method: 'GET',
                    path: '/api/projects/available/:course',
                    description: 'Get available projects for course'
                },
                getDetails: {
                    method: 'GET',
                    path: '/api/projects/details/:projectId',
                    description: 'Get detailed project information'
                }
            }
        }
    });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        availableRoutes: {
            health: 'GET /api/health',
            documentation: 'GET /api',
            auth: 'POST /api/auth/login, POST /api/auth/register',
            students: 'GET /api/students/course/:id, GET /api/students/projects/:id',
            projects: 'GET /api/projects/available/:course, GET /api/projects/details/:id'
        }
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Global Error Handler Triggered');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    
    // Determine error status
    const status = error.status || error.statusCode || 500;
    
    res.status(status).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? {
            stack: error.stack,
            details: error
        } : undefined,
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'unknown'
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 ICTAK BACKEND SERVER STARTED');
    console.log('='.repeat(60));
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🔗 Server URL: ${process.env.NODE_ENV === 'production' ? 'https://arjun-ictak.vercel.app' : `http://localhost:${PORT}`}`);
    console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || 'https://ictportal.vercel.app'}`);
    console.log('='.repeat(60));
    console.log('📊 CONFIGURATION STATUS:');
    console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Configured ✅' : 'Missing ❌'}`);
    console.log(`🗃️  MongoDB URL: ${process.env.MONGODB_URL ? 'Configured ✅' : 'Missing ❌'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL ? 'Configured ✅' : 'Using Default'}`);
    console.log('='.repeat(60));
    console.log('📋 AVAILABLE ENDPOINTS:');
    console.log(`🏥 Health Check: /api/health`);
    console.log(`📖 Documentation: /api`);
    console.log(`🔐 Authentication: /api/auth`);
    console.log(`👨‍🎓 Students: /api/students`);
    console.log(`📚 Projects: /api/projects`);
    console.log(`📤 Submissions: /api/submissions`);
    console.log(`💬 Discussions: /api/discussions`);
    console.log('='.repeat(60));
    
    // Check database connection status after a delay
    setTimeout(() => {
        if (mongoose.connection.readyState === 1) {
            console.log('✅ DATABASE: Connected Successfully');
            console.log(`📊 Database Name: ${mongoose.connection.name}`);
            console.log(`🏠 Database Host: ${mongoose.connection.host}`);
        } else {
            console.log('⚠️  DATABASE: Connection Pending or Failed');
            console.log(`🔄 Connection State: ${mongoose.connection.readyState}`);
            console.log('💡 Server will still work, but database operations will fail');
        }
        console.log('='.repeat(60));
        console.log('🎯 SERVER READY TO HANDLE REQUESTS!');
        console.log('='.repeat(60));
    }, 3000); // Give database more time to connect
});

// Enhanced error handling for production
process.on('unhandledRejection', (err, promise) => {
    console.error('❌ UNHANDLED PROMISE REJECTION');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    // Don't exit in production (Vercel functions)
    if (process.env.NODE_ENV !== 'production') {
        console.log('💀 Shutting down due to unhandled promise rejection');
        process.exit(1);
    }
});

process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    // Always exit on uncaught exception
    console.log('💀 Shutting down due to uncaught exception');
    process.exit(1);
});

// Export the app for Vercel
module.exports = app;