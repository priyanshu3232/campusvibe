import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Users, Trophy, Sparkles, UserPlus, MapPin, Gamepad2, X } from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { useFeed } from '../context/FeedContext';
import { getLevel } from '../utils/credSystem';
import Avatar from '../components/ui/Avatar';
import PostCard from '../components/feed/PostCard';
import EmptyState from '../components/ui/EmptyState';
import CollegeLogo from '../components/ui/CollegeLogo';
import { getCollegeLogoByName } from '../data/collegeLogos';
import PageTransition from '../components/layout/PageTransition';

const TRENDING = [
  { topic: '#PlacementSeason', posts: 234, trending: true },
  { topic: '#CollegeFest2026', posts: 189, trending: true },
  { topic: '#MessFoodReview', posts: 156, trending: false },
  { topic: '#InternshipDiaries', posts: 134, trending: true },
  { topic: '#NightCanteen', posts: 98, trending: false },
  { topic: '#ExamSeason', posts: 87, trending: true },
];

const COLLEGE_RANKINGS = [
  { name: 'IIT Delhi', posts: 1234, rank: 1 },
  { name: 'IIT Bombay', posts: 1189, rank: 2 },
  { name: 'BITS Pilani', posts: 987, rank: 3 },
  { name: 'IIT Madras', posts: 876, rank: 4 },
  { name: 'VIT Vellore', posts: 765, rank: 5 },
];

const searchCategories = [
  { id: 'all', label: 'All' },
  { id: 'people', label: 'People' },
  { id: 'posts', label: 'Posts' },
  { id: 'places', label: 'Places' },
];

export default function Explore() {
  const navigate = useNavigate();
  const { posts } = useFeed();
  const [search, setSearch] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');

  const filteredUsers = useMemo(() => {
    if (!search) return MOCK_USERS.slice(0, 8);
    return MOCK_USERS.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.college.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 12);
  }, [search]);

  const filteredPosts = useMemo(() => {
    if (!search) return [];
    return posts.filter(p =>
      p.content?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    ).slice(0, 6);
  }, [search, posts]);

  const isSearching = search.length > 0;
  const showPeople = !isSearching || searchCategory === 'all' || searchCategory === 'people';
  const showPosts = isSearching && (searchCategory === 'all' || searchCategory === 'posts');

  return (
    <PageTransition>
      <div className="pt-2 px-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students, topics, colleges..."
            className="w-full bg-input border border-border rounded-xl pl-10 pr-10 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all"
            aria-label="Search"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5" aria-label="Clear search">
              <X className="w-4 h-4 text-text-tertiary" />
            </button>
          )}
        </div>

        {/* Search category tabs */}
        {isSearching && (
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {searchCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSearchCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  searchCategory === cat.id ? 'bg-accent text-primary' : 'bg-card text-text-secondary border border-border'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {!isSearching && (
          <>
            {/* Trending Topics */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-accent" />
                <h3 className="font-display font-bold text-text-primary">Trending Topics</h3>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {TRENDING.map((item, i) => (
                  <motion.button
                    key={item.topic}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSearch(item.topic.replace('#', ''))}
                    className="shrink-0 p-3 rounded-xl bg-card border border-border min-w-[140px] text-left hover:border-accent/30 transition-colors"
                  >
                    <p className="text-sm font-semibold text-accent-purple">{item.topic}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-text-tertiary">{item.posts} posts</span>
                      {item.trending && <TrendingUp className="w-3 h-3 text-success" />}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Search Results: Posts */}
        {showPosts && filteredPosts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display font-bold text-text-primary mb-3">Posts</h3>
            {filteredPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* Users */}
        {showPeople && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-accent-purple" />
              <h3 className="font-display font-bold text-text-primary">
                {isSearching ? 'People' : 'Discover Students'}
              </h3>
              {!isSearching && (
                <span className="flex items-center gap-1 text-xs text-accent-warm"><Sparkles className="w-3 h-3" /> AI Suggested</span>
              )}
            </div>
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {filteredUsers.map((user, i) => {
                  const level = getLevel(user.credScore);
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="p-3 rounded-xl bg-card border border-border"
                    >
                      <button onClick={() => navigate(`/profile/${user.id}`)} className="w-full text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar avatarId={user.avatar} size="md" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                            <p className="text-xs text-text-tertiary truncate">@{user.username}</p>
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary truncate mb-1 flex items-center gap-1">
                          <CollegeLogo domain={user.collegeDomain} size="xs" />
                          {user.college}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{level?.emoji}</span>
                          <span className="text-xs text-text-tertiary">{user.followers} followers</span>
                        </div>
                      </button>
                      <button className="w-full mt-2 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold flex items-center justify-center gap-1 hover:bg-accent/20 transition-colors" aria-label={`Follow ${user.name}`}>
                        <UserPlus className="w-3 h-3" /> Follow
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <EmptyState type="search" title="No results" message={`No users found for "${search}"`} />
            )}
          </div>
        )}

        {/* College Rankings */}
        {!isSearching && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-accent-warm" />
              <h3 className="font-display font-bold text-text-primary">Most Active Colleges</h3>
            </div>
            <div className="space-y-2">
              {COLLEGE_RANKINGS.map((college, i) => (
                <motion.div
                  key={college.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? 'bg-accent-warm/20 text-accent-warm' :
                    i === 1 ? 'bg-gray-400/20 text-gray-300' :
                    i === 2 ? 'bg-amber-700/20 text-amber-600' :
                    'bg-card-alt text-text-tertiary'
                  }`}>
                    #{college.rank}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                      {getCollegeLogoByName(college.name) && <img src={getCollegeLogoByName(college.name)} alt="" className="w-5 h-5 object-contain" />}
                      {college.name}
                    </p>
                    <p className="text-xs text-text-tertiary">{college.posts} posts this week</p>
                  </div>
                  <div className="w-20 h-2 bg-card-alt rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(college.posts / 1234) * 100}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
