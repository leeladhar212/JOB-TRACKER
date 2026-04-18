import { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, AlertTriangle, ArrowRight, RefreshCcw, ChevronRight } from 'lucide-react';

const SkillTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/quiz').then(res => {
      setQuestions(res.data.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load quiz questions.');
      setLoading(false);
    });
  }, []);

  const handleSelect = (qid, opt) => {
    setAnswers(prev => [...prev.filter(a => a.id !== qid), { id: qid, answer: opt }]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/quiz/submit', { answers });
      setResult(res.data.data);
    } catch { setError('Submission failed.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-zinc-500 text-sm font-medium">Loading questions...</p>
    </div>
  );

  if (error) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-red-400 font-semibold">{error}</p>
    </div>
  );

  /* ── RESULT SCREEN ── */
  if (result) {
    const passed = result.percentage >= 70;
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1">Test Complete</h1>
            <p className="text-zinc-500 text-sm mb-8">Here's your skill analysis breakdown</p>

            {/* Score ring */}
            <div className="flex justify-center mb-8">
              <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center ${passed ? 'border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.2)]' : 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]'}`}>
                <span className={`text-5xl font-black ${passed ? 'text-green-400' : 'text-red-400'}`}>{result.percentage}%</span>
                <span className="text-zinc-500 text-xs mt-1">{result.score}/{result.totalQuestions} correct</span>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ${passed ? 'badge-green' : 'badge-red'}`}>
              {passed ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {passed ? 'Great performance!' : 'Keep practicing'}
            </div>

            {/* Weak areas */}
            {result.weakAreas.length > 0 && (
              <div className="bg-red-500/8 border border-red-500/15 rounded-2xl p-5 mb-6 text-left">
                <p className="text-red-400 font-semibold text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Areas to improve
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.weakAreas.map((area, i) => (
                    <span key={i} className="badge-red text-xs">{area}</span>
                  ))}
                </div>
              </div>
            )}

            {passed && result.weakAreas.length === 0 && (
              <div className="bg-green-500/8 border border-green-500/15 rounded-2xl p-4 mb-6 text-green-400 text-sm font-semibold">
                🎉 Perfect score! All skills verified.
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCcw className="w-4 h-4" /> Retake Test
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── QUIZ SCREEN ── */
  const q = questions[currentIdx];
  const selected = answers.find(a => a.id === q.id);
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const isLast = currentIdx === questions.length - 1;
  const allAnswered = answers.length === questions.length;

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-bold text-white text-sm">Skill Diagnostics</span>
          </div>
          <span className="badge badge-blue">
            {currentIdx + 1} / {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6 bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="card p-7"
          >
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">Question {currentIdx + 1}</p>
            <h3 className="text-xl font-bold text-white leading-snug mb-7">{q.text}</h3>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selected?.answer === opt;
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    }`}
                  >
                    <span className="font-bold text-zinc-600 mr-3">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-7 flex justify-between items-center">
              <button
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                className={`text-xs text-zinc-600 hover:text-zinc-400 transition-colors ${currentIdx === 0 ? 'invisible' : ''}`}
              >
                ← Previous
              </button>

              {!isLast ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  disabled={!selected}
                  className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-30"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-30"
                >
                  {submitting
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Evaluating...</>
                    : <><CheckCircle className="w-4 h-4" /> Submit Test</>
                  }
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`rounded-full transition-all duration-200 ${
                i === currentIdx ? 'w-5 h-2 bg-primary' : answers.find(a => a.id === questions[i].id) ? 'w-2 h-2 bg-primary/50' : 'w-2 h-2 bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillTest;
