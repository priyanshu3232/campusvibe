import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Globe,
  School,
  Zap,
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import { useGame } from '../context/GameContext';
import { callClaude } from '../api/claude';
import PageTransition from '../components/layout/PageTransition';

const DRAFT_KEY = 'campusvibe_draft';
const MAX_CHARS = 500;

const postTypes = [
  { id: 'text', emoji: '📝', label: 'Post', placeholder: "What's on your mind?" },
  { id: 'poll', emoji: '📊', label: 'Poll', placeholder: 'Ask a question...' },
  {
    id: 'confession',
    emoji: '🎭',
    label: 'Confession',
    placeholder: 'Share a secret anonymously...',
  },
];

const aiOptions = [
  {
    id: 'improve',
    label: '✨ Improve my post',
    prompt:
      'Improve this college student social media post. Keep it casual, fun, and Hinglish-friendly. Just return the improved text, nothing else.',
  },
  {
    id: 'hashtags',
    label: '✨ Add relevant hashtags',
    prompt:
      'Add 3-5 relevant hashtags to this college student post. Return the original text with hashtags appended. Just return the text, nothing else.',
  },
  {
    id: 'funnier',
    label: '✨ Make it funnier',
    prompt:
      'Make this college student post funnier while keeping the core message. Use humor that Indian college students would appreciate. Just return the improved text.',
  },
  {
    id: 'translate',
    label: '✨ Translate to Hinglish',
    prompt:
      'Translate or mix this text into natural Hinglish (Hindi-English mix) that Indian college students speak. Just return the translated text.',
  },
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

  useEffect(() => {
    if (!content.trim() && type === 'text') {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    const timer = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ content, type, pollOptions, isGlobal })
      );
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
  const isConfession = type === 'confession';
  const overLimit = content.length > MAX_CHARS * 0.9;

  return (
    <PageTransition>
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <X className="w-7 h-7" />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="font-display font-bold text-xl text-text-primary tracking-tight">
              Create
            </h2>
            {draftSaved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-text-tertiary -mb-1"
              >
                Draft saved
              </motion.span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-6 py-2 rounded-full bg-accent text-primary font-display font-bold text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(200,245,96,0.3)] disabled:opacity-40 disabled:shadow-none active:scale-95 transition-all"
            aria-label="Publish post"
          >
            Post
          </button>
        </div>

        <div
          className="flex gap-1 mb-6 bg-card/60 p-1 rounded-2xl"
          role="radiogroup"
          aria-label="Post type"
        >
          {postTypes.map(t => {
            const selected = type === t.id;
            const tint =
              t.id === 'confession' && selected
                ? 'bg-accent-purple text-white'
                : selected
                  ? 'bg-accent text-primary'
                  : 'text-text-secondary';
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                role="radio"
                aria-checked={selected}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${tint}`}
              >
                <span className="text-lg">{t.emoji}</span>
                <span className="text-sm">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mb-6" role="radiogroup" aria-label="Post visibility">
          <button
            onClick={() => setIsGlobal(true)}
            role="radio"
            aria-checked={isGlobal}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              isGlobal
                ? 'bg-accent/20 border border-accent text-accent'
                : 'bg-card/60 border border-border text-text-tertiary'
            }`}
          >
            <Globe className="w-4 h-4" /> Global
          </button>
          <button
            onClick={() => setIsGlobal(false)}
            role="radio"
            aria-checked={!isGlobal}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              !isGlobal
                ? 'bg-accent/20 border border-accent text-accent'
                : 'bg-card/60 border border-border text-text-tertiary'
            }`}
          >
            <School className="w-4 h-4" /> College Only
          </button>
        </div>

        <motion.div
          animate={
            isConfession
              ? {
                  boxShadow: [
                    '0 0 5px rgba(179, 136, 255, 0.2)',
                    '0 0 20px rgba(179, 136, 255, 0.4)',
                    '0 0 5px rgba(179, 136, 255, 0.2)',
                  ],
                }
              : { boxShadow: '0 0 0 rgba(0,0,0,0)' }
          }
          transition={isConfession ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
          className={`relative rounded-3xl p-5 min-h-[280px] transition-colors duration-300 ${
            isConfession
              ? 'bg-accent-purple/5 border border-accent-purple/40'
              : 'bg-card/60 border border-border'
          }`}
        >
          <textarea
            value={content}
            onChange={e => setContent(e.target.value.slice(0, MAX_CHARS))}
            placeholder={currentType?.placeholder}
            rows={6}
            aria-label="Post content"
            className="w-full bg-transparent border-0 text-lg text-text-primary placeholder:text-text-tertiary/60 outline-none resize-none font-medium leading-relaxed"
          />

          {aiLoading && (
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <div className="flex items-center gap-2 text-accent">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">AI is thinking...</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-5 left-5 flex items-center gap-3">
            <button
              onClick={() => setShowImagePlaceholder(!showImagePlaceholder)}
              className={`p-3 rounded-2xl border text-text-secondary hover:bg-card-alt transition-colors ${
                showImagePlaceholder
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-card/60 border-border'
              }`}
              aria-label="Add image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowAI(!showAI)}
                className="flex items-center gap-2 px-4 py-3 bg-accent/10 border border-accent/20 text-accent rounded-2xl font-bold text-sm hover:bg-accent/20 transition-all active:scale-95"
                aria-label="AI writing assist"
                aria-expanded={showAI}
              >
                <Zap className="w-4 h-4 fill-accent" /> AI Assist
              </button>
              <AnimatePresence>
                {showAI && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-2 w-60 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-10"
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
                      <p className="px-4 py-2 text-xs text-accent-warm bg-accent-warm/10">
                        Set API key in Settings to use AI
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute bottom-5 right-5">
            <span
              className={`text-sm font-bold tracking-widest ${
                overLimit ? 'text-accent-danger' : 'text-text-tertiary/60'
              }`}
            >
              {content.length} / {MAX_CHARS}
            </span>
          </div>
        </motion.div>

        <AnimatePresence>
          {showImagePlaceholder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-2 text-text-tertiary">
                <ImageIcon className="w-8 h-8" />
                <p className="text-sm font-medium">Image upload coming soon</p>
                <p className="text-xs">Drag &amp; drop or tap to upload</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {type === 'poll' && (
          <div className="space-y-2 mt-4">
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
                  className="flex-1 bg-card/60 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all"
                />
                {pollOptions.length > 2 && (
                  <button
                    onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))}
                    className="p-2 text-text-tertiary hover:text-accent-danger"
                    aria-label={`Remove option ${i + 1}`}
                  >
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
                    pollDuration === d
                      ? 'bg-accent text-primary'
                      : 'bg-card text-text-secondary border border-border'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {isConfession && (
          <div className="mt-4 p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
            <p className="text-xs text-accent-purple">
              🎭 This will be posted anonymously. Only your college name will be shown.
            </p>
          </div>
        )}

        {content.trim() && (
          <button
            onClick={clearDraft}
            className="mt-4 text-xs text-text-tertiary hover:text-accent-danger transition-colors"
          >
            Clear draft
          </button>
        )}
      </div>
    </PageTransition>
  );
}
