const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended:true}))

const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
// const projectData = require('../model/projectData')
const availableProjectData = require('../model/availableProjectData')
const studentCourseData = require('../model/studentCourseData')
// const studentWeeklySubmissionData = require('../model/studentWeeklySubmissionData')
const studentsWithProjectData = require('../model/studentsWithProjectData')
const weeklySubmissionData = require('../model/weeklySubmissionData')
const projectSubmissionData = require('../model/projectSubmissionData')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  
const upload = multer({ storage: storage })

router.get('/studentCourse/:student',async(req,res)=>{
    try{
        const student = req.params.student
        console.log('The student id is - ')
        console.log(student)
        const data = await studentCourseData.find({s_id:student})
        res.status(200).send(data[0])
        console.log(data[0])
    } catch (error) {
        res.status(404).send(err)
    }
})
// router.get('/projects/:course',async(req,res)=>{
//     try{
//         const {course} = req.params
//         console.log(`Course is ${course}` )
//         const data = await projectData.find({course:course})
//         res.status(200).send(data)
//         // console.log(data)
//     } catch (error) {
//         res.status(404).send(error)
//     }
// })
router.get('/availableProjects/:course',async(req,res)=>{
    try{
        const {course} = req.params
        console.log(`Course is ${course}` )
        const data = await availableProjectData.find({course:course})
        res.status(200).send(data)
        // console.log(data)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/studentswithprojects/:student',async(req,res)=>{
    try{
        const {student} = req.params
        console.log(`Student is ${student}` )
        const data = await studentsWithProjectData.find({sp_id:student})
        res.status(200).send(data)
        console.log(data)
    } catch (error) {
        res.status(404).send(error)
    }
})

// router.post('/uploadWeek/:student', upload.single('files'), async function (req, res, next) {
//     // req.file is the `weeklyFile` file
//     // req.body will hold the text fields, if there were any
//     const student = req.params.student
//     try{
//         console.log(req.body)
//         var weekItem = {
//             s_id:student,
//             week:req.body.selectedWeek,
//             links:req.body.links,
//             files:req.file.filename,
//             comments:req.body.comments,
//         }
//         var newWeek = new weeklySubmissionData(weekItem)
//         await newWeek.save()
//         res.status(201).send({message:'Week Added!!!'})
//     }catch(e){
//         console.log(e)
//     }
//     // console.log('req.body is-')
//     // console.log(req.body)
//     // const file = req.file
//     // if(!file){
//     //     console.log('Error in attatching file')
//     // }
//     // res.send(file)
//   })
router.post('/uploadWeek/:student', upload.single('files'), async function (req, res, next) {
    // req.file is the weeklyFile file
    // req.body will hold the text fields, if there were any
    const student = req.params.student
    try{
        console.log(req.body)
        var weekItem = {
            s_id:student,
            week:req.body.selectedWeek,
            links:req.body.links,
            files:req.file.filename,
            comments:req.body.comments,
            mentormarks:"Yet to be graded",
            mentorcomments:"Yet to be graded",
        }
        // var newWeek = new weeklySubmissionData(weekItem)
        // await newWeek.save()
        const updatedDocument = await weeklySubmissionData.findOneAndUpdate(
            { s_id: student, week:req.body.selectedWeek }, // Find document by _id or any other field
            { $set: weekItem }, // Update fields
            // { new: true, upsert: true, runValidators: true } // Return the updated document, create if not exists, and run schema validation
            { new: true, upsert: true } // Return the updated document, create if not exists
        );
        console.log('Updated document:', updatedDocument);
        res.status(201).send({message:'Week Added!!!'})
    }catch(e){
        console.log(e)
    }
  })

//   router.post('/uploadProject/:student', upload.single('files'), async function (req, res, next) {
//     // req.file is the `weeklyFile` file
//     // req.body will hold the text fields, if there were any
//     const student = req.params.student
//     try{
//         console.log(req.body)
//         var projectItem = {
//             s_id:student,
//             links:req.body.links,
//             files:req.file.filename,
//             comments:req.body.comments,
//         }
//         var newProject = new projectSubmissionData(projectItem)
//         await newProject.save()
//         res.status(201).send({message:'Project submission Added!!!'})
//     }catch(e){
//         console.log(e)
//     }
//     // console.log('req.body is-')
//     // console.log(req.body)
//     // const file = req.file
//     // if(!file){
//     //     console.log('Error in attatching file')
//     // }
//     // res.send(file)
//   })
router.post('/uploadProject/:student', upload.single('files'), async function (req, res, next) {
    // req.file is the weeklyFile file
    // req.body will hold the text fields, if there were any
    const student = req.params.student
    try{
        console.log(req.body)
        var projectItem = {
            s_id:student,
            links:req.body.links,
            files:req.file.filename,
            comments:req.body.comments,
        }
        // var newProject = new projectSubmissionData(projectItem)
        // await newProject.save()
        const updatedDocument = await projectSubmissionData.findOneAndUpdate(
            { s_id: student }, // Find document by _id or any other field
            { $set: projectItem }, // Update fields
            // { new: true, upsert: true, runValidators: true } // Return the updated document, create if not exists, and run schema validation
            { new: true, upsert: true } // Return the updated document, create if not exists
        );
        console.log('Updated document:', updatedDocument);
        res.status(201).send({message:'Project submission Added!!!'})
    }catch(e){
        console.log(e)
    }
    // console.log('req.body is-')
    // console.log(req.body)
    // const file = req.file
    // if(!file){
    //     console.log('Error in attatching file')
    // }
    // res.send(file)
  })

  router.post('/postStdPjt', async function (req, res, next) {
    try{
        console.log(req.body)
        var item = {
            sp_id:req.body.sp_id,
            sp_name:req.body.sp_name,
            p_id:req.body.p_id,
            p_name:req.body.p_name,
        }
        var newItem = new studentsWithProjectData(item)
        await newItem.save()
        res.status(201).send({message:'new studentsWithProject Added!!!'})
    }catch(e){
        console.log(e)
    }
  })
  
router.post('/selectProject', async (req, res) => {
  try {
    const { sp_id, sp_name, p_id, p_name, start_date } = req.body;
    console.log('Project selection data:', req.body);

    // Check if sp_id already exists
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
        start_date: new Date(start_date) // Convert to ISO format
      };

      const result = await studentsWithProjectData.create(newSelection);

      res.status(201).send({ message: 'Project selection saved successfully!', data: result });
    }
  } catch (error) {
    console.error('Error saving project selection:', error);
    res.status(500).send({ message: 'Error saving project selection', error });
  }
});
  // New PUT route to update the student's project ID
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
      res.status500().send({ message: 'Error updating student project', error });
    }
  });


module.exports = router
