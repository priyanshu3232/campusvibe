import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit3, Share2, Heart, Sparkles, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useFeed } from '../context/FeedContext';
import { getLevel } from '../utils/credSystem';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/layout/PageTransition';

const CHIP_STYLES = [
  'bg-accent/10 border-accent/25 text-accent',
  'bg-accent-purple/10 border-accent-purple/25 text-accent-purple',
  'bg-accent-warm/10 border-accent-warm/25 text-accent-warm',
];

function yearLabel(year) {
  if (!year) return 'Fresher';
  const n = Number(year);
  if (n <= 1) return 'Fresher';
  if (n === 2) return 'Sophomore';
  if (n === 3) return 'Junior';
  return 'Senior';
}

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${n}`;
}

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

  const activePosts = activeTab === 'posts' ? myPosts : activeTab === 'likes' ? likedPosts : [];

  return (
    <PageTransition>
      <div className="pt-2 px-4 pb-4">
        <section className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 -m-2 rounded-full border-[3px] border-accent shadow-[0_0_20px_rgba(200,245,96,0.35)] animate-pulse" />
            <div className="relative z-10 w-28 h-28 rounded-full border-4 border-primary overflow-hidden bg-card-alt flex items-center justify-center">
              <Avatar avatarId={user?.avatar} size="xl" className="scale-110" />
            </div>
            <div className="absolute -bottom-1 -right-1 z-20 bg-accent text-primary font-display font-bold text-[10px] px-3 py-1 rounded-full border border-primary shadow-lg uppercase tracking-wider">
              {yearLabel(user?.year)}
            </div>
          </div>

          <h1 className="mt-5 font-display font-black text-3xl tracking-[-0.03em] text-text-primary">
            {user?.name || 'Your Name'}
          </h1>
          <p className="text-text-tertiary font-medium tracking-wide">
            @{user?.username || 'username'}
          </p>

          <div className="flex items-center gap-2 mt-3">
            {level && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent">
                <span>{level.emoji}</span> {level.name}
                <span className="text-text-tertiary">· {credScore || user?.credScore || 0}</span>
              </span>
            )}
            {user?.college && (
              <span className="text-xs text-text-tertiary font-medium truncate max-w-[160px]">
                {user.college}
              </span>
            )}
          </div>

          <div className="mt-6 w-full flex justify-center items-stretch gap-0 px-6 py-3 bg-card/60 rounded-3xl">
            {[
              { label: 'Posts', value: formatCount(user?.postsCount ?? myPosts.length) },
              { label: 'Followers', value: formatCount(user?.followers ?? 0), middle: true },
              { label: 'Following', value: formatCount(user?.following ?? 0) },
            ].map(stat => (
              <button
                key={stat.label}
                className={`flex-1 flex flex-col items-center ${
                  stat.middle ? 'border-x border-border/40 px-4' : ''
                }`}
              >
                <span className="font-display font-bold text-2xl text-accent">{stat.value}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary mt-0.5">
                  {stat.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full mt-5">
            <button
              onClick={() => navigate('/settings')}
              className="flex-1 py-4 rounded-full font-display font-black text-sm uppercase tracking-tight text-primary flex items-center justify-center gap-2 bg-gradient-to-br from-accent to-[#a8d84f] shadow-[0_10px_25px_-10px_rgba(200,245,96,0.5)] active:scale-95 transition-transform"
            >
              <Edit3 className="w-4 h-4" strokeWidth={2.5} /> Edit Profile
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-text-primary active:scale-95 transition-all"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-text-primary active:scale-95 transition-all"
              aria-label="Share profile"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </section>

        {user?.interests?.length > 0 && (
          <section className="mb-8 -mx-4">
            <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-accent-purple mb-3 px-5">
              Interests
            </h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1">
              {user.interests.map((interest, i) => {
                const style = CHIP_STYLES[i % CHIP_STYLES.length];
                return (
                  <span
                    key={interest}
                    className={`shrink-0 px-4 py-1.5 rounded-full border font-bold text-sm whitespace-nowrap ${style}`}
                  >
                    #{interest}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        <div className="flex border-b border-border/50 mb-5 relative" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`flex-1 pb-3 font-display font-bold uppercase tracking-wide text-sm relative transition-colors ${
                activeTab === tab.id ? 'text-accent' : 'text-text-tertiary'
              }`}
            >
              {tab.label}
              {tab.count > 0 && <span className="ml-1 text-xs opacity-70">({tab.count})</span>}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="profileTabIndicator"
                  className="absolute -bottom-px left-0 right-0 h-[3px] bg-accent rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        <div role="tabpanel">
          {activeTab === 'reviews' ? (
            <EmptyState
              type="reviews"
              title="No reviews yet"
              message="Review a place near campus and help your peers!"
              action={{ label: 'Browse Places', onClick: () => navigate('/reviews') }}
            />
          ) : activePosts.length === 0 ? (
            <EmptyState
              type={activeTab === 'posts' ? 'posts' : 'likes'}
              title={activeTab === 'posts' ? 'No posts yet' : 'No liked posts'}
              message={
                activeTab === 'posts'
                  ? 'Share something with your campus!'
                  : 'Posts you like will appear here.'
              }
              action={
                activeTab === 'posts'
                  ? { label: 'Create Post', onClick: () => navigate('/create') }
                  : undefined
              }
            />
          ) : (
            <BentoGrid posts={activePosts} onOpen={(id) => navigate(`/profile/${id}`)} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}

const BENTO_PATTERN = [
  'col-span-1 aspect-[4/5]',
  'col-span-1 aspect-square',
  'col-span-2 aspect-video',
  'col-span-1 aspect-square',
  'col-span-1 aspect-[4/5]',
];

function BentoGrid({ posts }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {posts.map((post, i) => {
        const sizing = BENTO_PATTERN[i % BENTO_PATTERN.length];
        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`relative rounded-2xl overflow-hidden bg-card-alt group ${sizing}`}
          >
            {post.image ? (
              <img
                src={post.image}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
              />
            ) : null}

            <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
              {post.type === 'confession' && (
                <div className="self-end p-1.5 bg-black/40 backdrop-blur-md rounded-lg pointer-events-auto">
                  <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
                </div>
              )}
              <div className="mt-auto">
                {!post.image && (
                  <p className="text-sm text-text-primary font-medium line-clamp-4 mb-2">
                    {post.content}
                  </p>
                )}
                {post.likes > 0 && (
                  <div className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <Heart className="w-3 h-3 text-accent fill-accent" />
                    <span className="text-xs font-bold text-white">
                      {formatCount(post.likes)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {post.image && (
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
