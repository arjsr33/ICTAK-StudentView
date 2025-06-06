const express = require('express');
const router = express.Router();
const Discussion = require('../model/discussion');
const studentCourseData = require('../model/studentCourseData');
const authenticateToken = require('../middleware/authenticateToken');

// GET /api/discussions/:studentId - Get Discussion Forum for Student's Course
router.get('/:studentId', authenticateToken, async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        // Get student's course information
        const student = await studentCourseData.findOne({ s_id: studentId });
        if (!student) {
            return res.status(404).json({ 
                success: false,
                message: 'Student not found' 
            });
        }

        const course = student.s_course;

        // Get discussion forum for the course
        const discussion = await Discussion.findOne({ batch: course });
        if (!discussion) {
            return res.status(404).json({ 
                success: false,
                message: 'No discussion forum found for this course' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Discussion forum retrieved successfully',
            data: discussion
        });
    } catch (error) {
        console.error('Error fetching discussion:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching discussion forum',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/discussions/:studentId/questions - Add New Question to Discussion
router.post('/:studentId/questions', authenticateToken, async (req, res) => {
    try {
        const { studentId } = req.params;
        const { question } = req.body;

        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        if (!question || question.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: 'Question is required' 
            });
        }

        // Get student's course information
        const student = await studentCourseData.findOne({ s_id: studentId });
        if (!student) {
            return res.status(404).json({ 
                success: false,
                message: 'Student not found' 
            });
        }

        const course = student.s_course;

        // Find or create discussion forum for the course
        let discussion = await Discussion.findOne({ batch: course });
        if (!discussion) {
            discussion = new Discussion({ batch: course, questions: [] });
        }

        // Add new question
        discussion.questions.push({ question: question.trim(), answers: [] });
        await discussion.save();

        res.status(201).json({
            success: true,
            message: 'Question added successfully',
            data: discussion
        });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while adding question',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/discussions/:studentId/questions/:questionId/answers - Add Answer to Question
router.post('/:studentId/questions/:questionId/answers', authenticateToken, async (req, res) => {
    try {
        const { studentId, questionId } = req.params;
        const { answer } = req.body;

        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        if (!questionId) {
            return res.status(400).json({ 
                success: false,
                message: 'Question ID is required' 
            });
        }

        if (!answer || answer.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: 'Answer is required' 
            });
        }

        // Get student's course information
        const student = await studentCourseData.findOne({ s_id: studentId });
        if (!student) {
            return res.status(404).json({ 
                success: false,
                message: 'Student not found' 
            });
        }

        const course = student.s_course;

        // Find discussion forum
        const discussion = await Discussion.findOne({ batch: course });
        if (!discussion) {
            return res.status(404).json({ 
                success: false,
                message: 'Discussion forum not found for this course' 
            });
        }

        // Find the question
        const question = discussion.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ 
                success: false,
                message: 'Question not found' 
            });
        }

        // Add answer to the question
        question.answers.push(answer.trim());
        await discussion.save();

        res.status(201).json({
            success: true,
            message: 'Answer added successfully',
            data: discussion
        });
    } catch (error) {
        console.error('Error adding answer:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while adding answer',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// PUT /api/discussions/:studentId/questions/:questionId - Edit Question
router.put('/:studentId/questions/:questionId', authenticateToken, async (req, res) => {
    try {
        const { studentId, questionId } = req.params;
        const { questionText } = req.body;

        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        if (!questionId) {
            return res.status(400).json({ 
                success: false,
                message: 'Question ID is required' 
            });
        }

        if (!questionText || questionText.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: 'Question text is required' 
            });
        }

        // Get student's course information
        const student = await studentCourseData.findOne({ s_id: studentId });
        if (!student) {
            return res.status(404).json({ 
                success: false,
                message: 'Student not found' 
            });
        }

        const course = student.s_course;

        // Find discussion forum
        const discussion = await Discussion.findOne({ batch: course });
        if (!discussion) {
            return res.status(404).json({ 
                success: false,
                message: 'Discussion forum not found for this course' 
            });
        }

        // Find and update the question
        const question = discussion.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ 
                success: false,
                message: 'Question not found' 
            });
        }

        question.question = questionText.trim();
        await discussion.save();

        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            data: discussion
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while updating question',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// DELETE /api/discussions/:studentId/questions/:questionId - Delete Question
router.delete('/:studentId/questions/:questionId', authenticateToken, async (req, res) => {
    try {
        const { studentId, questionId } = req.params;

        if (!studentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Student ID is required' 
            });
        }

        if (!questionId) {
            return res.status(400).json({ 
                success: false,
                message: 'Question ID is required' 
            });
        }

        // Get student's course information
        const student = await studentCourseData.findOne({ s_id: studentId });
        if (!student) {
            return res.status(404).json({ 
                success: false,
                message: 'Student not found' 
            });
        }

        const course = student.s_course;

        // Find discussion forum
        const discussion = await Discussion.findOne({ batch: course });
        if (!discussion) {
            return res.status(404).json({ 
                success: false,
                message: 'Discussion forum not found for this course' 
            });
        }

        // Check if question exists
        const question = discussion.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ 
                success: false,
                message: 'Question not found' 
            });
        }

        // Remove the question
        discussion.questions.pull({ _id: questionId });
        await discussion.save();

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully',
            data: discussion
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while deleting question',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;