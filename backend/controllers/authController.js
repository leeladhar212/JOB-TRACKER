const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, skills, experience, education } = req.body;

    // Bootstrap skillMetrics from the skills array at 50% baseline
    const skillMetrics = (skills || []).map(name => ({ name, level: 50 }));

    const user = await User.create({
      name, email, password, role, skills, skillMetrics, experience, education
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getSkillMetrics = async (req, res) => {
  try {
    const Job = require('../models/Job');
    const user = await User.findById(req.user.id);

    const metrics = user.skillMetrics.length > 0
      ? user.skillMetrics
      : user.skills.map(name => ({ name, level: 50 }));

    // Compute skill gap: gather all requiredSkills across jobs, find what user is missing
    const jobs = await Job.find().limit(60).select('requiredSkills');
    const globalSkillSet = new Set();
    jobs.forEach(j => j.requiredSkills.forEach(s => globalSkillSet.add(s.toLowerCase())));

    const userSkillNames = new Set(metrics.map(m => m.name.toLowerCase()));
    const missingSkills = [...globalSkillSet]
      .filter(s => !userSkillNames.has(s))
      .slice(0, 8);

    // Categorize
    const strong = metrics.filter(m => m.level >= 70);
    const medium = metrics.filter(m => m.level >= 40 && m.level < 70);
    const weak   = metrics.filter(m => m.level < 40);

    // Recommendations based on weak/medium skills
    const recommendations = [
      ...weak.map(m => `Improve ${m.name} to unlock more job matches`),
      ...medium.map(m => `Strengthen ${m.name} to reach expert level`),
      ...missingSkills.slice(0, 3).map(s => `Learn ${s} — it's in high demand`)
    ].slice(0, 6);

    res.status(200).json({
      success: true,
      data: { metrics, strong, medium, weak, missingSkills, recommendations }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateSkillMetrics = async (req, res) => {
  try {
    const { skillName, delta } = req.body;
    const user = await User.findById(req.user.id);

    const metric = user.skillMetrics.find(m => m.name.toLowerCase() === skillName.toLowerCase());
    if (metric) {
      metric.level = Math.min(100, Math.max(0, metric.level + delta));
    } else {
      user.skillMetrics.push({ name: skillName, level: Math.max(0, 50 + delta) });
    }
    await user.save();
    res.status(200).json({ success: true, data: user.skillMetrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { skillName, level = 50 } = req.body;
    if (!skillName || !skillName.trim()) {
      return res.status(400).json({ success: false, error: 'Skill name is required' });
    }

    const user = await User.findById(req.user.id);
    const cleanName = skillName.trim();

    // Check if skill already exists
    const alreadyInMetrics = user.skillMetrics.some(m => m.name.toLowerCase() === cleanName.toLowerCase());
    const alreadyInSkills = user.skills.some(s => s.toLowerCase() === cleanName.toLowerCase());

    if (alreadyInMetrics || alreadyInSkills) {
      return res.status(400).json({ success: false, error: `"${cleanName}" is already in your skill profile` });
    }

    // Add to both arrays
    user.skills.push(cleanName);
    user.skillMetrics.push({ name: cleanName, level: Number(level) });

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        skills: user.skills,
        skillMetrics: user.skillMetrics
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
