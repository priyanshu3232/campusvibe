import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getLevel } from '../utils/credSystem';
import Avatar from '../components/ui/Avatar';
import CollegeLogo from '../components/ui/CollegeLogo';
import PageTransition from '../components/layout/PageTransition';

export default function Leaderboard() {
  const { user } = useAuth();
  const { credScore } = useGame();
  const [tab, setTab] = useState('college');
  const [timeframe, setTimeframe] = useState('week');

  const rankings = useMemo(() => {
    let users = [...MOCK_USERS];
    if (tab === 'college') {
      users = users.filter(u => u.college === user?.college);
    }
    users.sort((a, b) => b.credScore - a.credScore);
    return users.map((u, i) => ({ ...u, rank: i + 1, change: [1, 0, -1, 2, 0, -1, 1, 0, -2, 1][i % 10] }));
  }, [tab, user?.college]);

  const myRank = useMemo(() => {
    const myScore = credScore || user?.credScore || 0;
    const above = rankings.filter(u => u.credScore > myScore).length;
    return above + 1;
  }, [rankings, credScore, user?.credScore]);

  const podiumOrder = [1, 0, 2];
  const podiumHeights = ['h-28', 'h-22', 'h-18'];
  const podiumSizes = ['w-18 h-18 text-4xl', 'w-15 h-15 text-3xl', 'w-13 h-13 text-2xl'];

  return (
    <PageTransition>
      <div className="pt-2 px-4">
        <h2 className="font-display font-bold text-lg text-text-primary mb-4">Leaderboard</h2>

        {/* Tabs */}
        <div className="flex bg-card rounded-xl p-1 mb-4">
          {[{ id: 'college', label: 'My College' }, { id: 'global', label: 'All India' }].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === t.id ? 'bg-accent text-primary' : 'text-text-secondary'}`}
            >
              {t.id === 'college' ? '🏫' : '🌍'} {t.label}
            </button>
          ))}
        </div>

        {/* Timeframe */}
        <div className="flex gap-2 mb-6">
          {[{ id: 'week', label: 'This Week' }, { id: 'month', label: 'This Month' }, { id: 'all', label: 'All Time' }].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${timeframe === t.id ? 'bg-accent/15 text-accent border border-accent/40' : 'text-text-tertiary hover:text-text-secondary'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-3 mb-8">
          {rankings.slice(0, 3).map((u, i) => {
            const level = getLevel(u.credScore);
            const idx = podiumOrder[i];
            const ringColors = ['ring-accent-warm', 'ring-gray-400', 'ring-amber-600'];
            const bgColors = ['bg-accent-warm/20', 'bg-gray-400/10', 'bg-amber-600/10'];
            const textColors = ['text-accent-warm', 'text-gray-300', 'text-amber-600'];
            const heights = ['h-28', 'h-22', 'h-18'];
            const medals = ['🥇', '🥈', '🥉'];
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center"
                style={{ order: podiumOrder[i] }}
              >
                <div className="relative mb-1">
                  <Avatar avatarId={u.avatar} size={idx === 0 ? 'lg' : 'md'} showRing ringColor={idx === 0 ? 'accent-warm' : idx === 1 ? 'gray-400' : 'amber-600'} />
                  <span className="absolute -top-1 -right-1 text-lg">{medals[idx]}</span>
                </div>
                <p className="text-xs font-semibold text-text-primary truncate max-w-[80px]">{u.name.split(' ')[0]}</p>
                <p className="text-xs text-text-tertiary">{level?.emoji} {u.credScore}</p>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ delay: idx * 0.15 + 0.3, duration: 0.5 }}
                  className={`w-20 ${heights[idx]} rounded-t-xl mt-2 flex items-center justify-center ${bgColors[idx]}`}
                >
                  <span className={`text-2xl font-display font-bold ${textColors[idx]}`}>#{idx + 1}</span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Full List */}
        <div className="space-y-1">
          {rankings.slice(3).map((u, i) => {
            const level = getLevel(u.credScore);
            const RankIcon = u.change > 0 ? TrendingUp : u.change < 0 ? TrendingDown : Minus;
            const rankColor = u.change > 0 ? 'text-success' : u.change < 0 ? 'text-accent-danger' : 'text-text-tertiary';
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (i + 3) * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-card transition-colors"
              >
                <span className="w-6 text-sm font-bold text-text-tertiary text-center">#{u.rank}</span>
                <RankIcon className={`w-3 h-3 ${rankColor}`} />
                <Avatar avatarId={u.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{u.name}</p>
                  <p className="text-xs text-text-tertiary truncate flex items-center gap-1"><CollegeLogo domain={u.collegeDomain} size="xs" />{u.college}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent">{u.credScore}</p>
                  <p className="text-xs text-text-tertiary">{level?.emoji} {level?.name}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* My Rank Sticky */}
        <div className="sticky bottom-20 md:bottom-4 mt-4 p-3 rounded-xl glass-strong border border-accent/30 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-accent" />
          <span className="text-sm text-text-primary font-medium">Your rank: <span className="text-accent font-bold">#{myRank}</span></span>
          <span className="text-xs text-text-tertiary ml-auto">{credScore || user?.credScore || 0} Cred</span>
        </div>
      </div>
    </PageTransition>
  );
}
