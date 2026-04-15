import { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const THRESHOLD = 80;

  const handleTouchStart = useCallback((e) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!pulling) return;
    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, currentY - startY.current);
    setPullDistance(Math.min(diff * 0.5, 120));
  }, [pulling]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= THRESHOLD && onRefresh) {
      setRefreshing(true);
      try { await onRefresh(); } catch {}
      setRefreshing(false);
    }
    setPulling(false);
    setPullDistance(0);
  }, [pullDistance, onRefresh]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        <RefreshCw
          className={`w-5 h-5 text-accent transition-transform ${
            refreshing ? 'ptr-spinner' : ''
          }`}
          style={{
            transform: `rotate(${pullDistance * 3}deg)`,
            opacity: Math.min(pullDistance / THRESHOLD, 1)
          }}
        />
      </div>
      {refreshing && (
        <div className="flex items-center justify-center py-2">
          <RefreshCw className="w-4 h-4 text-accent ptr-spinner" />
          <span className="ml-2 text-xs text-text-secondary">Refreshing...</span>
        </div>
      )}
      {children}
    </div>
  );
}
