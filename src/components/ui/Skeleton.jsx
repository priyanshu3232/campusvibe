const variantStyles = {
  text: 'h-4 w-full rounded',
  circle: 'rounded-full',
  card: 'h-32 w-full rounded-xl',
  rect: 'rounded-lg',
};

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}) {
  const baseStyle = variantStyles[variant] || variantStyles.text;
  const dimensionDefaults = variant === 'circle' && !width && !height ? 'w-10 h-10' : '';
  const inlineStyle = {};
  if (width) inlineStyle.width = typeof width === 'number' ? `${width}px` : width;
  if (height) inlineStyle.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`skeleton ${baseStyle} ${dimensionDefaults} ${className}`}
      style={inlineStyle}
      aria-hidden="true"
    />
  );
}

// Page-specific skeleton screens
export function FeedSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3 px-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton variant="circle" />
            <div className="flex-1 space-y-1.5">
              <Skeleton width="40%" height={14} />
              <Skeleton width="60%" height={10} />
            </div>
          </div>
          <Skeleton className="mb-2" height={14} />
          <Skeleton width="80%" height={14} className="mb-3" />
          <div className="flex gap-6 pt-2 border-t border-border/50">
            <Skeleton width={50} height={20} />
            <Skeleton width={50} height={20} />
            <Skeleton width={50} height={20} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="px-4 pt-2">
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="circle" width={80} height={80} />
        <div className="flex gap-2">
          <Skeleton width={44} height={44} variant="rect" className="rounded-xl" />
          <Skeleton width={120} height={44} variant="rect" className="rounded-xl" />
        </div>
      </div>
      <Skeleton width="50%" height={24} className="mb-2" />
      <Skeleton width="30%" height={14} className="mb-1" />
      <Skeleton width="70%" height={14} className="mb-4" />
      <div className="flex gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="text-center">
            <Skeleton width={40} height={24} className="mx-auto mb-1" />
            <Skeleton width={50} height={12} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatSkeleton({ count = 5 }) {
  return (
    <div className="space-y-1 px-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton variant="circle" width={48} height={48} />
          <div className="flex-1 space-y-1.5">
            <Skeleton width="40%" height={14} />
            <Skeleton width="70%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}
