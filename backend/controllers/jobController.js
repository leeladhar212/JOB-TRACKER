const Job = require('../models/Job');
const User = require('../models/User');
const { calculateMatchScore } = require('../services/matchingService');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobs = await Job.find().populate('postedBy', 'name');

    // Calculate match score for each job
    const recommended = jobs.map(job => {
      const matchScore = calculateMatchScore(user.skills, job.requiredSkills);
      return {
        ...job.toObject(),
        matchScore
      };
    });

    // Sort by match score descending
    recommended.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ success: true, count: recommended.length, data: recommended });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    req.body.postedBy = req.user.id;
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
