import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, Loader2 } from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { MOCK_CHATS } from '../data/mockChats';
import { callClaude, suggestReplies } from '../api/claude';
import Avatar from '../components/ui/Avatar';
import PageTransition from '../components/layout/PageTransition';

const AI_SYSTEM_PROMPT = `You are CampusVibe AI, a helpful and chill campus assistant for Indian college students. You speak in a friendly, casual tone and can mix Hindi and English naturally (Hinglish). You know about campus food spots, college life, trending discussions, and can help students with recommendations, writing posts, and general campus queries. Keep responses short, fun, and helpful. Use emojis naturally but don't overdo it. You're like that one senior who knows everything about campus.`;

const MOCK_REPLIES = [
  "Haha sahi hai! 😂",
  "Bro same here, totally feel you",
  "Arey nice! Let me know how it goes",
  "Definitely, let's plan something",
  "Sounds good! See you there 👍",
  "Lol that's so relatable 😭",
  "Yaar main bhi try karunga",
];

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isAI = userId === 'ai_assistant';
  const otherUser = isAI ? null : MOCK_USERS.find(u => u.id === userId);

  const existingChat = MOCK_CHATS.find(c => c.participantId === userId);
  const [messages, setMessages] = useState(existingChat?.messages || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [smartReplies, setSmartReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const scrollRef = useRef(null);
  const apiKey = localStorage.getItem('campusvibe_api_key');

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isAI || !apiKey || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.senderId === 'me') {
      setSmartReplies([]);
      return;
    }

    let cancelled = false;
    setRepliesLoading(true);
    const convo = messages.map(m => ({ fromMe: m.senderId === 'me', text: m.text }));
    suggestReplies(convo, apiKey)
      .then(raw => {
        if (cancelled || !raw) return;
        const match = raw.match(/\[[\s\S]*\]/);
        if (!match) return;
        try {
          const arr = JSON.parse(match[0]);
          if (Array.isArray(arr)) setSmartReplies(arr.filter(s => typeof s === 'string').slice(0, 3));
        } catch {}
      })
      .finally(() => { if (!cancelled) setRepliesLoading(false); });

    return () => { cancelled = true; };
  }, [messages, isAI, apiKey]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: `msg_${Date.now()}`, senderId: 'me', text: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (isAI) {
      setLoading(true);
      try {
        const reply = await callClaude(AI_SYSTEM_PROMPT, input.trim(), apiKey);
        const aiMsg = { id: `msg_${Date.now() + 1}`, senderId: 'ai_assistant', text: reply || "Oops, AI is taking a break! Try again in a bit 😅", timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, aiMsg]);
      } catch {
        setMessages(prev => [...prev, { id: `msg_${Date.now() + 1}`, senderId: 'ai_assistant', text: "Connection hiccup! Try again? 🔄", timestamp: new Date().toISOString() }]);
      }
      setLoading(false);
    } else {
      setTimeout(() => {
        const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
        setMessages(prev => [...prev, { id: `msg_${Date.now() + 1}`, senderId: userId, text: reply, timestamp: new Date().toISOString() }]);
      }, 1500 + Math.random() * 2000);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => navigate('/chat')} className="p-1" aria-label="Back to chats">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          {isAI ? (
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
          ) : (
            <Avatar avatarId={otherUser?.avatar} imageUrl={otherUser?.imageUrl} size="md" online />
          )}
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm truncate ${isAI ? 'text-accent' : 'text-text-primary'}`}>
              {isAI ? 'CampusVibe AI' : otherUser?.name || 'User'}
            </p>
            <p className="text-xs text-text-tertiary truncate">
              {isAI ? 'Your campus assistant' : otherUser?.college}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-label="Chat messages" aria-live="polite">
          {isAI && messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display font-bold text-text-primary mb-2">CampusVibe AI</h3>
              <p className="text-sm text-text-secondary mb-4">Ask me anything about campus life!</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Best places to eat near campus?", "Help me write a review", "What's trending today?"].map(q => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-text-secondary hover:border-accent/30 hover:text-text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isMine = msg.senderId === 'me';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[80%]">
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isMine
                      ? 'bg-accent text-primary rounded-br-md'
                      : 'bg-card border border-border text-text-primary rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-text-tertiary mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {loading && (
            <div className="flex justify-start" aria-label="Typing" role="status">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-text-tertiary typing-dot" />
                <div className="w-2 h-2 rounded-full bg-text-tertiary typing-dot" />
                <div className="w-2 h-2 rounded-full bg-text-tertiary typing-dot" />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Smart replies */}
        {!isAI && (smartReplies.length > 0 || repliesLoading) && (
          <div className="px-4 pt-2 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
            {repliesLoading && smartReplies.length === 0 ? (
              <div className="flex items-center gap-1.5 text-xs text-text-tertiary px-3 py-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Suggesting...</span>
              </div>
            ) : (
              smartReplies.map((reply, i) => (
                <motion.button
                  key={`${reply}-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setInput(reply); setSmartReplies([]); }}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-medium hover:bg-accent/15 active:scale-95 transition-all"
                >
                  <Sparkles className="w-3 h-3" /> {reply}
                </motion.button>
              ))
            )}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={isAI ? "Ask me anything..." : "Type a message..."}
              aria-label={isAI ? "Ask AI a question" : "Type a message"}
              className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
              aria-label="Send message"
            >
              {loading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Send className="w-5 h-5 text-primary" />}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
