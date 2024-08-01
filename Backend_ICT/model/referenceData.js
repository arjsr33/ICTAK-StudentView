const mongoose = require('mongoose')
const referenceSchema = mongoose.Schema({
    p_id:String,
    p_name:String,
    ref1:String,
    ref2:String,
    ref3:String,
    ref4:String,
})
const referenceData = mongoose.model('reference',referenceSchema)
module.exports = referenceData