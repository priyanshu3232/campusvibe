import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    kicker: 'Fuel the',
    accent: 'Campus',
    accentLine2: 'Noise.',
    description: 'The unfiltered pulse of your university. Events, secrets, and late-night vibes.',
    stat: { value: '2.4k+', label: 'Vibes Tonight' },
    avatars: ['🧑‍💻', '👩‍🎓', '🎸'],
    extra: '+12',
  },
  {
    kicker: 'Rate every',
    accent: 'Chai Stall',
    accentLine2: '& Corner.',
    description: 'From hostel mess to midnight maggi — review every spot near your campus.',
    stat: { value: '18k+', label: 'Places Rated' },
    avatars: ['🧑‍🎨', '👨‍🔬', '📚'],
    extra: '+48',
  },
  {
    kicker: 'Climb the',
    accent: 'Campus',
    accentLine2: 'Leaderboard.',
    description: 'Earn Campus Cred, win trivia, and become a legend on your campus.',
    stat: { value: '5.1k+', label: 'Players Live' },
    avatars: ['🎮', '🏃‍♂️', '👩‍💻'],
    extra: '+27',
  },
];

const AUTO_ADVANCE_MS = 6000;
const SPLASH_MS = 1800;

export default function Onboarding() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSplash) return;
    setProgress(0);
    const tick = 50;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentSlide(curr => (curr < slides.length - 1 ? curr + 1 : curr));
          return 0;
        }
        return prev + (100 / (AUTO_ADVANCE_MS / tick));
      });
    }, tick);
    return () => clearInterval(interval);
  }, [currentSlide, showSplash]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  const handleCTA = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  }, [currentSlide, goToSlide, navigate]);

  if (showSplash) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
        role="status"
        aria-label="Loading CampusVibe"
      >
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[420px] h-[420px] rounded-full bg-accent/10 blur-[120px]" />
        </div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 font-display italic font-black text-5xl text-accent tracking-tight"
        >
          CampusVibe
        </motion.h1>
      </div>
    );
  }

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <div className="min-h-screen flex flex-col px-6 pt-6 pb-8 relative overflow-hidden">
      <header className="relative z-10 flex items-center justify-between">
        <span className="font-display italic font-black text-xl text-accent tracking-tight">
          CampusVibe
        </span>
        <button
          onClick={() => navigate('/login')}
          className="text-text-secondary hover:text-text-primary font-medium text-sm transition-colors"
        >
          Skip
        </button>
      </header>

      <div className="relative flex-1 flex flex-col items-center justify-center text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            key={`glow-${currentSlide}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-[340px] h-[340px] rounded-full bg-accent/15 blur-[90px]"
          />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-accent/15" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 max-w-sm"
          >
            <h1 className="font-display font-black uppercase tracking-[-0.03em] leading-[0.92] mb-6">
              <span className="block text-[2.75rem] text-text-primary">{slide.kicker}</span>
              <span className="block text-[2.75rem] italic text-accent">{slide.accent}</span>
              <span className="block text-[2.75rem] italic text-accent">{slide.accentLine2}</span>
            </h1>
            <p className="text-text-secondary text-base leading-relaxed max-w-xs mx-auto">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`stat-${currentSlide}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 mb-6 bg-card/80 border border-border/60 rounded-2xl p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-display font-bold text-2xl text-accent leading-none mb-1">
              {slide.stat.value}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
              {slide.stat.label}
            </p>
          </div>
          <div className="flex items-center -space-x-2">
            {slide.avatars.map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-card-alt border-2 border-card flex items-center justify-center text-sm"
                aria-hidden="true"
              >
                {emoji}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-card flex items-center justify-center text-[10px] font-bold text-text-primary">
              {slide.extra}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div
        className="relative z-10 flex items-center gap-2 mb-5"
        role="tablist"
        aria-label="Onboarding slides"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            role="tab"
            aria-selected={i === currentSlide}
            aria-label={`Slide ${i + 1} of ${slides.length}`}
            className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === currentSlide ? '2.5rem' : '0.375rem' }}
          >
            <div
              className={`absolute inset-0 rounded-full ${
                i === currentSlide
                  ? 'bg-accent/25'
                  : i < currentSlide
                    ? 'bg-accent'
                    : 'bg-card-alt'
              }`}
            />
            {i === currentSlide && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent rounded-full"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleCTA}
        className="relative z-10 w-full py-[18px] rounded-full font-display font-black text-lg uppercase tracking-wide text-primary flex items-center justify-center gap-2 bg-gradient-to-br from-accent to-[#a8d84f] shadow-[0_10px_30px_-10px_rgba(200,245,96,0.55)]"
      >
        {isLast ? 'Get Started' : 'Get Started'}
        <ArrowRight className="w-5 h-5" strokeWidth={3} />
      </motion.button>
    </div>
  );
}
