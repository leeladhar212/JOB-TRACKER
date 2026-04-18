const express = require('express');
const { register, login, getMe, getSkillMetrics, updateSkillMetrics, addSkill } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/metrics', protect, getSkillMetrics);
router.put('/metrics', protect, updateSkillMetrics);
router.post('/skills', protect, addSkill);

module.exports = router;
