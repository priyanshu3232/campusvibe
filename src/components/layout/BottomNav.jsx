import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User, MoreHorizontal, Star, Gamepad2, Trophy, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mainTabs = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/create', icon: PlusCircle, label: 'Create', isCenter: true },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const moreTabs = [
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/reviews', icon: Star, label: 'Reviews' },
  { path: '/games', icon: Gamepad2, label: 'Games' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isMoreActive = moreTabs.some(t => isActive(t.path));

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-20 left-4 right-4 z-50 glass-strong rounded-2xl p-3 md:hidden"
            >
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-sm font-semibold text-text-primary">More</span>
                <button onClick={() => setShowMore(false)} className="p-1 rounded-lg hover:bg-card" aria-label="Close menu">
                  <X className="w-4 h-4 text-text-tertiary" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {moreTabs.map(tab => {
                  const active = isActive(tab.path);
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.path}
                      onClick={() => { navigate(tab.path); setShowMore(false); }}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-colors ${
                        active ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-card'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.5} />
                      <span className="text-[10px] font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong md:hidden" role="navigation" aria-label="Bottom navigation">
        <div className="flex items-center justify-around h-16 px-2 pb-safe max-w-lg mx-auto">
          {mainTabs.map((tab, idx) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;

            if (tab.isCenter) {
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="relative -mt-6 flex items-center justify-center w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/30 active:scale-90 transition-transform"
                  aria-label="Create post"
                >
                  <Icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
                  {/* Ripple ring */}
                  <span className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping opacity-20" />
                </button>
              );
            }

            // Replace last tab with More button on mobile
            if (idx === mainTabs.length - 1) {
              return (
                <div key="profile-more" className="flex items-center">
                  <button
                    onClick={() => navigate(tab.path)}
                    className="relative flex flex-col items-center justify-center w-12 h-full gap-0.5 active:scale-90 transition-transform"
                    aria-label={tab.label}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors ${active ? 'text-accent' : 'text-text-tertiary'}`}
                      strokeWidth={active ? 2.5 : 1.5}
                    />
                    <span className={`text-[10px] font-medium transition-colors ${active ? 'text-accent' : 'text-text-tertiary'}`}>
                      {tab.label}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -bottom-0 w-1 h-1 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                </div>
              );
            }

            return (
              <button
                key={tab.path}
                onClick={() => tab.path === '/chat' ? navigate(tab.path) : navigate(tab.path)}
                className="relative flex flex-col items-center justify-center w-16 h-full gap-0.5 active:scale-90 transition-transform"
                aria-label={tab.label}
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${active ? 'text-accent' : 'text-text-tertiary'}`}
                  strokeWidth={active ? 2.5 : 1.5}
                />
                <span className={`text-[10px] font-medium transition-colors ${active ? 'text-accent' : 'text-text-tertiary'}`}>
                  {idx === 3 ? (
                    // Show "More" instead of "Chat" at position 3 - actually keep chat, add more as tooltip
                    tab.label
                  ) : tab.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-0 w-1 h-1 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`relative flex flex-col items-center justify-center w-12 h-full gap-0.5 active:scale-90 transition-transform ${
              isMoreActive || showMore ? 'text-accent' : ''
            }`}
            aria-label="More options"
            aria-expanded={showMore}
          >
            <MoreHorizontal
              className={`w-6 h-6 transition-colors ${isMoreActive || showMore ? 'text-accent' : 'text-text-tertiary'}`}
              strokeWidth={isMoreActive ? 2.5 : 1.5}
            />
            <span className={`text-[10px] font-medium transition-colors ${isMoreActive || showMore ? 'text-accent' : 'text-text-tertiary'}`}>
              More
            </span>
            {isMoreActive && (
              <motion.div
                layoutId="bottomNavMore"
                className="absolute -bottom-0 w-1 h-1 rounded-full bg-accent"
              />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
