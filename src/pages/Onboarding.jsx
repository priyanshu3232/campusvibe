import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, Trophy, ChevronRight } from 'lucide-react';

const slides = [
  {
    icon: Users,
    title: 'Your College Community',
    description: 'Connect with students from your college. Share, discuss, vibe together.',
    color: 'text-accent-purple',
    bg: 'bg-accent-purple/10',
  },
  {
    icon: Star,
    title: 'Review Everything Around Campus',
    description: 'From chai stalls to xerox shops — rate and review every place near your college.',
    color: 'text-accent-warm',
    bg: 'bg-accent-warm/10',
  },
  {
    icon: Trophy,
    title: 'Play, Compete, Climb',
    description: 'Earn Campus Cred, play trivia, top the leaderboard.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
];

const AUTO_ADVANCE_MS = 5000;

export default function Onboarding() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance slides with progress bar
  useEffect(() => {
    if (showSplash) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentSlide(curr => {
            if (curr < slides.length - 1) return curr + 1;
            return curr;
          });
          return 0;
        }
        return prev + (100 / (AUTO_ADVANCE_MS / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [currentSlide, showSplash]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" role="status" aria-label="Loading CampusVibe">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.h1
            className="text-5xl font-display font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-text-primary">Campus</span>
            <span className="text-accent">Vibe</span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              {' '}✨
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="text-text-secondary mt-3 text-lg"
          >
            Your college, your vibe, your people.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`w-24 h-24 rounded-3xl ${slide.bg} flex items-center justify-center mx-auto mb-8`}
            >
              <slide.icon className={`w-12 h-12 ${slide.color}`} />
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
              {slide.title}
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots with auto-advance indicator */}
      <div className="flex items-center justify-center gap-2 mb-8" role="tablist" aria-label="Onboarding slides">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            role="tab"
            aria-selected={i === currentSlide}
            aria-label={`Slide ${i + 1} of ${slides.length}`}
            className="relative h-2 rounded-full transition-all duration-300 overflow-hidden"
            style={{ width: i === currentSlide ? '2rem' : '0.5rem' }}
          >
            <div className={`absolute inset-0 rounded-full ${i === currentSlide ? 'bg-accent/30' : i < currentSlide ? 'bg-accent' : 'bg-card-alt'}`} />
            {i === currentSlide && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent rounded-full"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLast ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-xl bg-accent text-primary font-bold text-lg transition-transform flex items-center justify-center gap-2"
          >
            Get Started <ChevronRight className="w-5 h-5" />
          </motion.button>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => goToSlide(currentSlide + 1)}
              className="w-full py-4 rounded-xl bg-accent text-primary font-bold text-lg transition-transform flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </motion.button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl text-text-tertiary text-sm font-medium hover:text-text-secondary transition-colors"
            >
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}
