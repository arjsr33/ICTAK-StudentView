const mongoose = require('mongoose')
const studentWeeklySubmissionSchema = mongoose.Schema({
    s_id:String,
    week:String,
    links:String,
    files:String,
    comments:String,
})
const studentWeeklySubmissionData = mongoose.model('studentWeeklySubmission',studentWeeklySubmissionSchema)
module.exports = studentWeeklySubmissionData