import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User, Star, Gamepad2, Trophy, Bell, Settings, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProfileImage } from '../../utils/profileImage';
import Avatar from '../ui/Avatar';
import CollegeLogo from '../ui/CollegeLogo';

const menuItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/create', icon: PlusCircle, label: 'Create Post' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/reviews', icon: Star, label: 'Reviews' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/games', icon: Gamepad2, label: 'Games' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const userImage = user?.imageUrl || (user ? getProfileImage(user.id || user.username || user.email) : undefined);

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 h-screen flex-col bg-secondary border-r border-border z-40 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <button onClick={() => navigate('/home')} className="text-left">
            <h1 className="text-2xl font-display font-bold text-accent">CampusVibe</h1>
            <p className="text-xs text-text-tertiary mt-0.5">Your college, your vibe</p>
          </button>
        )}
        {collapsed && (
          <button onClick={() => navigate('/home')} className="text-2xl font-display font-bold text-accent">
            CV
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-card text-text-tertiary hover:text-text-primary transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all ${
                collapsed ? 'justify-center px-3 py-3' : 'px-4 py-2.5'
              } ${
                active
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-card hover:text-text-primary'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.5 : 1.5} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User card */}
      {!collapsed && user && (
        <button
          onClick={() => navigate('/profile')}
          className="mx-3 mb-3 p-3 rounded-xl bg-card border border-border flex items-center gap-3 hover:bg-card-alt transition-colors text-left"
        >
          <Avatar avatarId={user.avatar} imageUrl={userImage} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
            <p className="text-xs text-text-tertiary truncate flex items-center gap-1">
              <CollegeLogo domain={user.collegeDomain} size="xs" />
              @{user.username}
            </p>
          </div>
        </button>
      )}

      {collapsed && (
        <div className="flex justify-center mb-4">
          <button onClick={() => navigate('/profile')}>
            <Avatar avatarId={user?.avatar} imageUrl={userImage} size="sm" />
          </button>
        </div>
      )}
    </aside>
  );
}
