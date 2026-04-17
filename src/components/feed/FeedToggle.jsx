import { motion } from 'framer-motion';
import { Globe, School } from 'lucide-react';

export default function FeedToggle({ activeTab, onTabChange }) {
  return (
    <div className="relative flex bg-card/60 rounded-full p-1 mx-4 mb-5">
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-gradient-to-br from-accent to-[#a8d84f] shadow-[0_0_20px_rgba(200,245,96,0.25)]"
        layoutId="feedToggle"
        animate={{ left: activeTab === 'global' ? '4px' : '50%', width: 'calc(50% - 4px)' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      <button
        onClick={() => onTabChange('global')}
        className={`flex-1 py-2.5 text-sm font-display font-bold rounded-full relative z-10 flex items-center justify-center gap-2 transition-colors ${
          activeTab === 'global' ? 'text-primary' : 'text-text-secondary'
        }`}
      >
        <Globe className="w-4 h-4" strokeWidth={2.2} /> Global
      </button>
      <button
        onClick={() => onTabChange('college')}
        className={`flex-1 py-2.5 text-sm font-display font-bold rounded-full relative z-10 flex items-center justify-center gap-2 transition-colors ${
          activeTab === 'college' ? 'text-primary' : 'text-text-secondary'
        }`}
      >
        <School className="w-4 h-4" strokeWidth={2.2} /> My College
      </button>
    </div>
  );
}
