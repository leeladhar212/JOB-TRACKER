const path = require('path');
const fs = require('fs');

const getQuestionsData = () => {
  const jsonPath = path.join(__dirname, '../data/questions.json');
  return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
};

exports.getQuestions = (req, res) => {
  try {
    const questions = getQuestionsData();
    // Strip correct answers before sending to client
    const safeQuestions = questions.map(q => ({
      id: q.id,
      text: q.text,
      options: q.options
    }));
    
    res.status(200).json({ success: true, data: safeQuestions });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load quiz' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const userAnswers = req.body.answers || [];
    const questions = getQuestionsData();

    let score = 0;
    const weakAreas = new Set();
    const review = [];
    const correctSkills = [];
    const wrongSkills = [];

    userAnswers.forEach(ua => {
      const dbQuestion = questions.find(q => q.id === ua.id);
      if (dbQuestion) {
        if (dbQuestion.correctAnswer === ua.answer) {
          score++;
          correctSkills.push(dbQuestion.skill);
          review.push({ id: ua.id, correct: true });
        } else {
          weakAreas.add(dbQuestion.skill);
          wrongSkills.push(dbQuestion.skill);
          review.push({
            id: ua.id,
            correct: false,
            expected: dbQuestion.correctAnswer,
            submitted: ua.answer
          });
        }
      }
    });

    const percentage = Math.round((score / questions.length) * 100);

    // If authenticated, update the user's skillMetrics based on quiz answers
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);
        if (user) {
          // Boost correct skills +8, penalize wrong skills -10
          const updateSkill = (skillName, delta) => {
            const m = user.skillMetrics.find(m => m.name.toLowerCase() === skillName.toLowerCase());
            if (m) {
              m.level = Math.min(100, Math.max(0, m.level + delta));
            }
          };
          correctSkills.forEach(s => updateSkill(s, 8));
          wrongSkills.forEach(s => updateSkill(s, -10));
          await user.save();
        }
      } catch (_) { /* ignore auth errors — quiz still evaluates */ }
    }

    res.status(200).json({
      success: true,
      data: { totalQuestions: questions.length, score, percentage, weakAreas: Array.from(weakAreas), review }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to evaluate quiz' });
  }
};
