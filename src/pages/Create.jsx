import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, School, Sparkles, Image, Send, Plus, Trash2, Loader2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import { useGame } from '../context/GameContext';
import { callClaude } from '../api/claude';
import PageTransition from '../components/layout/PageTransition';

const DRAFT_KEY = 'campusvibe_draft';
const MAX_CHARS = 500;

const postTypes = [
  { id: 'text', label: '📝 Post', placeholder: "What's on your mind?" },
  { id: 'poll', label: '📊 Poll', placeholder: 'Ask a question...' },
  { id: 'confession', label: '🎭 Confession', placeholder: 'Speak your heart out (posted anonymously)...' },
];

const aiOptions = [
  { id: 'improve', label: '✨ Improve my post', prompt: 'Improve this college student social media post. Keep it casual, fun, and Hinglish-friendly. Just return the improved text, nothing else.' },
  { id: 'hashtags', label: '✨ Add relevant hashtags', prompt: 'Add 3-5 relevant hashtags to this college student post. Return the original text with hashtags appended. Just return the text, nothing else.' },
  { id: 'funnier', label: '✨ Make it funnier', prompt: 'Make this college student post funnier while keeping the core message. Use humor that Indian college students would appreciate. Just return the improved text.' },
  { id: 'translate', label: '✨ Translate to Hinglish', prompt: 'Translate or mix this text into natural Hinglish (Hindi-English mix) that Indian college students speak. Just return the translated text.' },
];

export default function Create() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPost } = useFeed();
  const { earnCred } = useGame();
  const [type, setType] = useState('text');
  const [content, setContent] = useState('');
  const [isGlobal, setIsGlobal] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('24h');
  const [showImagePlaceholder, setShowImagePlaceholder] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const apiKey = localStorage.getItem('campusvibe_api_key');

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.content) setContent(draft.content);
        if (draft.type) setType(draft.type);
        if (draft.pollOptions) setPollOptions(draft.pollOptions);
        if (draft.isGlobal !== undefined) setIsGlobal(draft.isGlobal);
      }
    } catch {}
  }, []);

  // Auto-save draft on change
  useEffect(() => {
    if (!content.trim() && type === 'text') {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ content, type, pollOptions, isGlobal }));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, type, pollOptions, isGlobal]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setContent('');
    setType('text');
    setPollOptions(['', '']);
    setIsGlobal(true);
    setShowImagePlaceholder(false);
  };

  const handleAI = async (option) => {
    if (!content.trim()) return;
    setAiLoading(true);
    setShowAI(false);
    try {
      const result = await callClaude(option.prompt, content, apiKey);
      if (result) setContent(result);
    } catch {}
    setAiLoading(false);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    const post = {
      userId: 'user_me',
      type,
      content: content.trim(),
      tags: content.match(/#\w+/g)?.map(t => t.slice(1)) || [],
      isGlobal,
      image: null,
      ...(type === 'confession' && { collegeName: user?.college }),
      ...(type === 'poll' && {
        pollOptions: pollOptions.filter(o => o.trim()).map(text => ({ text, votes: 0 })),
        pollDuration,
      }),
    };
    addPost(post);
    earnCred(isGlobal ? 'post_global' : 'post_college');
    localStorage.removeItem(DRAFT_KEY);
    navigate('/home');
  };

  const currentType = postTypes.find(t => t.id === type);

  return (
    <PageTransition>
      <div className="px-4 pt-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-card transition-colors" aria-label="Go back">
            <X className="w-5 h-5 text-text-secondary" />
          </button>
          <div className="flex items-center gap-2">
            {draftSaved && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-text-tertiary"
              >
                Draft saved
              </motion.span>
            )}
            <h2 className="font-display font-bold text-lg text-text-primary">Create</h2>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-primary font-semibold text-sm disabled:opacity-50 active:scale-95 transition-all"
            aria-label="Publish post"
          >
            <Send className="w-4 h-4" /> Post
          </button>
        </div>

        {/* Type Selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar" role="radiogroup" aria-label="Post type">
          {postTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              role="radio"
              aria-checked={type === t.id}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                type === t.id ? 'bg-accent text-primary' : 'bg-card text-text-secondary border border-border'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Visibility */}
        <div className="flex gap-2 mb-4" role="radiogroup" aria-label="Post visibility">
          <button
            onClick={() => setIsGlobal(true)}
            role="radio"
            aria-checked={isGlobal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isGlobal ? 'bg-accent/15 text-accent border border-accent/40' : 'bg-card text-text-secondary border border-border'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Global
          </button>
          <button
            onClick={() => setIsGlobal(false)}
            role="radio"
            aria-checked={!isGlobal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !isGlobal ? 'bg-accent/15 text-accent border border-accent/40' : 'bg-card text-text-secondary border border-border'
            }`}
          >
            <School className="w-3.5 h-3.5" /> College Only
          </button>
        </div>

        {/* Text Area */}
        <div className="relative mb-2">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value.slice(0, MAX_CHARS))}
            placeholder={currentType?.placeholder}
            rows={6}
            aria-label="Post content"
            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all resize-none text-sm leading-relaxed"
          />
          {aiLoading && (
            <div className="absolute inset-0 bg-input/80 rounded-xl flex items-center justify-center">
              <div className="flex items-center gap-2 text-accent">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs ${content.length > MAX_CHARS * 0.9 ? 'text-accent-danger' : 'text-text-tertiary'}`}>
            {content.length}/{MAX_CHARS}
          </span>
          {content.trim() && (
            <button onClick={clearDraft} className="text-xs text-text-tertiary hover:text-accent-danger transition-colors">
              Clear draft
            </button>
          )}
        </div>

        {/* Image Placeholder */}
        <AnimatePresence>
          {showImagePlaceholder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 text-text-tertiary">
                <Image className="w-8 h-8" />
                <p className="text-sm font-medium">Image upload coming soon</p>
                <p className="text-xs">Drag & drop or tap to upload</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Poll Options */}
        {type === 'poll' && (
          <div className="space-y-2 mb-4">
            {pollOptions.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={opt}
                  onChange={e => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                  placeholder={`Option ${i + 1}`}
                  aria-label={`Poll option ${i + 1}`}
                  className="flex-1 bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all"
                />
                {pollOptions.length > 2 && (
                  <button onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))} className="p-2 text-text-tertiary hover:text-accent-danger" aria-label={`Remove option ${i + 1}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 4 && (
              <button
                onClick={() => setPollOptions([...pollOptions, ''])}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-accent font-medium hover:bg-accent/10 rounded-lg transition-colors"
                aria-label="Add poll option"
              >
                <Plus className="w-3.5 h-3.5" /> Add option
              </button>
            )}
            <div className="flex gap-2 mt-2" role="radiogroup" aria-label="Poll duration">
              {['6h', '12h', '24h', '48h'].map(d => (
                <button
                  key={d}
                  onClick={() => setPollDuration(d)}
                  role="radio"
                  aria-checked={pollDuration === d}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    pollDuration === d ? 'bg-accent text-primary' : 'bg-card text-text-secondary border border-border'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImagePlaceholder(!showImagePlaceholder)}
            className={`p-2.5 rounded-xl border text-text-secondary hover:text-text-primary transition-colors ${
              showImagePlaceholder ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-card border-border'
            }`}
            aria-label="Add image"
          >
            <Image className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowAI(!showAI)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
              aria-label="AI writing assist"
              aria-expanded={showAI}
            >
              <Sparkles className="w-4 h-4" /> AI Assist
            </button>
            <AnimatePresence>
              {showAI && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 mb-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-10"
                  role="menu"
                >
                  {aiOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleAI(option)}
                      disabled={!apiKey}
                      role="menuitem"
                      className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-card-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {option.label}
                    </button>
                  ))}
                  {!apiKey && (
                    <p className="px-4 py-2 text-xs text-accent-warm bg-accent-warm/10">Set API key in Settings to use AI</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {type === 'confession' && (
          <div className="mt-4 p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
            <p className="text-xs text-accent-purple">🎭 This will be posted anonymously. Only your college name will be shown.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
