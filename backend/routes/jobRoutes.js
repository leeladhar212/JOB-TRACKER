const express = require('express');
const { getJobs, getRecommendedJobs, createJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter'), createJob);

router.route('/recommended')
  .get(protect, getRecommendedJobs);

module.exports = router;
