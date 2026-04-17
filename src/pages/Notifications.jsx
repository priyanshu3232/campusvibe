import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  UserPlus,
  MessageCircle,
  ThumbsUp,
  Flame,
  Lock,
  Megaphone,
  Trophy,
  ArrowUp,
  Gamepad2,
  Bell,
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import { formatTime } from '../utils/formatTime';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/layout/PageTransition';

const TYPE_META = {
  like: {
    Icon: Heart,
    badgeBg: 'bg-accent',
    badgeText: 'text-primary',
    iconFill: true,
  },
  follow: {
    Icon: UserPlus,
    badgeBg: 'bg-accent-purple',
    badgeText: 'text-white',
    iconFill: false,
  },
  comment: {
    Icon: MessageCircle,
    badgeBg: 'bg-accent-warm',
    badgeText: 'text-primary',
    iconFill: true,
  },
  level_up: {
    Icon: ArrowUp,
    badgeBg: 'bg-accent',
    badgeText: 'text-primary',
    iconFill: false,
  },
  leaderboard: {
    Icon: Trophy,
    badgeBg: 'bg-accent-warm',
    badgeText: 'text-primary',
    iconFill: true,
  },
  game: {
    Icon: Gamepad2,
    badgeBg: 'bg-accent-purple',
    badgeText: 'text-white',
    iconFill: false,
  },
};

function groupByDate(notifications) {
  const groups = { Today: [], Yesterday: [], 'Earlier this week': [] };
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach(notif => {
    const date = new Date(notif.timestamp);
    let key;
    if (date >= today) key = 'Today';
    else if (date >= yesterday) key = 'Yesterday';
    else key = 'Earlier this week';
    groups[key].push(notif);
  });

  return groups;
}

function isConfessionNotif(notif) {
  return /confession/i.test(notif.text);
}

function isTrendingNotif(notif) {
  return /trending|moved up|top \d/i.test(notif.text);
}

function isSystemNotif(notif) {
  return /system|update|achievement|unlocked|reset/i.test(notif.text);
}

export default function Notifications() {
  const navigate = useNavigate();
  const [readIds, setReadIds] = useState(new Set());
  const groups = useMemo(() => groupByDate(MOCK_NOTIFICATIONS), []);

  const isRead = (notif) => notif.read || readIds.has(notif.id);
  const todayUnread = groups.Today.filter(n => !isRead(n)).length;

  const handleClick = (notif) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(notif.id);
      return next;
    });
    if (notif.postId) navigate('/home');
    else if (notif.userId) navigate(`/profile/${notif.userId}`);
    else if (notif.type === 'leaderboard') navigate('/leaderboard');
    else if (notif.type === 'game') navigate('/games');
  };

  if (MOCK_NOTIFICATIONS.length === 0) {
    return (
      <PageTransition>
        <div className="px-4 pt-4">
          <h2 className="font-display font-bold text-4xl tracking-tight mb-8">The Feed</h2>
          <EmptyState
            icon={Bell}
            title="All caught up!"
            message="No notifications yet. Interact with your campus to get started."
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="px-4 pt-4 pb-4">
        <header className="mb-8">
          <h2 className="font-display font-bold text-4xl tracking-[-0.02em] text-text-primary">
            The Feed
          </h2>
          <p className="text-text-secondary text-sm mt-1">Don't miss the campus pulse.</p>
        </header>

        {groups.Today.length > 0 && (
          <NotifSection
            label="Today"
            labelColor="text-accent-purple"
            countBadge={todayUnread > 0 ? `${todayUnread} New` : null}
          >
            {groups.Today.map((notif, i) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                read={isRead(notif)}
                delay={i * 0.04}
                onClick={() => handleClick(notif)}
                tier="today"
              />
            ))}
          </NotifSection>
        )}

        {groups.Yesterday.length > 0 && (
          <NotifSection label="Yesterday" labelColor="text-text-tertiary">
            {groups.Yesterday.map((notif, i) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                read={isRead(notif)}
                delay={i * 0.04}
                onClick={() => handleClick(notif)}
                tier="yesterday"
              />
            ))}
          </NotifSection>
        )}

        {groups['Earlier this week'].length > 0 && (
          <NotifSection label="Earlier this week" labelColor="text-text-tertiary">
            <div className="opacity-60">
              {groups['Earlier this week'].map((notif, i) => (
                <NotifCard
                  key={notif.id}
                  notif={notif}
                  read={isRead(notif)}
                  delay={i * 0.04}
                  onClick={() => handleClick(notif)}
                  tier="earlier"
                />
              ))}
            </div>
          </NotifSection>
        )}
      </div>
    </PageTransition>
  );
}

function NotifSection({ label, labelColor, countBadge, children }) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className={`font-display text-xs uppercase font-black tracking-[0.2em] ${labelColor}`}>
          {label}
        </h3>
        {countBadge && (
          <span className="text-[10px] bg-accent-purple/10 text-accent-purple px-2 py-0.5 rounded-full border border-accent-purple/20 font-bold">
            {countBadge}
          </span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function NotifCard({ notif, read, delay, onClick, tier }) {
  const isConfession = isConfessionNotif(notif);
  const isTrending = isTrendingNotif(notif);
  const isSystem = isSystemNotif(notif);

  if (isConfession) {
    return <ConfessionCard notif={notif} delay={delay} onClick={onClick} />;
  }
  if (isTrending) {
    return <TrendingCard notif={notif} delay={delay} onClick={onClick} />;
  }
  if (isSystem) {
    return <SystemCard notif={notif} delay={delay} onClick={onClick} />;
  }

  return <StandardCard notif={notif} read={read} delay={delay} onClick={onClick} tier={tier} />;
}

function StandardCard({ notif, read, delay, onClick, tier }) {
  const meta = TYPE_META[notif.type] || TYPE_META.like;
  const Icon = meta.Icon;
  const staleStyles = tier === 'yesterday' && read ? 'bg-card-alt/40 grayscale opacity-80' : '';
  const baseBg = tier === 'today' ? 'bg-card' : 'bg-card/80';
  const isBold = !read && tier === 'today';

  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`w-full text-left rounded-xl p-4 flex items-center gap-4 transition-colors hover:bg-card-alt/60 ${baseBg} ${staleStyles}`}
    >
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-card-alt border-2 border-accent/10 flex items-center justify-center text-2xl">
          {notif.icon}
        </div>
        <div
          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-card ${meta.badgeBg} ${meta.badgeText}`}
        >
          <Icon className={`w-3 h-3 ${meta.iconFill ? 'fill-current' : ''}`} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${isBold ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
          {notif.text}
        </p>
        <p className="text-[10px] text-text-tertiary mt-1 font-medium">{formatTime(notif.timestamp)}</p>
      </div>
      {!read && tier === 'today' && (
        <span
          className="shrink-0 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(200,245,96,0.8)]"
          aria-label="Unread"
        />
      )}
    </motion.button>
  );
}

function ConfessionCard({ notif, delay, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="relative w-full text-left bg-card/80 rounded-xl p-4 flex items-center gap-4 border border-border/40 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/10 blur-3xl -mr-8 -mt-8"
      />
      <div className="relative shrink-0 w-12 h-12 rounded-full bg-accent-purple/15 flex items-center justify-center text-accent-purple">
        <Lock className="w-5 h-5 fill-accent-purple" />
      </div>
      <div className="flex-1 relative z-10 min-w-0">
        <p className="text-sm leading-snug text-text-primary">
          A new{' '}
          <span className="font-bold text-accent-purple">Anonymous Confession</span>{' '}
          was posted in your hostel block.
        </p>
        <p className="text-[10px] text-text-tertiary mt-1 font-medium">
          {formatTime(notif.timestamp)}
        </p>
      </div>
    </motion.button>
  );
}

function TrendingCard({ notif, delay, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="w-full text-left bg-gradient-to-r from-accent-warm/15 to-transparent rounded-xl p-4 flex items-center gap-4 border-l-2 border-accent-warm"
    >
      <div className="shrink-0 w-12 h-12 rounded-full bg-accent-warm/10 flex items-center justify-center text-accent-warm">
        <Flame className="w-5 h-5 fill-accent-warm" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug text-text-primary">{notif.text}</p>
        <p className="text-[10px] text-text-tertiary mt-1 font-medium">{formatTime(notif.timestamp)}</p>
      </div>
    </motion.button>
  );
}

function SystemCard({ notif, delay, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="w-full text-left bg-card-alt/40 rounded-xl p-4 flex items-center gap-4"
    >
      <div className="shrink-0 w-12 h-12 rounded-full bg-card-alt flex items-center justify-center text-text-secondary">
        <Megaphone className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug text-text-primary">{notif.text}</p>
        <p className="text-[10px] text-text-tertiary mt-1 font-medium">{formatTime(notif.timestamp)}</p>
      </div>
    </motion.button>
  );
}
