const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Express app
const app = express();

// Database connection
require('./db/dbConnect');

// Middleware
app.use(morgan('dev'));

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
            auth: {
                login: 'POST /api/auth/login',
                register: 'POST /api/auth/register',
                verify: 'GET /api/auth/verify-token'
            },
            students: {
                course: 'GET /api/students/course/:studentId',
                projects: 'GET /api/students/projects/:studentId',
                selectProject: 'POST /api/students/select-project'
            },
            projects: {
                available: 'GET /api/projects/available/:course',
                details: 'GET /api/projects/details/:projectId',
                references: 'GET /api/projects/references/:projectId'
            },
            submissions: {
                weekly: 'POST /api/submissions/weekly/:studentId',
                project: 'POST /api/submissions/project/:studentId'
            },
            discussions: {
                get: 'GET /api/discussions/:studentId',
                addQuestion: 'POST /api/discussions/:studentId/questions',
                addAnswer: 'POST /api/discussions/:studentId/questions/:questionId/answers'
            }
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
    console.error('='.repeat(50));
    console.error('❌ Global Error Handler Triggered');
    console.error('='.repeat(50));
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    console.error('Request Headers:', req.headers);
    console.error('='.repeat(50));
    
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
const server = app.listen(PORT, () => {
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
    
    // Test database connection status
    setTimeout(() => {
        if (mongoose.connection.readyState === 1) {
            console.log('✅ DATABASE: Connected Successfully');
            console.log(`📊 Database Name: ${mongoose.connection.name}`);
            console.log(`🏠 Database Host: ${mongoose.connection.host}`);
        } else {
            console.log('❌ DATABASE: Connection Failed or Pending');
            console.log(`🔄 Connection State: ${mongoose.connection.readyState}`);
        }
        console.log('='.repeat(60));
        console.log('🎯 SERVER READY TO HANDLE REQUESTS!');
        console.log('='.repeat(60));
    }, 2000); // Give database time to connect
});

// Enhanced error handling for production
process.on('unhandledRejection', (err, promise) => {
    console.error('='.repeat(50));
    console.error('❌ UNHANDLED PROMISE REJECTION');
    console.error('='.repeat(50));
    console.error('Error:', err.message);
    console.error('Promise:', promise);
    console.error('Stack:', err.stack);
    console.error('='.repeat(50));
    
    // Close server & exit process in development
    if (process.env.NODE_ENV !== 'production') {
        server.close(() => {
            console.log('💀 Server closed due to unhandled promise rejection');
            process.exit(1);
        });
    }
});

process.on('uncaughtException', (err) => {
    console.error('='.repeat(50));
    console.error('❌ UNCAUGHT EXCEPTION');
    console.error('='.repeat(50));
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('='.repeat(50));
    
    // Always exit on uncaught exception
    console.log('💀 Shutting down due to uncaught exception');
    process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
    console.log('='.repeat(50));
    console.log('👋 SIGTERM RECEIVED - Graceful Shutdown');
    console.log('='.repeat(50));
    
    server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close(() => {
            console.log('✅ Database connection closed');
            console.log('👋 Process terminated gracefully');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('='.repeat(50));
    console.log('👋 SIGINT RECEIVED - Graceful Shutdown');
    console.log('='.repeat(50));
    
    server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close(() => {
            console.log('✅ Database connection closed');
            console.log('👋 Process terminated gracefully');
            process.exit(0);
        });
    });
});

// Export the app for testing purposes
module.exports = app;