const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const Signup = require('../model/Signup');
const studentCourseData = require('../model/studentCourseData');
const studentsWithProjectData = require('../model/studentsWithProjectData');

// Helper function to generate a random exit score
const generateRandomExitScore = () => Math.floor(Math.random() * 100);

// Helper function to determine grade based on score
const calculateGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'E';
};

router.get('/studentCourse/:student', async (req, res) => {
    try {
        const student = req.params.student;
        console.log('The student id is - ');
        console.log(student);
        const data = await studentCourseData.findOne({ s_id: student });
        if (data) {
            console.log(data);
            res.status(200).send(data);
        } else {
            console.log('No such student in ICT');
            res.status(200).send({ message: 'No such student in ICT' });
        }
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

router.post('/signup', async (req, res) => {
    const { name, email, password, phone, batch } = req.body;

    try {
        // Create new student signup
        const newStudent = await Signup.create({ name, email, password, phone, batch });

        // Create new student course data with default values and input values
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

        res.status(201).send({ message: 'Student Added!!!', newStudent, newStudentCourseData });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Server error', error: e.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Signup.findOne({ email, password });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
