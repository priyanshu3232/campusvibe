import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getLevel } from '../utils/credSystem';
import Avatar from '../components/ui/Avatar';
import PageTransition from '../components/layout/PageTransition';

const TIMEFRAMES = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

function formatPts(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return n.toLocaleString();
}

export default function Leaderboard() {
  const { user } = useAuth();
  const { credScore } = useGame();
  const [tab, setTab] = useState('college');
  const [timeframe, setTimeframe] = useState('month');

  const rankings = useMemo(() => {
    let users = [...MOCK_USERS];
    if (tab === 'college') {
      users = users.filter(u => u.college === user?.college);
    }
    users.sort((a, b) => b.credScore - a.credScore);
    const deltas = [1, 0, -1, 2, 0, -1, 1, 0, -2, 5, 3, -3, 0, 1];
    return users.map((u, i) => ({ ...u, rank: i + 1, change: deltas[i % deltas.length] }));
  }, [tab, user?.college]);

  const myScore = credScore || user?.credScore || 0;
  const myRank = useMemo(() => {
    const above = rankings.filter(u => u.credScore > myScore).length;
    return above + 1;
  }, [rankings, myScore]);

  const total = rankings.length || 1;
  const myPercentile = Math.max(1, Math.round((myRank / total) * 100));

  const topThree = rankings.slice(0, 3);
  const [first, second, third] = topThree;
  const rest = rankings.slice(3);

  return (
    <PageTransition>
      <div className="pt-3 px-4 pb-40">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex p-1 bg-card/80 rounded-full overflow-hidden">
            {[
              { id: 'college', label: 'My College' },
              { id: 'global', label: 'All India' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-3 text-sm font-display font-bold tracking-wider uppercase rounded-full transition-all ${
                  tab === t.id
                    ? 'bg-accent text-primary shadow-lg'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            {TIMEFRAMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-full border transition-all ${
                  timeframe === t.id
                    ? 'bg-accent/10 border-accent/40 text-accent shadow-[0_0_15px_rgba(200,245,96,0.1)]'
                    : 'bg-card border-border text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {topThree.length >= 3 && (
          <div className="relative flex items-end justify-center gap-2 h-64 mb-12">
            <PodiumCol
              user={second}
              rank={2}
              color="purple"
              barHeight="h-28"
              avatarSize="md"
              delay={0.15}
            />
            <PodiumCol
              user={first}
              rank={1}
              color="lime"
              barHeight="h-40"
              avatarSize="lg"
              delay={0}
              isFirst
            />
            <PodiumCol
              user={third}
              rank={3}
              color="warm"
              barHeight="h-20"
              avatarSize="md"
              delay={0.3}
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-text-tertiary px-2 mb-1">
            Campus Hustlers
          </h3>
          {rest.map((u, i) => {
            const ChangeIcon =
              u.change > 0 ? TrendingUp : u.change < 0 ? TrendingDown : Minus;
            const changeColor =
              u.change > 0
                ? 'text-accent'
                : u.change < 0
                  ? 'text-accent-danger'
                  : 'text-text-tertiary';
            const changeLabel =
              u.change > 0
                ? `↑ ${u.change} rank${u.change > 1 ? 's' : ''}`
                : u.change < 0
                  ? `↓ ${Math.abs(u.change)} rank${Math.abs(u.change) > 1 ? 's' : ''}`
                  : '— steady';
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-card-alt transition-colors"
              >
                <span className="w-6 font-display font-black italic text-text-tertiary">
                  {String(u.rank).padStart(2, '0')}
                </span>
                <Avatar avatarId={u.avatar} imageUrl={u.imageUrl} size="lg" className="ring-2 ring-border/40" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-text-primary truncate">{u.name}</p>
                  <p className="text-xs text-text-tertiary truncate">
                    {u.branch || 'B.Tech'} {u.year ? `· ${u.year} Year` : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-black text-text-primary">
                    {formatPts(u.credScore)}
                  </p>
                  <p
                    className={`text-[10px] uppercase font-bold tracking-tighter flex items-center justify-end gap-1 ${changeColor}`}
                  >
                    <ChangeIcon className="w-3 h-3" />
                    {changeLabel}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-24 md:bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-card-alt/95 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-30 border border-accent/20">
        <div className="w-10 h-10 bg-accent text-primary rounded-full flex items-center justify-center font-display font-black text-sm shrink-0">
          {myRank}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-accent uppercase tracking-widest">
            You are in Top {myPercentile}%
          </p>
          <p className="text-sm font-bold text-text-primary truncate">
            Your Rank: {myRank}
            <span className="text-text-tertiary font-medium">
              {' '}
              ({formatPts(myScore)} pts)
            </span>
          </p>
        </div>
        <button className="bg-accent/20 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-tighter hover:bg-accent hover:text-primary transition-all shrink-0">
          Boost
        </button>
      </div>
    </PageTransition>
  );
}

function PodiumCol({ user, rank, color, barHeight, avatarSize, delay, isFirst }) {
  const ringColor = {
    lime: 'border-accent',
    purple: 'border-accent-purple',
    warm: 'border-accent-warm',
  }[color];
  const badgeBg = {
    lime: 'bg-accent text-primary',
    purple: 'bg-accent-purple text-white',
    warm: 'bg-accent-warm text-primary',
  }[color];
  const gradientFrom = {
    lime: 'from-accent/30 to-accent/5',
    purple: 'from-accent-purple/30 to-accent-purple/5',
    warm: 'from-accent-warm/30 to-accent-warm/5',
  }[color];
  const nameColor = 'text-text-primary';
  const ptsColor = {
    lime: 'text-accent',
    purple: 'text-accent-purple',
    warm: 'text-accent-warm',
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="flex flex-col items-center w-1/3"
    >
      <div className={`relative ${isFirst ? 'mb-5' : 'mb-3'}`}>
        {isFirst && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-accent">
            <Crown className="w-7 h-7 fill-accent" />
          </div>
        )}
        <div
          className={`${isFirst ? 'w-24 h-24 shadow-[0_0_25px_rgba(200,245,96,0.3)]' : 'w-16 h-16'} rounded-full border-4 ${ringColor} p-1 overflow-hidden flex items-center justify-center bg-card-alt`}
        >
          <Avatar
            avatarId={user.avatar}
            imageUrl={user.imageUrl}
            size={avatarSize === 'lg' ? 'xl' : 'lg'}
            className="scale-100"
          />
        </div>
        <div
          className={`absolute -top-2 -right-1 ${isFirst ? 'w-9 h-9 text-base' : 'w-7 h-7 text-xs'} ${badgeBg} rounded-full flex items-center justify-center font-display font-black shadow-lg`}
        >
          {rank}
        </div>
      </div>
      <div
        className={`w-full ${barHeight} bg-gradient-to-t ${gradientFrom} rounded-t-2xl flex flex-col items-center pt-3 px-2 backdrop-blur-sm`}
      >
        <span
          className={`${nameColor} font-display font-bold text-center truncate max-w-full ${isFirst ? 'text-base' : 'text-sm'}`}
        >
          {user.name.split(' ')[0]} {user.name.split(' ')[1]?.[0] ? `${user.name.split(' ')[1][0]}.` : ''}
        </span>
        <span className={`${ptsColor} ${isFirst ? 'text-sm font-bold' : 'text-xs font-medium'}`}>
          {formatPts(user.credScore)} pts
        </span>
      </div>
    </motion.div>
  );
}
