const express = require('express');
const { getQuestions, submitQuiz } = require('../controllers/quizController');

const router = express.Router();

router.get('/', getQuestions);
router.post('/submit', submitQuiz);

module.exports = router;
