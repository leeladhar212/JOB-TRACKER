import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee, Briefcase, Bookmark, ExternalLink, Clock } from 'lucide-react';

const getScoreBadge = (score) => {
  if (score >= 80) return { label: 'Strong Match', cls: 'badge-green', ring: 'ring-green-500/30 text-green-400' };
  if (score >= 50) return { label: 'Good Match', cls: 'badge-yellow', ring: 'ring-yellow-500/30 text-yellow-400' };
  return { label: 'Low Match', cls: 'badge-red', ring: 'ring-red-500/30 text-red-400' };
};

const JobCard = ({ job }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const score = job.matchScore || 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const badge = getScoreBadge(score);

  const [isApplying, setIsApplying] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      if (!job.applyLink) {
        alert('Application link not available');
      } else {
        window.open(job.applyLink, '_blank');
      }
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card card-hover flex flex-col h-full group relative overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300
        ${score >= 80 ? 'bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0 opacity-0 group-hover:opacity-100'
        : score >= 50 ? 'bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0 opacity-0 group-hover:opacity-100'
        : 'bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0 opacity-0 group-hover:opacity-100'}`}
      />

      <div className="p-6 flex flex-col h-full">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            {/* Company logo placeholder */}
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3 text-lg font-black text-primary">
              {job.company?.charAt(0)}
            </div>
            <h3 className="text-[15px] font-bold text-white line-clamp-1 mb-0.5">{job.title}</h3>
            <p className="text-zinc-500 text-sm font-medium">{job.company}</p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Circular match score */}
            {job.matchScore !== undefined && (
              <div className={`relative w-12 h-12 flex items-center justify-center ring-1 rounded-full ${badge.ring}`}>
                <svg className="w-12 h-12 absolute -rotate-90">
                  <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-zinc-800" />
                  <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    className={`${badge.ring.split(' ')[1]} transition-all duration-1000 ease-out`}
                  />
                </svg>
                <span className="text-[10px] font-bold relative z-10">{score}%</span>
              </div>
            )}
            {/* Save button */}
            <button
              onClick={() => setSaved(!saved)}
              className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-primary bg-primary/15' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'}`}
              title="Save job"
            >
              <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Match Badge */}
        {job.matchScore !== undefined && (
          <span className={`${badge.cls} inline-flex w-fit mb-3`}>{badge.label}</span>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.location && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
              <MapPin className="w-3.5 h-3.5 text-zinc-600" /> {job.location}
            </span>
          )}
          {job.salaryRange && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
              <IndianRupee className="w-3.5 h-3.5 text-zinc-600" /> {job.salaryRange}
            </span>
          )}
          {job.experienceLevel !== undefined && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
              <Briefcase className="w-3.5 h-3.5 text-zinc-600" /> {job.experienceLevel}+ yrs
            </span>
          )}
        </div>

        {/* Skills */}
        <div className="mt-auto">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.requiredSkills?.slice(0, 5).map((skill, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-md font-medium">
                {skill}
              </span>
            ))}
            {job.requiredSkills?.length > 5 && (
              <span className="text-xs px-2 py-0.5 text-zinc-600 font-medium">+{job.requiredSkills.length - 5} more</span>
            )}
          </div>

          {/* Apply Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleApply}
            disabled={isApplying}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              isApplying
                ? 'bg-primary text-white opacity-80 cursor-wait'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
            }`}
          >
            {isApplying ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Opening...
              </>
            ) : (
              <>Apply Now <ExternalLink className="w-3.5 h-3.5 opacity-60" /></>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
