const mongoose = require('mongoose')
const availableProjectSchema = mongoose.Schema({
    id:String,
    name:String,
    course:String,
    company:String,
    details:String,
    overview:String
})
const availableProjectData = mongoose.model('availableProject',availableProjectSchema)
module.exports = availableProjectData