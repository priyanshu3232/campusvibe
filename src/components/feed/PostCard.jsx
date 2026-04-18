import { useState, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Bookmark, Sparkles, EyeOff } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockUsers';
import { useFeed } from '../../context/FeedContext';
import { formatTime } from '../../utils/formatTime';
import { getLevel } from '../../utils/credSystem';
import Avatar from '../ui/Avatar';
import CollegeLogo from '../ui/CollegeLogo';

function PostCard({ post, index = 0 }) {
  const navigate = useNavigate();
  const { toggleLike, toggleSave, userLikes, userSaves, votePoll, pollVotes } = useFeed();
  const [heartBurst, setHeartBurst] = useState(false);
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);
  const lastTap = useRef(0);
  const user = MOCK_USERS.find(u => u.id === post.userId);
  const isLiked = userLikes.includes(post.id);
  const isSaved = userSaves.includes(post.id);
  const isConfession = post.type === 'confession';
  const level = user ? getLevel(user.credScore) : null;

  const handleLike = () => {
    toggleLike(post.id);
    if (!isLiked) {
      setHeartBurst(true);
      if (navigator.vibrate) navigator.vibrate(30);
      setTimeout(() => setHeartBurst(false), 300);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!isLiked) {
        handleLike();
        setDoubleTapHeart(true);
        setTimeout(() => setDoubleTapHeart(false), 1000);
      }
    }
    lastTap.current = now;
  };

  const totalVotes = post.pollOptions?.reduce((sum, o) => sum + o.votes, 0) || 0;
  const hasVoted = pollVotes[post.id] !== undefined;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="mx-4 mb-3 p-4 rounded-xl bg-card border border-border"
      onClick={handleDoubleTap}
      aria-label={`Post by ${isConfession ? 'Anonymous' : user?.name || 'Unknown'}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {isConfession ? (
          <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center shrink-0">
            <EyeOff className="w-5 h-5 text-accent-purple" />
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); user && navigate(`/profile/${user.id}`); }}
            aria-label={`View ${user?.name}'s profile`}
          >
            <Avatar avatarId={user?.avatar} imageUrl={user?.imageUrl} size="md" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {isConfession ? (
              <span className="font-semibold text-sm text-accent-purple">Anonymous</span>
            ) : (
              <>
                <button onClick={(e) => { e.stopPropagation(); user && navigate(`/profile/${user.id}`); }} className="font-semibold text-sm text-text-primary hover:underline truncate">
                  {user?.name || 'Unknown'}
                </button>
                <span className="text-text-tertiary text-xs">@{user?.username}</span>
                {level && <span className="text-xs" title={level.name}>{level.emoji}</span>}
              </>
            )}
            <span className="text-text-tertiary text-xs ml-auto shrink-0" aria-label={`Posted ${formatTime(post.timestamp)}`}>
              {formatTime(post.timestamp)}
            </span>
          </div>
          <p className="text-text-tertiary text-xs mt-0.5 flex items-center gap-1">
            {!isConfession && <CollegeLogo domain={user?.collegeDomain} size="xs" />}
            {isConfession ? post.collegeName : user?.college} {!isConfession && user?.year && `· ${user.year} Year`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <p className="text-text-primary text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

        {/* Image placeholder */}
        {post.image && (
          <div className="mb-3 rounded-lg overflow-hidden bg-card-alt aspect-video flex items-center justify-center">
            <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

        {/* Double tap heart overlay */}
        <AnimatePresence>
          {doubleTapHeart && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-16 h-16 fill-accent-danger text-accent-danger double-tap-heart" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Poll */}
      {post.type === 'poll' && post.pollOptions && (
        <div className="space-y-2 mb-3" role="group" aria-label="Poll options">
          {post.pollOptions.map((option, i) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const isVoted = pollVotes[post.id] === i;
            return (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); !hasVoted && votePoll(post.id, i); }}
                disabled={hasVoted}
                className={`w-full text-left relative overflow-hidden rounded-lg border transition-all ${
                  isVoted ? 'border-accent' : 'border-border hover:border-accent/30'
                }`}
                aria-label={`${option.text}${hasVoted ? ` — ${percentage}%` : ''}`}
              >
                {hasVoted && (
                  <div className={`absolute inset-y-0 left-0 transition-all duration-500 ${isVoted ? 'bg-accent/15' : 'bg-card-alt'}`} style={{ width: `${percentage}%` }} />
                )}
                <div className="relative px-4 py-2.5 flex items-center justify-between">
                  <span className="text-sm text-text-primary">{option.text}</span>
                  {hasVoted && <span className="text-xs text-text-secondary font-medium">{percentage}%</span>}
                </div>
              </button>
            );
          })}
          <p className="text-xs text-text-tertiary">{totalVotes} votes · {post.pollDuration || '24h'}</p>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs text-accent-purple font-medium">#{tag}</span>
          ))}
          <Sparkles className="w-3 h-3 text-accent-warm" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <button onClick={(e) => { e.stopPropagation(); handleLike(); }} className="flex items-center gap-1.5 group" aria-label={`${isLiked ? 'Unlike' : 'Like'} post, ${post.likes} likes`} aria-pressed={isLiked}>
          <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-accent-danger text-accent-danger' : 'text-text-tertiary group-hover:text-accent-danger'} ${heartBurst ? 'heart-burst' : ''}`} />
          <span className={`text-xs ${isLiked ? 'text-accent-danger' : 'text-text-tertiary'}`}>{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 group" aria-label={`${post.comments} comments`}>
          <MessageCircle className="w-5 h-5 text-text-tertiary group-hover:text-accent-purple transition-colors" />
          <span className="text-xs text-text-tertiary">{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 group" aria-label={`Share post, ${post.shares} shares`}>
          <Repeat2 className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors" />
          <span className="text-xs text-text-tertiary">{post.shares}</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleSave(post.id); }} className="group" aria-label={`${isSaved ? 'Unsave' : 'Save'} post`} aria-pressed={isSaved}>
          <Bookmark className={`w-5 h-5 transition-all ${isSaved ? 'fill-accent-warm text-accent-warm' : 'text-text-tertiary group-hover:text-accent-warm'}`} />
        </button>
      </div>
    </motion.article>
  );
}

export default memo(PostCard);
