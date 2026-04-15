import { motion } from 'framer-motion';

export default function FeedToggle({ activeTab, onTabChange }) {
  return (
    <div className="relative flex bg-card rounded-xl p-1 mx-4 mb-4">
      <motion.div
        className="absolute top-1 bottom-1 rounded-lg bg-accent"
        layoutId="feedToggle"
        animate={{ left: activeTab === 'global' ? '4px' : '50%', width: 'calc(50% - 4px)' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      <button
        onClick={() => onTabChange('global')}
        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors ${
          activeTab === 'global' ? 'text-primary' : 'text-text-secondary'
        }`}
      >
        🌍 Global
      </button>
      <button
        onClick={() => onTabChange('college')}
        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors ${
          activeTab === 'college' ? 'text-primary' : 'text-text-secondary'
        }`}
      >
        🏫 My College
      </button>
    </div>
  );
}
