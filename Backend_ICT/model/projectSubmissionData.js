const mongoose = require('mongoose')
const projectSubmissionSchema = mongoose.Schema({
    s_id:String,
    links:String,
    files:String,
    comments:String,
})
const projectSubmissionData = mongoose.model('projectSubmission',projectSubmissionSchema)
module.exports = projectSubmissionData