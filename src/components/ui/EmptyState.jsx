import Button from './Button';
import { FileText, MessageCircle, Star, Heart, Search, Gamepad2 } from 'lucide-react';

const illustrations = {
  posts: { icon: FileText, color: 'text-accent-purple', bg: 'bg-accent-purple/10', subtitle: 'The feed is empty' },
  reviews: { icon: Star, color: 'text-accent-warm', bg: 'bg-accent-warm/10', subtitle: 'No reviews yet' },
  likes: { icon: Heart, color: 'text-accent-danger', bg: 'bg-accent-danger/10', subtitle: 'Nothing liked yet' },
  messages: { icon: MessageCircle, color: 'text-accent', bg: 'bg-accent/10', subtitle: 'No messages yet' },
  search: { icon: Search, color: 'text-text-tertiary', bg: 'bg-card-alt', subtitle: 'No results found' },
  games: { icon: Gamepad2, color: 'text-accent', bg: 'bg-accent/10', subtitle: 'No games played yet' },
};

export default function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  type,
}) {
  const illus = type ? illustrations[type] : null;
  const DisplayIcon = Icon || illus?.icon;
  const bgColor = illus?.bg || 'bg-card-alt';
  const iconColor = illus?.color || 'text-text-tertiary';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center" role="status">
      {DisplayIcon && (
        <div className={`w-20 h-20 rounded-2xl ${bgColor} flex items-center justify-center mb-5`}>
          <DisplayIcon size={36} className={iconColor} />
        </div>
      )}
      {title && (
        <h3 className="text-text-primary font-display font-semibold text-lg mb-1.5">
          {title}
        </h3>
      )}
      {message && (
        <p className="text-text-secondary text-sm max-w-xs mb-6 leading-relaxed">
          {message}
        </p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
