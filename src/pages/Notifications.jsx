import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCheck, Bell } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import { formatTime, formatDate } from '../utils/formatTime';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/layout/PageTransition';

function groupByDate(notifications) {
  const groups = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach(notif => {
    const date = new Date(notif.timestamp);
    let key;
    if (date >= today) key = 'Today';
    else if (date >= yesterday) key = 'Yesterday';
    else if (date >= weekAgo) key = 'This Week';
    else key = 'Earlier';

    if (!groups[key]) groups[key] = [];
    groups[key].push(notif);
  });

  return groups;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [readAll, setReadAll] = useState(false);
  const groups = useMemo(() => groupByDate(MOCK_NOTIFICATIONS), []);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <PageTransition>
      <div className="pt-2 px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-lg text-text-primary">Notifications</h2>
            {!readAll && unreadCount > 0 && (
              <p className="text-xs text-text-tertiary">{unreadCount} unread</p>
            )}
          </div>
          {!readAll && unreadCount > 0 && (
            <button
              onClick={() => setReadAll(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
              aria-label="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {MOCK_NOTIFICATIONS.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="All caught up!"
            message="No notifications yet. Interact with your campus to get started."
          />
        ) : (
          Object.entries(groups).map(([label, notifs]) => (
            <div key={label} className="mb-5">
              <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wider mb-2">{label}</p>
              <div className="space-y-0.5">
                {notifs.map((notif, i) => {
                  const isRead = readAll || notif.read;
                  return (
                    <motion.button
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => {
                        if (notif.postId) navigate(`/home`);
                        else if (notif.userId) navigate(`/profile/${notif.userId}`);
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left ${
                        !isRead ? 'bg-card border border-accent/10' : 'hover:bg-card/50'
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{notif.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!isRead ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>{notif.text}</p>
                        <p className="text-xs text-text-tertiary mt-0.5">{formatTime(notif.timestamp)}</p>
                      </div>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" aria-label="Unread" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </PageTransition>
  );
}
