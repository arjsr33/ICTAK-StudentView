const mongoose = require('mongoose')
const weeklySubmissionSchema = mongoose.Schema({
    s_id:String,
    week:String,
    links:String,
    files:String,
    comments:String,
    mentormarks:String,
    mentorcomments:String,
})
const weeklySubmissionData = mongoose.model('weeklySubmission',weeklySubmissionSchema)
module.exports = weeklySubmissionData