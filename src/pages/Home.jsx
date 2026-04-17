import { useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import PageTransition from '../components/layout/PageTransition';
import FeedToggle from '../components/feed/FeedToggle';
import VibePulse from '../components/feed/VibePulse';
import TopicBubbles from '../components/feed/TopicBubbles';
import PostCard from '../components/feed/PostCard';
import PullToRefresh from '../components/ui/PullToRefresh';
import EmptyState from '../components/ui/EmptyState';
import { FeedSkeleton } from '../components/ui/Skeleton';

export default function Home() {
  const { user } = useAuth();
  const { posts, loading, loadingMore, hasMore, scope, loadFeed, loadMore } = useFeed();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'global';
  const activeTopic = searchParams.get('topic') || null;

  useEffect(() => {
    if (activeTab !== scope) loadFeed(activeTab);
  }, [activeTab, scope, loadFeed]);

  const setActiveTab = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    params.delete('topic');
    setSearchParams(params);
  };

  const setActiveTopic = (topic) => {
    const params = new URLSearchParams(searchParams);
    if (topic) params.set('topic', topic);
    else params.delete('topic');
    setSearchParams(params);
  };

  const filteredPosts = useMemo(() => {
    if (!activeTopic) return posts;
    const needle = activeTopic.toLowerCase();
    return posts.filter(p =>
      p.tags?.some(t => t.toLowerCase().includes(needle)) ||
      p.content?.toLowerCase().includes(needle)
    );
  }, [posts, activeTopic]);

  const handleRefresh = useCallback(async () => {
    await loadFeed(activeTab);
  }, [loadFeed, activeTab]);

  return (
    <PageTransition>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="pt-3">
          <FeedToggle activeTab={activeTab} onTabChange={setActiveTab} />

          <VibePulse collegeName={activeTab === 'college' ? user?.college : undefined} />

          <TopicBubbles activeTopic={activeTopic} onTopicChange={setActiveTopic} />

          {loading ? (
            <FeedSkeleton count={3} />
          ) : filteredPosts.length > 0 ? (
            <>
              {filteredPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
              {hasMore && !activeTopic && (
                <div className="flex justify-center py-4">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-2.5 rounded-full bg-card/70 border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all disabled:opacity-60"
                  >
                    {loadingMore ? 'Loading...' : 'Load more posts'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              type="posts"
              title={activeTopic ? 'No posts match this topic' : 'No posts yet'}
              message={activeTopic ? 'Try a different topic or clear the filter.' : 'Be the first to share something with your campus!'}
              action={activeTopic ? undefined : { label: 'Create Post', onClick: () => window.location.href = '/create' }}
            />
          )}
        </div>
      </PullToRefresh>
    </PageTransition>
  );
}
