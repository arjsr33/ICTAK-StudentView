const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const availableProjectData = require('../model/availableProjectData');
const studentCourseData = require('../model/studentCourseData');
const studentsWithProjectData = require('../model/studentsWithProjectData');
const weeklySubmissionData = require('../model/weeklySubmissionData');
const projectSubmissionData = require('../model/projectSubmissionData');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage(); // Use memory storage to avoid writing to disk
const upload = multer({ storage: storage });

router.get('/studentCourse/:student', async (req, res) => {
    try {
        const student = req.params.student;
        console.log('The student id is - ', student);
        const data = await studentCourseData.find({ s_id: student });
        res.status(200).send(data[0]);
        console.log(data[0]);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get('/availableProjects/:course', async (req, res) => {
    try {
        const { course } = req.params;
        console.log(`Course is ${course}`);
        const data = await availableProjectData.find({ course: course });
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get('/studentswithprojects/:student', async (req, res) => {
    try {
        const { student } = req.params;
        console.log(`Student is ${student}`);
        const data = await studentsWithProjectData.find({ sp_id: student });
        res.status(200).send(data);
        console.log(data);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.post('/uploadWeek/:student', upload.single('files'), async (req, res, next) => {
    const student = req.params.student;
    try {
        console.log(req.body);
        const weekItem = {
            s_id: student,
            week: req.body.selectedWeek,
            links: req.body.links,
            files: req.file.buffer.toString('base64'), // Store file as base64 string
            comments: req.body.comments,
            mentormarks: "Yet to be graded",
            mentorcomments: "Yet to be graded",
        };

        const updatedDocument = await weeklySubmissionData.findOneAndUpdate(
            { s_id: student, week: req.body.selectedWeek },
            { $set: weekItem },
            { new: true, upsert: true }
        );

        console.log('Updated document:', updatedDocument);
        res.status(201).send({ message: 'Week Added!!!' });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Error updating week', error: e });
    }
});

router.post('/uploadProject/:student', upload.single('files'), async (req, res, next) => {
    const student = req.params.student;
    try {
        console.log(req.body);
        const projectItem = {
            s_id: student,
            links: req.body.links,
            files: req.file.buffer.toString('base64'), // Store file as base64 string
            comments: req.body.comments,
        };

        const updatedDocument = await projectSubmissionData.findOneAndUpdate(
            { s_id: student },
            { $set: projectItem },
            { new: true, upsert: true }
        );

        console.log('Updated document:', updatedDocument);
        res.status(201).send({ message: 'Project submission Added!!!' });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Error updating project', error: e });
    }
});

router.post('/postStdPjt', async (req, res, next) => {
    try {
        console.log(req.body);
        const item = {
            sp_id: req.body.sp_id,
            sp_name: req.body.sp_name,
            p_id: req.body.p_id,
            p_name: req.body.p_name,
        };
        const newItem = new studentsWithProjectData(item);
        await newItem.save();
        res.status(201).send({ message: 'new studentsWithProject Added!!!' });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Error adding new studentsWithProject', error: e });
    }
});

router.post('/selectProject', async (req, res) => {
    try {
        const { sp_id, sp_name, p_id, p_name, start_date } = req.body;
        console.log('Project selection data:', req.body);

        const existingStudent = await studentsWithProjectData.findOne({ sp_id });
        const studentCourse = await studentCourseData.findOne({ s_id: sp_id });

        if (studentCourse && studentCourse.s_exitscore <= 50) {
            console.log('Student exit score is below 50');
            return res.status(400).send({ message: "You can't select a project as your exit score is below 50" });
        }

        if (existingStudent) {
            console.log('Student already has a project');
            res.status(200).send({ message: 'Student already has a project', data: existingStudent });
        } else {
            const newSelection = {
                sp_id,
                sp_name,
                p_id,
                p_name,
                start_date: new Date(start_date)
            };

            const result = await studentsWithProjectData.create(newSelection);

            res.status(201).send({ message: 'Project selection saved successfully!', data: result });
        }
    } catch (error) {
        console.error('Error saving project selection:', error);
        res.status(500).send({ message: 'Error saving project selection', error });
    }
});

router.put('/updateStudentProject/:s_id', async (req, res) => {
    try {
        const { s_id } = req.params;
        const { p_id } = req.body;

        console.log(`Updating student ${s_id} with project ${p_id}`);

        const result = await studentsWithProjectData.findOneAndUpdate(
            { sp_id: s_id },
            { $set: { p_id: p_id } },
            { new: true }
        );

        if (result) {
            res.status(200).send({ message: 'Student project updated successfully!', data: result });
        } else {
            res.status(404).send({ message: 'Student not found!' });
        }
    } catch (error) {
        console.error('Error updating student project:', error);
        res.status(500).send({ message: 'Error updating student project', error });
    }
});

module.exports = router;
