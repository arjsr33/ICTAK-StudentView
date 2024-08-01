const mongoose = require('mongoose')
const studentsWithProjectSchema = mongoose.Schema({
    sp_id:String,
    sp_name:String,
    p_id:String,
    p_name:String,
    start_date:{ type: Date, default: Date.now },
})
const studentsWithProjectData = mongoose.model('studentsWithProject',studentsWithProjectSchema)
module.exports = studentsWithProjectData