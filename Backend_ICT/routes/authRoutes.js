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

        // Check if user already exists
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: 'Student with this email already exists' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new student
        const newStudent = await Signup.create({ 
            name, 
            email, 
            password: hashedPassword, 
            phone, 
            batch 
        });

        // Create student course data with default values
        const exitScore = generateRandomExitScore();
        const newStudentCourseData = await studentCourseData.create({
            s_id: email,
            s_name: name,
            s_course: batch,
            s_startdate: '15th March 2024',
            s_mentor: 'Mridula',
            s_grade: calculateGrade(exitScore),
            s_exitscore: exitScore
        });

        // Generate JWT token
        const token = jwt.sign(
            { email: newStudent.email, name: newStudent.name, id: newStudent._id }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...studentResponse } = newStudent.toObject();

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
        console.error('Registration error:', error);
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
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }

        // Find user
        const user = await Signup.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email, name: user.name, id: user._id }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userResponse } = user.toObject();

        res.status(200).json({ 
            success: true,
            message: "Login successful", 
            data: {
                user: userResponse
            },
            token 
        });
    } catch (error) {
        console.error('Login error:', error);
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

module.exports = router;