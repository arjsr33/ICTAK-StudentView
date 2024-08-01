const mongoose = require('mongoose')
const studentCourseSchema = mongoose.Schema({
    s_id:String,
    s_name:String,
    s_course:String,
    s_startdate:String,
    s_mentor:String,
    s_grade:String,
    s_exitscore:Number,
})
const studentCourseData = mongoose.model('studentCourse',studentCourseSchema)
module.exports = studentCourseData