import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, MessageSquarePlus, UserSearch, Users } from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { MOCK_CHATS } from '../data/mockChats';
import { formatTime } from '../utils/formatTime';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/layout/PageTransition';

export default function Chat() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const enriched = useMemo(() => {
    return MOCK_CHATS.map((chat, idx) => {
      const isAI = chat.participantId === 'ai_assistant';
      const participant = isAI ? null : MOCK_USERS.find(u => u.id === chat.participantId);
      const lastMsg = chat.messages[chat.messages.length - 1];
      const unread = idx === 0 ? 2 : 0;
      const online = idx % 3 === 0;
      const stale = idx >= 4;
      return { ...chat, participant, isAI, lastMsg, unread, online, stale };
    });
  }, []);

  const ai = useMemo(() => enriched.find(c => c.isAI), [enriched]);
  const conversations = useMemo(
    () => enriched.filter(c => !c.isAI),
    [enriched]
  );

  const filtered = useMemo(() => {
    if (!search) return conversations;
    return conversations.filter(c => {
      const name = c.participant?.name || '';
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [conversations, search]);

  const onAnonymousClick = () => {
    navigate('/chat/anonymous');
  };

  return (
    <PageTransition>
      <div className="pt-2 px-4 pb-4">
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search vibes..."
            className="w-full bg-card border-0 rounded-xl pl-12 pr-4 py-3.5 text-text-primary placeholder:text-text-tertiary outline-none focus:ring-2 focus:ring-accent/60 transition-all"
            aria-label="Search conversations"
          />
        </div>

        {ai && !search && (
          <button
            onClick={() => navigate('/chat/ai_assistant')}
            className="relative w-full mb-8 p-5 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-card border border-accent-purple/20 overflow-hidden text-left hover:border-accent-purple/40 transition-all"
          >
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-8 w-32 h-32 bg-accent-purple/15 blur-3xl rounded-full"
            />
            <div className="relative flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-accent-purple to-accent">
                  <div className="w-full h-full rounded-full bg-card-alt flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 bg-accent text-primary p-1 rounded-full shadow-lg">
                  <Sparkles className="w-3 h-3 fill-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-display font-bold text-accent-purple">CampusVibe AI</h3>
                  <span className="text-[10px] font-medium text-accent-purple/70 uppercase tracking-widest shrink-0">
                    Always Active
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate mt-0.5">
                  "{ai.lastMsg?.text || 'Ask me anything about your campus life'}"
                </p>
              </div>
            </div>
          </button>
        )}

        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text-tertiary px-2 mb-3">
          {search ? 'Results' : 'Recent Vibes'}
        </h2>

        {filtered.length === 0 ? (
          <EmptyState
            type="messages"
            title={search ? 'No matches' : 'No conversations'}
            message={search ? `Nothing found for "${search}"` : 'Start chatting with your campus mates!'}
          />
        ) : (
          <div className="space-y-1" role="list" aria-label="Conversations">
            <button
              onClick={onAnonymousClick}
              className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-card/60 transition-colors text-left active:scale-[0.98]"
              role="listitem"
            >
              <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                <UserSearch className="w-6 h-6 text-accent-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <h4 className="font-display font-semibold text-accent-purple truncate">
                    Anonymous Senior
                  </h4>
                  <span className="text-[10px] font-bold text-accent-purple shrink-0">New</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-sm italic font-medium text-text-primary truncate">
                    Keep it a secret, but the quiz is canceled.
                  </p>
                  <div className="w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_10px_rgba(179,136,255,0.6)] shrink-0" />
                </div>
              </div>
            </button>

            {filtered.map((chat, i) => (
              <ChatRow
                key={chat.id}
                chat={chat}
                delay={i * 0.04}
                onOpen={() => navigate(`/chat/${chat.participantId}`)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-24 right-6 z-30 md:hidden">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/chat/ai_assistant')}
          aria-label="New conversation"
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-[#a8d84f] text-primary flex items-center justify-center shadow-[0_10px_30px_rgba(200,245,96,0.3)]"
        >
          <MessageSquarePlus className="w-6 h-6" strokeWidth={2.5} />
        </motion.button>
      </div>
    </PageTransition>
  );
}

function ChatRow({ chat, delay, onOpen }) {
  const isGroup = chat.participant?.isGroup;
  const name = chat.participant?.name || 'Unknown';
  const preview = chat.lastMsg?.senderId === 'me' ? `You: ${chat.lastMsg.text}` : chat.lastMsg?.text;

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onOpen}
      role="listitem"
      className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-card/60 transition-colors text-left active:scale-[0.98]"
    >
      <div className={`relative shrink-0 ${chat.stale ? 'grayscale opacity-60' : ''}`}>
        {isGroup ? (
          <div className="w-14 h-14 rounded-xl bg-accent-warm/10 border border-accent-warm/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-accent-warm" />
          </div>
        ) : (
          <Avatar avatarId={chat.participant?.avatar} imageUrl={chat.participant?.imageUrl} size="lg" />
        )}
        {chat.online && !chat.stale && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-accent border-[3px] border-primary" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-0.5">
          <h4
            className={`font-display font-semibold truncate ${
              chat.stale ? 'text-text-tertiary' : 'text-text-primary'
            }`}
          >
            {name}
          </h4>
          <span
            className={`text-[10px] font-bold shrink-0 ml-2 ${
              chat.unread > 0 ? 'text-accent' : 'text-text-tertiary uppercase tracking-wider'
            }`}
          >
            {chat.lastMsg ? formatTime(chat.lastMsg.timestamp) : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p
            className={`flex-1 text-sm truncate ${
              chat.unread > 0
                ? 'text-text-primary font-semibold'
                : chat.stale
                  ? 'text-text-tertiary'
                  : 'text-text-secondary'
            }`}
          >
            {preview}
          </p>
          {chat.unread > 0 && (
            <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-primary text-[10px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(200,245,96,0.4)]">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
