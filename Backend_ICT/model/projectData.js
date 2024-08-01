const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: String,
  name: String,
  course: String,
  company: String,
  details: String,
  overview: [String],
  prerequisiteKnowledge: [String],
  jobOpportunities: [String],
  backgroundImage: String,
  referenceMaterials: [{ week: Number, material: String }],
  weeklySubmissionFormat: String,
  finalReportFormat: String,
  vivaVoceFormat: String,
  discussionForum: [String],
  project_url: String
});

const projectData = mongoose.model('project', projectSchema);
module.exports = projectData;