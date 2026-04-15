import { useState } from 'react';
import { AVATARS } from '../../data/avatars';

const sizes = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-10 h-10 text-xl',
  lg: 'w-14 h-14 text-2xl',
  xl: 'w-20 h-20 text-4xl',
};

export default function Avatar({
  avatarId,
  imageUrl,
  size = 'md',
  showRing = false,
  ringColor = 'accent-purple',
  online = false,
  className = '',
}) {
  const [imgError, setImgError] = useState(false);
  const avatar = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt=""
          onError={() => setImgError(true)}
          className={`
            ${sizes[size] || sizes.md}
            rounded-full object-cover
            ${showRing ? `ring-2 ring-offset-2 ring-offset-primary ring-${ringColor}` : ''}
          `}
        />
      ) : (
        <div
          className={`
            ${sizes[size] || sizes.md}
            ${avatar.bg}/20
            rounded-full flex items-center justify-center
            ${showRing ? `ring-2 ring-offset-2 ring-offset-primary ring-${ringColor}` : ''}
          `}
          title={avatar.label}
          role="img"
          aria-label={avatar.label}
        >
          <span className="leading-none">{avatar.emoji}</span>
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-primary" />
      )}
    </div>
  );
}
