const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended:true}))

const path = require('path')

const projectData = require('../model/projectData')

router.get('/projects/:id', async (req, res) => { // This route handles GET requests to /api/projects
    try {
        const {id} = req.params
        console.log(`Project is ${id}` )
      const projects = await projectData.find({id:id});
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching projects', error });
    }
  });

  module.exports = router