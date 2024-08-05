const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const path = require('path');
const referenceData = require('../model/referenceData');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/projects/:projectId', authenticateToken, async (req, res) => {
    try {
        console.log(`req.params.projectId is ${req.params.projectId}`);
        const project = await referenceData.findOne({ p_id: req.params.projectId });
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
