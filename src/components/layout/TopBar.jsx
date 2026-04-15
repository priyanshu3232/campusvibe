import { useNavigate } from 'react-router-dom';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';

export default function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 glass-strong md:hidden" role="banner">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {/* Left: Avatar + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            aria-label="View profile"
          >
            <Avatar avatarId={user?.avatar} size="sm" />
          </button>
          <h1
            className="text-xl font-display font-bold text-accent cursor-pointer"
            onClick={() => navigate('/home')}
          >
            CampusVibe
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/explore')}
            className="p-2 rounded-full hover:bg-card transition-colors active:scale-90"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-text-secondary" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-card transition-colors active:scale-90"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-text-secondary" />
            ) : (
              <Moon className="w-5 h-5 text-text-secondary" />
            )}
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-full hover:bg-card transition-colors active:scale-90"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-danger" aria-label="New notifications" />
          </button>
        </div>
      </div>
    </header>
  );
}
