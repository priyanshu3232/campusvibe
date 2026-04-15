import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, MessageCircle, UserPlus, UserMinus, Calendar, Share2 } from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { useFeed } from '../context/FeedContext';
import { getLevel } from '../utils/credSystem';
import PostCard from '../components/feed/PostCard';
import Avatar from '../components/ui/Avatar';
import CollegeLogo from '../components/ui/CollegeLogo';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/layout/PageTransition';

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { posts } = useFeed();
  const [isFollowing, setIsFollowing] = useState(false);

  const profileUser = MOCK_USERS.find(u => u.id === userId);
  const level = getLevel(profileUser?.credScore || 0);
  const userPosts = posts.filter(p => p.userId === userId);

  if (!profileUser) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="w-16 h-16 rounded-2xl bg-card-alt flex items-center justify-center mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="font-display font-bold text-text-primary mb-2">User not found</h3>
          <p className="text-sm text-text-secondary mb-4">This profile doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl bg-accent text-primary font-medium text-sm"
          >
            Go Back
          </button>
        </div>
      </PageTransition>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  return (
    <PageTransition>
      <div className="pt-2">
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-text-tertiary hover:text-text-secondary" aria-label="Go back">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: profileUser.name, url: window.location.href });
                }
              }}
              className="p-2 rounded-full hover:bg-card transition-colors"
              aria-label="Share profile"
            >
              <Share2 className="w-4 h-4 text-text-tertiary" />
            </button>
          </div>

          <div className="flex items-start justify-between mb-4">
            <Avatar
              avatarId={profileUser.avatar}
              size="xl"
              showRing
              ringColor="accent-purple"
            />
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/chat/${userId}`)}
                className="p-2.5 rounded-xl bg-card border border-border text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Message user"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isFollowing
                    ? 'bg-card border border-border text-text-secondary'
                    : 'bg-accent text-primary'
                }`}
                aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
              >
                {isFollowing ? <><UserMinus className="w-4 h-4" /> Following</> : <><UserPlus className="w-4 h-4" /> Follow</>}
              </button>
            </div>
          </div>

          <h1 className="text-xl font-display font-bold text-text-primary">{profileUser.name}</h1>
          <p className="text-sm text-text-tertiary">@{profileUser.username}</p>
          {profileUser.bio && <p className="text-sm text-text-secondary mt-1">{profileUser.bio}</p>}

          <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary flex-wrap">
            <span className="flex items-center gap-1"><CollegeLogo domain={profileUser.collegeDomain} size="xs" /><MapPin className="w-3 h-3" /> {profileUser.college}</span>
            <span>{profileUser.year} Year · {profileUser.branch}</span>
            {profileUser.joinedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Joined {formatDate(profileUser.joinedAt)}
              </span>
            )}
          </div>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span>{level?.emoji}</span>
            <span className="text-sm font-semibold text-accent">{level?.name}</span>
            <span className="text-xs text-text-tertiary">· {profileUser.credScore} Cred</span>
          </div>

          <div className="flex gap-6 mt-4">
            {[
              { label: 'Posts', value: profileUser.postsCount },
              { label: 'Followers', value: profileUser.followers + (isFollowing ? 1 : 0) },
              { label: 'Following', value: profileUser.following },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-tertiary">{stat.label}</p>
              </div>
            ))}
          </div>

          {profileUser.interests?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profileUser.interests.map(i => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-card border border-border text-xs text-text-secondary">{i}</span>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="px-4 text-sm font-semibold text-text-primary mb-3">Posts</h3>
          {userPosts.length > 0 ? (
            userPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
          ) : (
            <EmptyState
              type="posts"
              title="No posts yet"
              message={`${profileUser.name} hasn't shared anything yet.`}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
