const express = require('express');
const multer = require('multer');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

const weeklySubmissionData = require('../model/weeklySubmissionData');
const projectSubmissionData = require('../model/projectSubmissionData');

// Configure multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Add file type validation if needed
        cb(null, true);
    }
});

// POST /api/submissions/weekly/:studentId - Submit Weekly Assignment
router.post('/weekly/:studentId', authenticateToken, upload.single('files'), async (req, res) => {
    try {
        const { studentId } = req.params;
        const { selectedWeek, links, comments } = req.body;

        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        if (!selectedWeek) {
            return res.status(400).json({ 
                success: false,
                message: 'Week selection is required' 
            });
        }

        const weeklySubmission = {
            s_id: studentId,
            week: selectedWeek,
            links: links || '',
            files: req.file ? req.file.originalname : '',
            comments: comments || '',
            mentormarks: "Yet to be graded",
            mentorcomments: "Yet to be graded",
        };

        const updatedSubmission = await weeklySubmissionData.findOneAndUpdate(
            { s_id: studentId, week: selectedWeek },
            { $set: weeklySubmission },
            { new: true, upsert: true }
        );

        res.status(201).json({ 
            success: true,
            message: 'Weekly submission uploaded successfully!',
            data: updatedSubmission
        });
    } catch (error) {
        console.error('Error uploading weekly submission:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while uploading weekly submission',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/submissions/project/:studentId - Submit Final Project
router.post('/project/:studentId', authenticateToken, upload.single('files'), async (req, res) => {
    try {
        const { studentId } = req.params;
        const { links, comments } = req.body;

        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        const projectSubmission = {
            s_id: studentId,
            links: links || '',
            files: req.file ? req.file.originalname : '',
            comments: comments || '',
        };

        const updatedSubmission = await projectSubmissionData.findOneAndUpdate(
            { s_id: studentId },
            { $set: projectSubmission },
            { new: true, upsert: true }
        );

        res.status(201).json({ 
            success: true,
            message: 'Project submission uploaded successfully!',
            data: updatedSubmission
        });
    } catch (error) {
        console.error('Error uploading project submission:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while uploading project submission',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/submissions/weekly/:studentId - Get Student's Weekly Submissions
router.get('/weekly/:studentId', authenticateToken, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        const submissions = await weeklySubmissionData.find({ s_id: studentId });
        
        res.status(200).json({
            success: true,
            message: 'Weekly submissions retrieved successfully',
            data: submissions
        });
    } catch (error) {
        console.error('Error fetching weekly submissions:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching weekly submissions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/submissions/project/:studentId - Get Student's Project Submission
router.get('/project/:studentId', authenticateToken, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        const submission = await projectSubmissionData.findOne({ s_id: studentId });
        
        if (!submission) {
            return res.status(404).json({ 
                success: false,
                message: 'Project submission not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project submission retrieved successfully',
            data: submission
        });
    } catch (error) {
        console.error('Error fetching project submission:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching project submission',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;