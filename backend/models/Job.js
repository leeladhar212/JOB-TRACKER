const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  requiredSkills: {
    type: [String],
    required: [true, 'Please add required skills']
  },
  experienceLevel: {
    type: Number,
    required: [true, 'Please add experience level (in years)']
  },
  salaryRange: {
    type: String
  },
  applyLink: {
    type: String
  },
  location: {
    type: String
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);
