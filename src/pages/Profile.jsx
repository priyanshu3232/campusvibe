import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, MapPin, Calendar, Edit3, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useFeed } from '../context/FeedContext';
import { getLevel } from '../utils/credSystem';
import { formatDate } from '../utils/formatTime';
import Avatar from '../components/ui/Avatar';
import CollegeLogo from '../components/ui/CollegeLogo';
import PostCard from '../components/feed/PostCard';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/layout/PageTransition';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credScore } = useGame();
  const { posts, userLikes } = useFeed();
  const [activeTab, setActiveTab] = useState('posts');
  const level = getLevel(credScore || user?.credScore || 0);

  const myPosts = useMemo(() => posts.filter(p => p.userId === 'user_me'), [posts]);
  const likedPosts = useMemo(() => posts.filter(p => userLikes.includes(p.id)), [posts, userLikes]);

  const tabs = [
    { id: 'posts', label: 'Posts', count: myPosts.length },
    { id: 'reviews', label: 'Reviews', count: 0 },
    { id: 'likes', label: 'Likes', count: likedPosts.length },
  ];

  return (
    <PageTransition>
      <div className="pt-2">
        {/* Header */}
        <div className="px-4 mb-6">
          <div className="flex items-start justify-between mb-4">
            <Avatar avatarId={user?.avatar} size="xl" showRing ringColor="accent-purple" />
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/settings')}
                className="p-2.5 rounded-xl bg-card border border-border text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                className="p-2.5 rounded-xl bg-card border border-border text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Share profile"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-primary text-sm font-semibold"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            </div>
          </div>

          <h1 className="text-xl font-display font-bold text-text-primary">{user?.name}</h1>
          <p className="text-sm text-text-tertiary">@{user?.username}</p>
          {user?.bio && <p className="text-sm text-text-secondary mt-1">{user.bio}</p>}

          <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary flex-wrap">
            <span className="flex items-center gap-1"><CollegeLogo domain={user?.collegeDomain} size="xs" /><MapPin className="w-3 h-3" /> {user?.college}</span>
            <span>{user?.year} Year · {user?.branch}</span>
            {user?.joinedAt && (
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {formatDate(user.joinedAt)}</span>
            )}
          </div>

          {/* Cred Badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span className="text-base">{level?.emoji}</span>
            <span className="text-sm font-semibold text-accent">{level?.name}</span>
            <span className="text-xs text-text-tertiary">· {credScore || user?.credScore || 0} Cred</span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            {[
              { label: 'Posts', value: myPosts.length },
              { label: 'Followers', value: user?.followers || 0 },
              { label: 'Following', value: user?.following || 0 },
            ].map(stat => (
              <button key={stat.label} className="text-center group">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                  {stat.value}
                </motion.p>
                <p className="text-xs text-text-tertiary">{stat.label}</p>
              </button>
            ))}
          </div>

          {/* Interests */}
          {user?.interests?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {user.interests.map(i => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-card border border-border text-xs text-text-secondary">{i}</span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-4" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? 'text-accent' : 'text-text-tertiary'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label} {tab.count > 0 && <span className="text-xs opacity-60">({tab.count})</span>}
              {activeTab === tab.id && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div role="tabpanel">
          {activeTab === 'posts' && (
            myPosts.length > 0 ? (
              myPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
            ) : (
              <EmptyState type="posts" title="No posts yet" message="Share something with your campus!" action={{ label: 'Create Post', onClick: () => navigate('/create') }} />
            )
          )}
          {activeTab === 'reviews' && (
            <EmptyState type="reviews" title="No reviews yet" message="Review a place near campus and help your peers!" action={{ label: 'Browse Places', onClick: () => navigate('/reviews') }} />
          )}
          {activeTab === 'likes' && (
            likedPosts.length > 0 ? (
              likedPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
            ) : (
              <EmptyState type="likes" title="No liked posts" message="Posts you like will appear here." />
            )
          )}
        </div>
      </div>
    </PageTransition>
  );
}
