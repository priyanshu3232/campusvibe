import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  value = 0,
  onChange,
  size = 'md',
  readOnly = false,
  showValue = false,
}) {
  const [hoverValue, setHoverValue] = useState(0);
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  const iconSize = sizes[size] || sizes.md;
  const displayValue = hoverValue || value;

  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(star => {
        const isFilled = star <= displayValue;
        const isHalf = !isFilled && star - 0.5 <= displayValue;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} transition-transform ${!readOnly && 'hover:scale-110 active:scale-95'}`}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            role="radio"
            aria-checked={star === value}
          >
            <Star
              className={`${iconSize} transition-colors ${
                isFilled
                  ? 'fill-accent-warm text-accent-warm'
                  : 'text-text-tertiary'
              }`}
            />
          </button>
        );
      })}
      {showValue && value > 0 && (
        <span className="ml-1 text-sm font-bold text-accent-warm">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
