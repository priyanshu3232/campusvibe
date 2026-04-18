import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BarChart3,
  Users,
  Sparkles,
  UserPlus,
  Flame,
  Star,
  X,
  Loader2,
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { useFeed } from '../context/FeedContext';
import { parseSearchQuery } from '../api/claude';
import Avatar from '../components/ui/Avatar';
import PostCard from '../components/feed/PostCard';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/layout/PageTransition';

const TRENDING_TOPICS = [
  { topic: '#PlacementSeason', posts: 234, tint: 'lime' },
  { topic: '#CollegeFest2026', posts: 189, tint: 'purple' },
  { topic: '#InternshipDiaries', posts: 134, tint: 'lime' },
  { topic: '#ExamSeason', posts: 87, tint: 'purple' },
  { topic: '#MessFoodReview', posts: 156, tint: 'warm' },
];

const TINT_STYLES = {
  lime: {
    bg: 'bg-accent/10',
    border: 'border-accent/25',
    text: 'text-accent',
    count: 'text-accent/70',
  },
  purple: {
    bg: 'bg-accent-purple/10',
    border: 'border-accent-purple/25',
    text: 'text-accent-purple',
    count: 'text-accent-purple/70',
  },
  warm: {
    bg: 'bg-accent-warm/10',
    border: 'border-accent-warm/25',
    text: 'text-accent-warm',
    count: 'text-accent-warm/70',
  },
};

function formatFollowers(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${n}`;
}

export default function Explore() {
  const navigate = useNavigate();
  const { posts } = useFeed();
  const [search, setSearch] = useState('');
  const [following, setFollowing] = useState(() => new Set());
  const [aiKeywords, setAiKeywords] = useState([]);
  const [aiIntent, setAiIntent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const hasApiKey = typeof window !== 'undefined' && !!localStorage.getItem('campusvibe_api_key');
  const isNaturalLanguage = search.trim().split(/\s+/).length >= 3;

  const runSmartSearch = async () => {
    const apiKey = localStorage.getItem('campusvibe_api_key');
    if (!apiKey || !search.trim()) return;
    setAiLoading(true);
    try {
      const raw = await parseSearchQuery(search.trim(), apiKey);
      if (!raw) return;
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) return;
      const parsed = JSON.parse(match[0]);
      const keywords = Array.isArray(parsed.keywords) ? parsed.keywords.filter(Boolean) : [];
      setAiKeywords(keywords);
      setAiIntent(parsed.intent || '');
    } catch {
      // best-effort: keep the plain-text search if parsing fails
    } finally {
      setAiLoading(false);
    }
  };

  const matchTerms = useMemo(
    () => (aiKeywords.length > 0 ? aiKeywords : (search ? [search] : [])),
    [aiKeywords, search]
  );

  const filteredUsers = useMemo(() => {
    if (matchTerms.length === 0) return MOCK_USERS.slice(0, 8);
    return MOCK_USERS.filter(u =>
      matchTerms.some(term => {
        const t = term.toLowerCase();
        return (
          u.name.toLowerCase().includes(t) ||
          u.username.toLowerCase().includes(t) ||
          u.college.toLowerCase().includes(t)
        );
      })
    ).slice(0, 12);
  }, [matchTerms]);

  const filteredPosts = useMemo(() => {
    if (matchTerms.length === 0) return [];
    return posts
      .filter(p =>
        matchTerms.some(term => {
          const t = term.toLowerCase();
          return (
            p.content?.toLowerCase().includes(t) ||
            p.tags?.some(tag => tag.toLowerCase().includes(t))
          );
        })
      )
      .slice(0, 4);
  }, [matchTerms, posts]);

  const isSearching = search.length > 0;
  const clearSearch = () => {
    setSearch('');
    setAiKeywords([]);
    setAiIntent('');
  };

  const toggleFollow = (id) => {
    setFollowing(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <PageTransition>
      <div className="pt-2 px-4 pb-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setAiKeywords([]); setAiIntent(''); }}
            placeholder="Search students, topics, colleges..."
            className="w-full bg-card border-0 rounded-xl pl-12 pr-10 py-3.5 text-text-primary placeholder:text-text-tertiary outline-none focus:ring-2 focus:ring-accent/60 transition-all"
            aria-label="Search"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-primary"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isSearching && isNaturalLanguage && hasApiKey && aiKeywords.length === 0 && (
            <motion.button
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              onClick={runSmartSearch}
              disabled={aiLoading}
              className="flex items-center gap-2 -mt-3 mb-4 px-3 py-2 rounded-xl bg-accent/10 border border-accent/25 text-accent text-xs font-bold hover:bg-accent/15 transition-all disabled:opacity-60"
            >
              {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {aiLoading ? 'Thinking...' : 'Smart search with AI'}
            </motion.button>
          )}
          {aiKeywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="-mt-3 mb-4 p-3 rounded-xl bg-accent/5 border border-accent/20"
            >
              {aiIntent && (
                <p className="text-xs text-text-secondary mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent" /> {aiIntent}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {aiKeywords.map(k => (
                  <span key={k} className="text-[11px] bg-accent/15 text-accent px-2 py-0.5 rounded-full font-medium">
                    {k}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSearching && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-accent" />
              <h3 className="font-display font-bold text-text-primary">Trending Topics</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {TRENDING_TOPICS.map((item, i) => {
                const style = TINT_STYLES[item.tint];
                return (
                  <motion.button
                    key={item.topic}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSearch(item.topic.replace('#', ''))}
                    className={`shrink-0 min-w-[160px] p-4 rounded-2xl border text-left hover:scale-[1.02] transition-transform ${style.bg} ${style.border}`}
                  >
                    <p className={`font-display font-bold text-base ${style.text} tracking-tight`}>
                      {item.topic}
                    </p>
                    <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${style.count}`}>
                      {item.posts} posts
                      <Flame className="w-3 h-3" />
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </section>
        )}

        {isSearching && filteredPosts.length > 0 && (
          <section className="mb-8">
            <h3 className="font-display font-bold text-text-primary mb-3">Posts</h3>
            {filteredPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </section>
        )}

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-purple" />
              <h3 className="font-display font-bold text-text-primary">
                {isSearching ? 'People' : 'Discover Students'}
              </h3>
            </div>
            {!isSearching && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold uppercase tracking-wider text-accent">
                <Sparkles className="w-3 h-3" /> AI Suggested
              </span>
            )}
          </div>

          {filteredUsers.length === 0 ? (
            <EmptyState
              type="search"
              title="No results"
              message={`No users found for "${search}"`}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredUsers.map((user, i) => {
                const isFollowing = following.has(user.id);
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-4 rounded-2xl bg-card border border-border flex flex-col items-center text-center"
                  >
                    <button
                      onClick={() => navigate(`/profile/${user.id}`)}
                      className="w-full flex flex-col items-center"
                    >
                      <div className="relative mb-3">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-accent to-accent-purple">
                          <div className="w-full h-full rounded-full bg-card-alt flex items-center justify-center overflow-hidden">
                            <Avatar avatarId={user.avatar} imageUrl={user.imageUrl} size="lg" className="scale-110" />
                          </div>
                        </div>
                        {i === 0 && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent border-2 border-card flex items-center justify-center">
                            <Star className="w-2.5 h-2.5 text-primary fill-primary" />
                          </div>
                        )}
                      </div>
                      <p className="font-display font-bold text-sm text-text-primary truncate w-full">
                        {user.name}
                      </p>
                      <p className="text-xs text-text-tertiary truncate w-full">
                        @{user.username}
                      </p>
                      <p className="text-[11px] text-text-secondary mt-1 truncate w-full">
                        {user.college}
                      </p>
                      <p className="text-[11px] text-accent font-bold mt-2 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {formatFollowers(user.followers)} followers
                      </p>
                    </button>
                    <button
                      onClick={() => toggleFollow(user.id)}
                      className={`w-full mt-3 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        isFollowing
                          ? 'bg-card-alt border border-border text-text-secondary'
                          : 'bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25'
                      }`}
                      aria-label={`${isFollowing ? 'Unfollow' : 'Follow'} ${user.name}`}
                    >
                      {isFollowing ? (
                        'Following'
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                          <UserPlus className="w-3 h-3" /> + Follow
                        </span>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
