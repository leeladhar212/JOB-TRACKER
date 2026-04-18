import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle, Briefcase } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [skillsInput, setSkillsInput] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    try {
      await register({ name, email, password, role, skills, experience: Number(experience) });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 px-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200";

  const perks = [
    'AI-powered job matching using Cosine Similarity',
    'Personal skill dashboard & gap analysis',
    'Diagnostic skill tests with instant results',
  ];

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">

      {/* ── Left: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 w-fit group">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold text-white text-sm">JOB_TRACKER</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-white mb-1">Create your account</h1>
          <p className="text-zinc-500 text-sm mb-8">Join thousands of professionals finding smarter jobs.</p>

          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl flex items-center gap-2.5 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className={inputCls}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className={inputCls}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className={inputCls}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ val: 'user', label: '🎯 Job Seeker' }, { val: 'recruiter', label: '🏢 Recruiter' }].map(opt => (
                  <button
                    type="button"
                    key={opt.val}
                    onClick={() => setRole(opt.val)}
                    className={`py-3 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                      role === opt.val
                        ? 'bg-blue-500/15 border-blue-500/50 text-blue-400'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills + Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Skills</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Python"
                  className={inputCls}
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                />
                <p className="text-[11px] text-zinc-600 mt-1 ml-1">Comma-separated</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Experience (yrs)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 3"
                  className={inputCls}
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right: Brand Panel ── */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 border-l border-white/5 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10 max-w-sm px-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mb-6">
            <Briefcase className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">
            Your career,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">intelligently matched.</span>
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            JOB_TRACKER uses a deterministic Cosine Similarity AI engine to score every job against your unique skill profile in real time.
          </p>
          <div className="space-y-3">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <span className="text-zinc-400 text-sm">{perk}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
