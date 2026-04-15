import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Edit } from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { MOCK_CHATS } from '../data/mockChats';
import { formatTime } from '../utils/formatTime';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/layout/PageTransition';

export default function Chat() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const chats = useMemo(() => {
    return MOCK_CHATS.map(chat => {
      const isAI = chat.participantId === 'ai_assistant';
      const participant = isAI ? null : MOCK_USERS.find(u => u.id === chat.participantId);
      const lastMsg = chat.messages[chat.messages.length - 1];
      return { ...chat, participant, isAI, lastMsg };
    }).filter(chat => {
      if (!search) return true;
      const name = chat.isAI ? 'CampusVibe AI' : chat.participant?.name || '';
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  return (
    <PageTransition>
      <div className="pt-2 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-text-primary">Messages</h2>
          <button
            onClick={() => navigate('/chat/ai_assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
            aria-label="New AI chat"
          >
            <Edit className="w-3.5 h-3.5" /> New
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-input border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all"
            aria-label="Search conversations"
          />
        </div>

        {chats.length === 0 ? (
          <EmptyState type="messages" title="No conversations" message="Start chatting with your campus mates or the AI assistant!" />
        ) : (
          <div className="space-y-0.5" role="list" aria-label="Conversations">
            {chats.map((chat, i) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/chat/${chat.participantId}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-card transition-colors text-left"
                role="listitem"
              >
                {chat.isAI ? (
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-accent" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-primary" />
                  </div>
                ) : (
                  <Avatar avatarId={chat.participant?.avatar} size="lg" online={i < 3} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm truncate ${chat.isAI ? 'text-accent' : 'text-text-primary'}`}>
                      {chat.isAI ? 'CampusVibe AI' : chat.participant?.name}
                    </span>
                    <span className="text-xs text-text-tertiary shrink-0 ml-2">
                      {chat.lastMsg && formatTime(chat.lastMsg.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {chat.lastMsg?.senderId === 'me' ? 'You: ' : ''}{chat.lastMsg?.text}
                  </p>
                </div>
                {chat.isAI && (
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
