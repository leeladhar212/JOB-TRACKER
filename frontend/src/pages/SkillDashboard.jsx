import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp, AlertTriangle, Lightbulb, ShieldCheck,
  Minus, TrendingDown, ArrowLeft, BookOpen, Plus, CheckCircle2
} from 'lucide-react';

const getLevelColor = (level) => {
  if (level >= 70) return { bar: 'bg-green-500', text: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' };
  if (level >= 40) return { bar: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' };
  return { bar: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' };
};

const SkillBar = ({ name, level, delay }) => {
  const colors = getLevelColor(level);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl border ${colors.border} ${colors.bg} mb-3`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-white">{name}</span>
        <span className={`text-sm font-bold ${colors.text}`}>{level}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className={`h-2.5 rounded-full ${colors.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

const SkillDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add skill state
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState(50);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setAddLoading(true);
    setAddError('');
    setAddSuccess('');
    try {
      await api.post('/auth/skills', { skillName: newSkill.trim(), level: newLevel });
      setAddSuccess(`"${newSkill.trim()}" added successfully!`);
      setNewSkill('');
      setNewLevel(50);
      // Refresh metrics
      const res = await api.get('/auth/metrics');
      setData(res.data.data);
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to add skill');
    } finally {
      setAddLoading(false);
      setTimeout(() => { setAddSuccess(''); setAddError(''); }, 3000);
    }
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/auth/metrics');
        setData(res.data.data);
      } catch (err) {
        setError('Failed to load skill metrics. Please log in.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-400 font-medium">Analyzing your skill profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-10">
          <p className="text-red-400 font-bold text-xl mb-4">{error}</p>
          <Link to="/login" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold">Login</Link>
        </div>
      </div>
    );
  }

  const { metrics, strong, medium, weak, missingSkills, recommendations } = data;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link to="/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm flex items-center gap-1 mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-white">Skill Dashboard</h1>
          <p className="text-zinc-400 mt-1 text-lg">
            A real-time breakdown of {user?.name}'s technical proficiency.
          </p>
        </div>
        <Link
          to="/skill-test"
          className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/25 shrink-0"
        >
          <BookOpen className="w-5 h-5" /> Take Skill Test
        </Link>
      </div>

      {/* Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Strong Skills', count: strong.length, icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Medium Skills', count: medium.length, icon: Minus, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { label: 'Weak Skills', count: weak.length, icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${card.bg} ${card.border} border rounded-2xl p-6 flex items-center gap-4`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} border ${card.border}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <div className={`text-3xl font-black ${card.color}`}>{card.count}</div>
              <div className="text-zinc-400 text-sm font-medium">{card.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* All Skills with Progress Bars */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Skill Proficiency
          </h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            {metrics.map((skill, i) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={i * 0.06} />
            ))}
            {metrics.length === 0 && (
              <p className="text-zinc-500 text-center py-10">No skills recorded yet. Add skills during registration.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Add New Skill Form */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Add New Skill
            </h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, AWS, Figma"
                  className="input-field"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Proficiency Level</label>
                  <span className="text-primary font-bold text-sm">{newLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  value={newLevel}
                  onChange={e => setNewLevel(Number(e.target.value))}
                />
              </div>
              
              {addError && (
                <div className="text-red-400 text-xs font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> {addError}
                </div>
              )}
              {addSuccess && (
                <div className="text-green-400 text-xs font-medium flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> {addSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={addLoading || !newSkill.trim()}
                className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
              >
                {addLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Plus className="w-4 h-4" /> Add Skill</>
                )}
              </button>
            </form>
          </div>

          {/* Skill Gap */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" /> Skill Gaps
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              {missingSkills.length > 0 ? (
                <>
                  <p className="text-zinc-400 text-sm mb-4">
                    These high-demand job skills are missing from your profile:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-lg text-sm font-bold"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-green-400 font-bold">🎯 No skill gaps detected! You're market-ready.</p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-400" /> AI Recommendations
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <ul className="space-y-3">
                {recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">{i + 1}</span>
                    <span className="text-zinc-300">{rec}</span>
                  </motion.li>
                ))}
                {recommendations.length === 0 && (
                  <p className="text-zinc-500 text-sm">No recommendations at this time.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDashboard;
