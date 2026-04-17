import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import { MOCK_USERS } from '../data/mockUsers';
import PageTransition from '../components/layout/PageTransition';
import FeedToggle from '../components/feed/FeedToggle';
import VibePulse from '../components/feed/VibePulse';
import TopicBubbles from '../components/feed/TopicBubbles';
import PostCard from '../components/feed/PostCard';
import PullToRefresh from '../components/ui/PullToRefresh';
import EmptyState from '../components/ui/EmptyState';
import { FeedSkeleton } from '../components/ui/Skeleton';

const POSTS_PER_PAGE = 10;

export default function Home() {
  const { user } = useAuth();
  const { posts } = useFeed();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'global';
  const activeTopic = searchParams.get('topic') || null;
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [refreshing, setRefreshing] = useState(false);

  const setActiveTab = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    params.delete('topic');
    setSearchParams(params);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const setActiveTopic = (topic) => {
    const params = new URLSearchParams(searchParams);
    if (topic) params.set('topic', topic);
    else params.delete('topic');
    setSearchParams(params);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (activeTab === 'college') {
      filtered = filtered.filter(p => {
        if (p.userId === 'user_me') return true;
        const postUser = MOCK_USERS.find(u => u.id === p.userId);
        return postUser?.college === user?.college;
      });
    }
    if (activeTopic) {
      filtered = filtered.filter(p =>
        p.tags?.some(t => t.toLowerCase().includes(activeTopic.toLowerCase())) ||
        p.content?.toLowerCase().includes(activeTopic.toLowerCase())
      );
    }
    return filtered;
  }, [posts, activeTab, activeTopic, user?.college]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setVisibleCount(POSTS_PER_PAGE);
    setRefreshing(false);
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + POSTS_PER_PAGE, filteredPosts.length));
  };

  return (
    <PageTransition>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="pt-3">
          <FeedToggle activeTab={activeTab} onTabChange={setActiveTab} />

          <VibePulse collegeName={activeTab === 'college' ? user?.college : undefined} />

          <TopicBubbles activeTopic={activeTopic} onTopicChange={setActiveTopic} />

          {refreshing ? (
            <FeedSkeleton count={3} />
          ) : visiblePosts.length > 0 ? (
            <>
              {visiblePosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
              {hasMore && (
                <div className="flex justify-center py-4">
                  <button
                    onClick={loadMore}
                    className="px-6 py-2.5 rounded-full bg-card/70 border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all"
                  >
                    Load more posts
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              type="posts"
              title="No posts yet"
              message="Be the first to share something with your campus!"
              action={{ label: 'Create Post', onClick: () => window.location.href = '/create' }}
            />
          )}
        </div>
      </PullToRefresh>
    </PageTransition>
  );
}
