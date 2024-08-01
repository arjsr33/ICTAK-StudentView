const express = require('express');
const router = express.Router();
const Discussion = require('../model/discussion'); // Ensure the correct path to the model
const studentCourseData = require('../model/studentCourseData'); // Ensure the correct path to the model

// Get student's course and corresponding discussion forum data
router.get('/discussion/:s_id', async (req, res) => {
  try {
    const { s_id } = req.params;
    console.log(`Fetching course for student ID: ${s_id}`);

    const student = await studentCourseData.findOne({ s_id });

    if (!student) {
      console.log(`No student found with ID: ${s_id}`);
      return res.status(404).send({ message: 'No student found with this ID' });
    }

    const course = student.s_course; // Using s_course as the batch identifier
    console.log(`Student course: ${course}`);

    const discussion = await Discussion.findOne({ batch: course });

    if (!discussion) {
      console.log(`No discussion found for course: ${course}`);
      return res.status(404).send({ message: 'No discussion found for this course' });
    }

    console.log(`Discussion found for course: ${course}`, discussion);
    res.status(200).send(discussion);
  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).send({ message: 'Server error', error });
  }
});

// Add a new question
router.post('/discussion/:s_id/question', async (req, res) => {
  try {
    const { s_id } = req.params;
    const { question } = req.body;

    console.log(`Fetching course for student ID: ${s_id}`);

    const student = await studentCourseData.findOne({ s_id });

    if (!student) {
      console.log(`No student found with ID: ${s_id}`);
      return res.status(404).send({ message: 'No student found with this ID' });
    }

    const course = student.s_course; // Using s_course as the batch identifier
    console.log(`Student course: ${course}`);
    console.log(`Adding new question to course: ${course}`, question);

    let discussion = await Discussion.findOne({ batch: course });

    if (!discussion) {
      console.log(`No discussion found for course: ${course}, creating new discussion.`);
      discussion = new Discussion({ batch: course, questions: [] });
    }

    discussion.questions.push({ question, answers: [] });
    await discussion.save();

    console.log(`Question added to course: ${course}`, discussion);
    res.status(201).send(discussion);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).send({ message: 'Server error', error });
  }
});

// Add an answer to a specific question
router.post('/discussion/:s_id/question/:questionId/answer', async (req, res) => {
  try {
    const { s_id, questionId } = req.params;
    const { answer } = req.body;

    console.log(`Fetching course for student ID: ${s_id}`);

    const student = await studentCourseData.findOne({ s_id });

    if (!student) {
      console.log(`No student found with ID: ${s_id}`);
      return res.status(404).send({ message: 'No student found with this ID' });
    }

    const course = student.s_course; // Using s_course as the batch identifier
    console.log(`Student course: ${course}`);
    console.log(`Adding new answer to question ${questionId} in course: ${course}`, answer);

    const discussion = await Discussion.findOne({ batch: course });

    if (!discussion) {
      console.log(`No discussion found for course: ${course}`);
      return res.status(404).send({ message: 'No discussion found for this course' });
    }

    const question = discussion.questions.id(questionId);

    if (!question) {
      console.log(`Question not found: ${questionId}`);
      return res.status(404).send({ message: 'Question not found' });
    }

    question.answers.push(answer);
    await discussion.save();

    console.log(`Answer added to question ${questionId} in course: ${course}`, discussion);
    res.status(201).send(discussion);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).send({ message: 'Server error', error });
  }
});

// Edit a question
router.put('/discussion/:s_id/question/:questionId', async (req, res) => {
  try {
    const { s_id, questionId } = req.params;
    const { questionText } = req.body;

    console.log(`Fetching course for student ID: ${s_id}`);

    const student = await studentCourseData.findOne({ s_id });

    if (!student) {
      console.log(`No student found with ID: ${s_id}`);
      return res.status(404).send({ message: 'No student found with this ID' });
    }

    const course = student.s_course; // Using s_course as the batch identifier
    console.log(`Student course: ${course}`);
    console.log(`Editing question ${questionId} in course: ${course}`, questionText);

    const discussion = await Discussion.findOne({ batch: course });

    if (!discussion) {
      console.log(`No discussion found for course: ${course}`);
      return res.status(404).send({ message: 'No discussion found for this course' });
    }

    const question = discussion.questions.id(questionId);

    if (!question) {
      console.log(`Question not found: ${questionId}`);
      return res.status(404).send({ message: 'Question not found' });
    }

    question.question = questionText;
    await discussion.save();

    console.log(`Question ${questionId} edited in course: ${course}`, discussion);
    res.status(200).send(discussion);
  } catch (error) {
    console.error('Error editing question:', error);
    res.status(500).send({ message: 'Server error', error });
  }
});

// Delete a question
router.delete('/discussion/:s_id/question/:questionId', async (req, res) => {
  try {
    const { s_id, questionId } = req.params;

    console.log(`Fetching course for student ID: ${s_id}`);

    const student = await studentCourseData.findOne({ s_id });

    if (!student) {
      console.log(`No student found with ID: ${s_id}`);
      return res.status(404).send({ message: 'No student found with this ID' });
    }

    const course = student.s_course; // Using s_course as the batch identifier
    console.log(`Student course: ${course}`);
    console.log(`Deleting question ${questionId} in course: ${course}`);

    const discussion = await Discussion.findOne({ batch: course });

    if (!discussion) {
      console.log(`No discussion found for course: ${course}`);
      return res.status(404).send({ message: 'No discussion found for this course' });
    }

    const question = discussion.questions.id(questionId);

    if (!question) {
      console.log(`Question not found: ${questionId}`);
      return res.status(404).send({ message: 'Question not found' });
    }

    discussion.questions.pull({ _id: questionId });
    await discussion.save();

    console.log(`Question ${questionId} deleted in course: ${course}`, discussion);
    res.status(200).send(discussion);
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).send({ message: 'Server error', error });
  }
});

module.exports = router;
