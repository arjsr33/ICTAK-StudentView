const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  batch: String,
  questions: [
    {
      question: String,
      answers: [String]
    }
  ]
});

 const discussion = mongoose.model('discussion', discussionSchema);
 module.exports = discussion;