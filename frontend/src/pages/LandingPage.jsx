import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Zap, Target } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-20 min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl px-4 z-10"
      >
        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium shadow-sm border border-primary/20 mb-6 inline-block">
          AI-Powered Job Matching Engine
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Find Your Dream Job with <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Intelligent Matching</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Our advanced AI analyzes your skills, experience, and preferences to connect you with opportunities where you'll thrive. Stop searching, start matching.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/25">
            Get Started
          </Link>
          <Link to="/login" className="px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 border border-border transition">
            Login
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4 mt-24 z-10">
        <FeatureCard 
          icon={<Brain className="h-8 w-8 text-primary" />}
          title="Smart Matching"
          description="Our algorithm calculates precise match scores based on cosine similarity logic between your skills and job requirements."
        />
        <FeatureCard 
          icon={<Zap className="h-8 w-8 text-yellow-500" />}
          title="Instant Insights"
          description="Get detailed percentage scores explaining exactly why a job is right for you, saving you hours of reading applications."
        />
        <FeatureCard 
          icon={<Target className="h-8 w-8 text-green-500" />}
          title="Top Precision"
          description="A curated, dynamic dashboard feed that learns and adapts to show you only the most relevant opportunities."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-6 rounded-2xl bg-card border border-white/5 shadow-xl backdrop-blur-sm"
  >
    <div className="mb-4 bg-background w-14 h-14 rounded-lg flex items-center justify-center border border-border">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
)

export default LandingPage;
