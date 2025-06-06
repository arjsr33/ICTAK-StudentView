const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

const studentCourseData = require('../model/studentCourseData');
const studentsWithProjectData = require('../model/studentsWithProjectData');

// GET /api/students/course/:studentId - Get Student Course Information
router.get('/course/:studentId', authenticateToken, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        const studentCourse = await studentCourseData.findOne({ s_id: studentId });
        
        if (!studentCourse) {
            return res.status(404).json({ 
                success: false,
                message: 'Student course information not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student course information retrieved successfully',
            data: studentCourse
        });
    } catch (error) {
        console.error('Error fetching student course:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching student course information',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/students/projects/:studentId - Get Student's Project Assignments
router.get('/projects/:studentId', authenticateToken, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        const studentProjects = await studentsWithProjectData.find({ sp_id: studentId });
        
        res.status(200).json({
            success: true,
            message: 'Student projects retrieved successfully',
            data: studentProjects
        });
    } catch (error) {
        console.error('Error fetching student projects:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching student projects',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/students/select-project - Assign Project to Student
router.post('/select-project', authenticateToken, async (req, res) => {
    try {
        const { sp_id, sp_name, p_id, p_name, start_date } = req.body;

        // Basic validation
        if (!sp_id || !sp_name || !p_id || !p_name) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID, name, project ID, and project name are required' 
            });
        }

        // Check if student exists and get their course info
        const studentCourse = await studentCourseData.findOne({ s_id: sp_id });
        if (!studentCourse) {
            return res.status(404).json({ 
                success: false,
                message: 'Student not found in course database' 
            });
        }

        // Check exit score eligibility
        if (studentCourse.s_exitscore <= 50) {
            return res.status(400).json({ 
                success: false,
                message: "Cannot select project: Exit score must be above 50" 
            });
        }

        // Check if student already has a project
        const existingProject = await studentsWithProjectData.findOne({ sp_id });
        if (existingProject) {
            return res.status(409).json({ 
                success: false,
                message: 'Student already has a project assigned',
                data: existingProject
            });
        }

        // Create new project assignment
        const projectAssignment = {
            sp_id,
            sp_name,
            p_id,
            p_name,
            start_date: start_date ? new Date(start_date) : new Date()
        };

        const newAssignment = await studentsWithProjectData.create(projectAssignment);

        res.status(201).json({ 
            success: true,
            message: 'Project assigned to student successfully!', 
            data: newAssignment 
        });
    } catch (error) {
        console.error('Error assigning project:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while assigning project',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// PUT /api/students/update-project/:studentId - Update Student's Project Assignment
router.put('/update-project/:studentId', authenticateToken, async (req, res) => {
    try {
        const { studentId } = req.params;
        const { p_id, p_name } = req.body;

        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        if (!p_id) {
            return res.status(400).json({ 
                success: false,
                message: 'Project ID is required' 
            });
        }

        const updateData = { p_id };
        if (p_name) updateData.p_name = p_name;

        const updatedProject = await studentsWithProjectData.findOneAndUpdate(
            { sp_id: studentId },
            { $set: updateData },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ 
                success: false,
                message: 'Student project assignment not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Student project updated successfully!', 
            data: updatedProject 
        });
    } catch (error) {
        console.error('Error updating student project:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while updating student project',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;