import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Sparkles, ThumbsUp, Send } from 'lucide-react';
import { MOCK_PLACES } from '../data/mockPlaces';
import { MOCK_REVIEWS } from '../data/mockReviews';
import { MOCK_USERS } from '../data/mockUsers';
import { useAuth } from '../context/AuthContext';
import { formatTime } from '../utils/formatTime';
import Avatar from '../components/ui/Avatar';
import StarRating from '../components/ui/StarRating';
import PageTransition from '../components/layout/PageTransition';

const AI_SUMMARIES = {
  place_1: "Students love the chole bhature and paratha rolls. Common complaints include slow service during lunch rush and limited seating. Best visited during off-peak hours.",
  place_2: "The chai here is legendary among students - strong, sweet, and cheap. Perfect spot for late-night study breaks. The biscuits are a nice touch.",
  place_3: "A campus staple for late-night cravings. The maggi is consistently good, and the vibe at 2 AM is unmatched. Prices are student-friendly.",
  default: "Students generally enjoy this place for its affordable prices and proximity to campus. Service quality varies but the food is consistently decent.",
};

export default function PlaceDetail() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const place = MOCK_PLACES.find(p => p.id === placeId);
  const reviews = MOCK_REVIEWS.filter(r => r.placeId === placeId);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!place) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-text-secondary">Place not found</p>
        </div>
      </PageTransition>
    );
  }

  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    return { stars, count, percent: reviews.length > 0 ? (count / reviews.length) * 100 : 0 };
  });

  const aiSummary = AI_SUMMARIES[placeId] || AI_SUMMARIES.default;

  return (
    <PageTransition>
      <div className="pt-2">
        <div className="px-4 mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-text-tertiary hover:text-text-secondary mb-4" aria-label="Go back">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h1 className="text-xl font-display font-bold text-text-primary mb-1">{place.name}</h1>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <StarRating value={place.rating} readOnly size="sm" showValue />
            <span className="text-sm text-text-tertiary">({place.reviewCount} reviews)</span>
            <span className="text-sm text-text-tertiary">{place.priceRange}</span>
            <span className="text-xs bg-card-alt px-2 py-0.5 rounded-full text-text-secondary">{place.category}</span>
          </div>
          <p className="text-sm text-text-tertiary flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {place.distance}
          </p>
        </div>

        {/* AI Summary */}
        <div className="mx-4 mb-4 p-4 rounded-xl glass border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">AI Summary</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{aiSummary}</p>
        </div>

        {/* Rating Breakdown */}
        <div className="mx-4 mb-4 p-4 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Rating Breakdown</h3>
          {ratingBreakdown.map(({ stars, count, percent }) => (
            <div key={stars} className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-text-secondary w-3">{stars}</span>
              <StarRating value={1} readOnly size="sm" />
              <div className="flex-1 h-2 bg-card-alt rounded-full overflow-hidden">
                <div className="h-full bg-accent-warm rounded-full transition-all" style={{ width: `${percent}%` }} />
              </div>
              <span className="text-xs text-text-tertiary w-6 text-right">{count}</span>
            </div>
          ))}
        </div>

        {/* Write Review CTA */}
        {!showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="mx-4 mb-4 w-[calc(100%-2rem)] py-3 rounded-xl bg-accent text-primary font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            Write a Review
          </button>
        )}

        {showReviewForm && (
          <div className="mx-4 mb-4 p-4 rounded-xl bg-card border border-border">
            <p className="text-sm font-medium text-text-primary mb-2">Your Rating</p>
            <div className="mb-3">
              <StarRating value={newRating} onChange={setNewRating} size="md" />
            </div>
            <textarea
              value={newReview}
              onChange={e => setNewReview(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all resize-none mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowReviewForm(false); setNewReview(''); setNewRating(0); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-primary font-semibold text-sm active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" /> Submit
              </button>
              <button
                onClick={() => { setShowReviewForm(false); setNewReview(''); setNewRating(0); }}
                className="px-4 py-2 rounded-xl bg-card-alt text-text-secondary text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="px-4 mb-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Reviews ({reviews.length})</h3>
          <div className="space-y-3">
            {reviews.map((review, i) => {
              const reviewer = MOCK_USERS.find(u => u.id === review.userId);
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-xl bg-card-alt border border-border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar avatarId={reviewer?.avatar} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{reviewer?.name || 'Student'}</p>
                      <StarRating value={review.rating} readOnly size="sm" />
                    </div>
                    <span className="text-xs text-text-tertiary">{formatTime(review.timestamp)}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{review.text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors" aria-label={`Mark as helpful, ${review.helpfulCount} found helpful`}>
                      <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpfulCount})
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
