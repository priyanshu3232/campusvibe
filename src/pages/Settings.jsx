import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Bell, Shield, Moon, Sun, Key, Info, LogOut, ChevronRight, Eye, Trash2, HelpCircle, MessageSquare, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PageTransition from '../components/layout/PageTransition';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState(localStorage.getItem('campusvibe_api_key') || '');
  const [showApiInput, setShowApiInput] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState('everyone');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const saveApiKey = () => {
    localStorage.setItem('campusvibe_api_key', apiKey);
    setShowApiInput(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', desc: user?.name || 'Set up your profile', onClick: () => {}, chevron: true },
        { icon: Key, label: 'Claude API Key', desc: apiKey ? 'Key configured' : 'Not set — AI features disabled', onClick: () => setShowApiInput(!showApiInput), highlight: !apiKey },
        { icon: Eye, label: 'Activity Status', desc: 'Show when you\'re online', toggle: true, value: true, onChange: () => {} },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Push Notifications', desc: notifications ? 'All notifications enabled' : 'Notifications disabled', toggle: true, value: notifications, onChange: () => setNotifications(!notifications) },
        { icon: theme === 'dark' ? Moon : Sun, label: 'Appearance', desc: theme === 'dark' ? 'Dark mode' : 'Light mode', toggle: true, value: theme === 'light', onChange: toggleTheme },
        { icon: Globe, label: 'Language', desc: 'English', chevron: true, onClick: () => {} },
        { icon: Shield, label: 'Who can message me', desc: privacy === 'everyone' ? 'Everyone' : 'Only followers', onClick: () => setPrivacy(privacy === 'everyone' ? 'followers' : 'everyone'), chevron: true },
      ]
    },
    {
      title: 'Privacy & Safety',
      items: [
        { icon: Eye, label: 'Profile Visibility', desc: 'Visible to all students', chevron: true, onClick: () => {} },
        { icon: Shield, label: 'Blocked Users', desc: 'No blocked users', chevron: true, onClick: () => {} },
        { icon: MessageSquare, label: 'Content Preferences', desc: 'Manage what you see', chevron: true, onClick: () => {} },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', desc: 'FAQs and support', chevron: true, onClick: () => {} },
        { icon: Info, label: 'About CampusVibe', desc: 'v1.0.0 · Made for Indian students', onClick: () => {} },
      ]
    }
  ];

  return (
    <PageTransition>
      <div className="pt-2 px-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-1" aria-label="Go back">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <h2 className="font-display font-bold text-lg text-text-primary">Settings</h2>
        </div>

        {/* User Card */}
        <div className="mb-6 p-4 rounded-xl bg-card border border-border flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center text-2xl">
            {user?.avatar ? '👨‍🎓' : '👤'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'Student'}</p>
            <p className="text-xs text-text-tertiary truncate">{user?.email || 'No email set'}</p>
          </div>
          <button onClick={() => navigate('/profile')} className="text-xs text-accent font-medium">View</button>
        </div>

        {sections.map(section => (
          <div key={section.title} className="mb-6">
            <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wider mb-2 px-1">{section.title}</p>
            <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick || item.onChange}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-card-alt transition-colors"
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${item.highlight ? 'text-accent-warm' : 'text-text-tertiary'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium">{item.label}</p>
                    <p className={`text-xs truncate ${item.highlight ? 'text-accent-warm' : 'text-text-tertiary'}`}>{item.desc}</p>
                  </div>
                  {item.toggle && (
                    <div
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${item.value ? 'bg-accent' : 'bg-card-alt border border-border'}`}
                      role="switch"
                      aria-checked={item.value}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${item.value ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  )}
                  {item.chevron && <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* API Key Input */}
        {showApiInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-xl bg-card border border-accent/20"
          >
            <p className="text-sm text-text-primary font-medium mb-1">Anthropic API Key</p>
            <p className="text-xs text-text-secondary mb-3">Required for AI features (post enhancer, AI chat, trivia generation)</p>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all mb-3 font-mono"
            />
            <div className="flex gap-2">
              <button onClick={saveApiKey} className="px-4 py-2 rounded-xl bg-accent text-primary text-sm font-semibold active:scale-95 transition-transform">Save Key</button>
              <button onClick={() => setShowApiInput(false)} className="px-4 py-2 rounded-xl bg-card-alt text-text-secondary text-sm font-medium">Cancel</button>
            </div>
          </motion.div>
        )}

        {/* Danger Zone */}
        <div className="mb-6">
          <p className="text-xs text-accent-danger font-semibold uppercase tracking-wider mb-2 px-1">Danger Zone</p>
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-danger/10 text-accent-danger font-semibold text-sm hover:bg-accent-danger/20 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-accent-danger/30 text-accent-danger/70 text-sm hover:bg-accent-danger/5 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-accent-danger/10 border border-accent-danger/20">
            <p className="text-sm text-accent-danger font-medium mb-2">Are you sure?</p>
            <p className="text-xs text-text-secondary mb-3">This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-xl bg-card text-text-secondary text-sm font-medium">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-accent-danger text-white text-sm font-semibold">Delete</button>
            </div>
          </motion.div>
        )}

        <p className="text-center text-xs text-text-tertiary pb-8">CampusVibe v1.0.0</p>
      </div>
    </PageTransition>
  );
}
