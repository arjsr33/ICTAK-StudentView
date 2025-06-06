const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

const Signup = require('../model/Signup');
const studentCourseData = require('../model/studentCourseData');

// JWT secret and bcrypt config
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;

// Helper functions
const generateRandomExitScore = () => Math.floor(Math.random() * 100);
const calculateGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'E';
};

// POST /api/auth/register - Student Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, batch } = req.body;

        // Basic validation
        if (!name || !email || !password || !phone || !batch) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide a valid email address' 
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Check if user already exists
        const existingUser = await Signup.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: 'Student with this email already exists' 
            });
        }

        console.log('🔐 Hashing password for registration...');
        
        // Hash password with detailed logging
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        console.log('✅ Password hashed successfully');
        console.log('Original password length:', password.length);
        console.log('Hashed password length:', hashedPassword.length);
        console.log('Hash starts with:', hashedPassword.substring(0, 10) + '...');

        // Create new student
        const newStudent = await Signup.create({ 
            name, 
            email: email.toLowerCase(), // Store email in lowercase
            password: hashedPassword, 
            phone, 
            batch 
        });

        // Create student course data with default values
        const exitScore = generateRandomExitScore();
        const newStudentCourseData = await studentCourseData.create({
            s_id: email.toLowerCase(),
            s_name: name,
            s_course: batch,
            s_startdate: '15th March 2024',
            s_mentor: 'Mridula',
            s_grade: calculateGrade(exitScore),
            s_exitscore: exitScore
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                email: newStudent.email, 
                name: newStudent.name, 
                id: newStudent._id 
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...studentResponse } = newStudent.toObject();

        console.log('✅ Student registered successfully:', email.toLowerCase());

        res.status(201).json({ 
            success: true,
            message: 'Student registered successfully!', 
            data: {
                student: studentResponse,
                courseData: newStudentCourseData
            },
            token 
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/auth/login - Student Login
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        console.log('🔐 Login attempt for:', email);

        // Basic validation
        if (!email || !password) {
            console.log('❌ Missing email or password');
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }

        // Normalize email
        email = email.toLowerCase().trim();
        
        console.log('🔍 Looking for user with email:', email);

        // Find user - with detailed logging
        const user = await Signup.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found in database');
            // Check if there are any users in the database for debugging
            const userCount = await Signup.countDocuments();
            console.log('📊 Total users in database:', userCount);
            
            if (userCount > 0) {
                // Show first few characters of existing emails for debugging
                const existingUsers = await Signup.find({}, { email: 1 }).limit(5);
                console.log('📧 Existing emails in database:', 
                    existingUsers.map(u => u.email.substring(0, 5) + '...'));
            }
            
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        console.log('✅ User found in database');
        console.log('📧 Stored email:', user.email);
        console.log('🔒 Password hash in DB starts with:', user.password.substring(0, 10) + '...');
        console.log('🔑 Provided password length:', password.length);

        // Compare password with detailed logging
        console.log('🔐 Comparing passwords...');
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        console.log('🔍 Password comparison result:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('❌ Password comparison failed');
            
            // Additional debugging - check if password might be stored as plaintext
            const isPlaintextMatch = password === user.password;
            console.log('🔍 Plaintext comparison (should be false):', isPlaintextMatch);
            
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        console.log('✅ Password validation successful');

        // Generate JWT token
        const token = jwt.sign(
            { 
                email: user.email, 
                name: user.name, 
                id: user._id 
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userResponse } = user.toObject();

        console.log('✅ Login successful for:', user.email);

        res.status(200).json({ 
            success: true,
            message: "Login successful", 
            data: {
                user: userResponse
            },
            token 
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false,
            message: "Server error during login",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/auth/verify-token - Verify JWT Token
router.get('/verify-token', authenticateToken, async (req, res) => {
    try {
        const user = await Signup.findOne({ email: req.user.email }).select('-password');
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Token is valid',
            data: {
                user: user
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during token verification',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/auth/debug-login - Debug endpoint (remove in production)
router.post('/debug-login', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email required for debugging' });
        }

        const user = await Signup.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Debug info',
            data: {
                email: user.email,
                name: user.name,
                hasPassword: !!user.password,
                passwordLength: user.password ? user.password.length : 0,
                passwordStart: user.password ? user.password.substring(0, 10) + '...' : null,
                isBcryptHash: user.password ? user.password.startsWith('$2') : false
            }
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ message: 'Debug error', error: error.message });
    }
});

module.exports = router;