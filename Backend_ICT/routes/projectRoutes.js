const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

const availableProjectData = require('../model/availableProjectData');
const projectData = require('../model/projectData');
const referenceData = require('../model/referenceData');

// GET /api/projects/available/:course - Get Available Projects for Course
router.get('/available/:course', authenticateToken, async (req, res) => {
    try {
        const { course } = req.params;
        
        if (!course) {
            return res.status(400).json({ 
                success: false,
                message: 'Course is required' 
            });
        }

        const projects = await availableProjectData.find({ course: course });
        
        res.status(200).json({
            success: true,
            message: 'Available projects retrieved successfully',
            data: projects
        });
    } catch (error) {
        console.error('Error fetching available projects:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching available projects',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/projects/details/:projectId - Get Detailed Project Information
router.get('/details/:projectId', authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        
        if (!projectId) {
            return res.status(400).json({ 
                success: false,
                message: 'Project ID is required' 
            });
        }

        const project = await projectData.find({ id: projectId });
        
        if (!project || project.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Project not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project details retrieved successfully',
            data: project
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching project details',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/projects/references/:projectId - Get Project Reference Materials
router.get('/references/:projectId', authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        
        if (!projectId) {
            return res.status(400).json({ 
                success: false,
                message: 'Project ID is required' 
            });
        }

        const references = await referenceData.findOne({ p_id: projectId });
        
        if (!references) {
            return res.status(404).json({ 
                success: false,
                message: 'Project references not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project references retrieved successfully',
            data: references
        });
    } catch (error) {
        console.error('Error fetching project references:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching project references',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;