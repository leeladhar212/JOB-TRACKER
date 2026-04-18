import { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart2, Briefcase, Sparkles, Search } from 'lucide-react';

// Skeleton Card
const SkeletonCard = () => (
  <div className="card p-6 flex flex-col gap-4 h-64">
    <div className="flex gap-3 items-start">
      <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-1/2 rounded-lg" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-6 w-20 rounded-lg" />
      <div className="skeleton h-6 w-24 rounded-lg" />
    </div>
    <div className="flex gap-1.5 flex-wrap">
      {[1,2,3].map(i => <div key={i} className="skeleton h-5 w-16 rounded-md" />)}
    </div>
    <div className="skeleton h-10 w-full rounded-xl mt-auto" />
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/recommended');
        setJobs(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(j =>
    !filter || j.title?.toLowerCase().includes(filter.toLowerCase()) || j.company?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex-1 overflow-hidden">

      {/* Subtle background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">AI-Powered Recommendations</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">{user?.name}</span> 👋
              </h1>
              <p className="text-zinc-400 text-base max-w-xl">
                Here are your top AI-matched job recommendations based on your skills and experience level.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 shrink-0 flex-wrap">
              <Link to="/skill-dashboard" className="btn-secondary flex items-center gap-2 text-sm">
                <BarChart2 className="w-4 h-4 text-primary" /> Skill Dashboard
              </Link>
              <Link to="/skill-test" className="btn-primary flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4" /> Take Skill Test
              </Link>
            </div>
          </div>

          {/* Skills chips */}
          {user?.skills?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-zinc-600 font-semibold uppercase tracking-wider">Your Skills:</span>
              {user.skills.map((skill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="badge badge-blue"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Search / Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter by job title or company..."
            className="input-field pl-11 text-sm"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </motion.div>

        {/* ── Error ── */}
        {error && (
          <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl mb-6 font-medium text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ── Job Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {/* Result count */}
            <p className="text-xs text-zinc-600 font-semibold uppercase tracking-wide mb-4">
              {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} found
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-16"
            >
              {filteredJobs.map((job, i) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
                  <Briefcase className="w-9 h-9 text-zinc-700" />
                </div>
                <h3 className="text-xl font-bold text-zinc-400 mb-2">No jobs found</h3>
                <p className="text-zinc-600 text-sm max-w-xs">
                  {filter ? `No results for "${filter}". Try a different search term.` : 'No recommended jobs available yet. Update your skills profile to improve matches.'}
                </p>
                {filter && (
                  <button onClick={() => setFilter('')} className="mt-4 btn-secondary text-sm">
                    Clear Filter
                  </button>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
