import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, ThumbsUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_PLACES } from '../data/mockPlaces';
import { MOCK_REVIEWS } from '../data/mockReviews';
import { MOCK_USERS } from '../data/mockUsers';
import StarRating from '../components/ui/StarRating';
import PageTransition from '../components/layout/PageTransition';

const categories = [
  { label: 'All', emoji: '✨' },
  { label: 'Food', emoji: '🍛' },
  { label: 'Cafe', emoji: '☕' },
  { label: 'Stationery', emoji: '📎' },
  { label: 'Grocery', emoji: '🛒' },
  { label: 'Services', emoji: '🔧' },
];

const sortOptions = ['Most Reviewed', 'Highest Rated', 'Most Recent'];

export default function Reviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Most Reviewed');

  const filteredPlaces = useMemo(() => {
    let places = [...MOCK_PLACES];
    if (activeCategory !== 'All') {
      places = places.filter(p => p.category === activeCategory);
    }
    if (sortBy === 'Highest Rated') places.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'Most Reviewed') places.sort((a, b) => b.reviewCount - a.reviewCount);
    return places;
  }, [activeCategory, sortBy]);

  return (
    <PageTransition>
      <div className="pt-2">
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-accent" />
            <h2 className="font-display font-bold text-lg text-text-primary">Near {user?.college || 'Campus'}</h2>
          </div>
          <p className="text-xs text-text-tertiary">Rate and review places around your college</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 px-4 mb-4 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.label ? 'bg-accent text-primary' : 'bg-card text-text-secondary border border-border'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-3 px-4 mb-4">
          {sortOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`text-xs font-medium transition-colors ${sortBy === opt ? 'text-accent' : 'text-text-tertiary hover:text-text-secondary'}`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Place Cards */}
        <div className="space-y-3 px-4">
          {filteredPlaces.map((place, i) => {
            const reviews = MOCK_REVIEWS.filter(r => r.placeId === place.id);
            const latestReview = reviews[0];
            const reviewer = latestReview ? MOCK_USERS.find(u => u.id === latestReview.userId) : null;

            return (
              <motion.button
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/reviews/${place.id}`)}
                className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-accent/20 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-text-primary text-sm">{place.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={place.rating} readOnly size="sm" showValue />
                      <span className="text-xs text-text-tertiary">({place.reviewCount})</span>
                      <span className="text-xs text-text-tertiary">· {place.priceRange}</span>
                    </div>
                  </div>
                  <span className="text-xs text-text-tertiary bg-card-alt px-2 py-1 rounded-full">{place.category}</span>
                </div>
                <p className="text-xs text-text-tertiary mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {place.distance}
                </p>
                {latestReview && (
                  <p className="text-xs text-text-secondary italic line-clamp-1">
                    "{latestReview.text.slice(0, 80)}..." — @{reviewer?.username || 'user'}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <ThumbsUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success font-medium">{place.wouldRecommendPercent}% recommend</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
