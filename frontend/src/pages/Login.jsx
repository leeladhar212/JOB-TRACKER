import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-background relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight">JOB_TRACKER</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-lg">Enter your details to access your AI dashboard.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl flex items-start gap-3 text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/90">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-secondary/30 border border-border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground/90">Password</label>
                <a href="#" className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-secondary/30 border border-border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-muted-foreground font-medium">
            Don't have an account? <Link to="/register" className="text-primary hover:underline hover:text-primary/80 transition-colors ml-1">Create one</Link>
          </p>
        </motion.div>
      </div>

      {/* Hero Graphic Section - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 relative overflow-hidden items-center justify-center border-l border-white/5">
        
        {/* Dynamic Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[130px] opacity-70 pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-700/20 blur-[130px] opacity-50 pointer-events-none" />
        
        {/* Abstract Hex/Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 max-w-lg p-10 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
        >
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            The standard for <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Intelligent Matching.</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            "JOB_TRACKER's AI cut our recruiting time by 70%. The deterministic vector similarity engine guarantees accuracy every single time."
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-xs font-bold text-white overflow-hidden`}>
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-zinc-300">
              Trusted by <span className="text-white font-bold">10,000+</span> professionals
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
