import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  UserPen,
  Zap,
  Radio,
  Bell,
  Palette,
  Globe,
  Eye,
  Ban,
  Copy,
  Check,
  Edit3,
  LogOut,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getProfileImage } from '../utils/profileImage';
import Avatar from '../components/ui/Avatar';
import PageTransition from '../components/layout/PageTransition';

function maskKey(key) {
  if (!key) return '';
  if (key.length <= 10) return key;
  return `${key.slice(0, 7)}${'•'.repeat(14)}`;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState(localStorage.getItem('campusvibe_api_key') || '');
  const [keyDraft, setKeyDraft] = useState('');
  const [editingKey, setEditingKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const saveApiKey = () => {
    const next = keyDraft.trim();
    if (next) {
      localStorage.setItem('campusvibe_api_key', next);
      setApiKey(next);
    } else {
      localStorage.removeItem('campusvibe_api_key');
      setApiKey('');
    }
    setEditingKey(false);
    setKeyDraft('');
  };

  const copyKey = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <PageTransition>
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 bg-primary/90 backdrop-blur-xl shadow-[0_0_40px_rgba(200,245,96,0.08)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 rounded-full text-accent hover:bg-accent/10 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-xl text-accent tracking-tight">Settings</h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-card-alt border border-border overflow-hidden flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Open profile"
        >
          <Avatar
            avatarId={user?.avatar}
            imageUrl={user?.imageUrl || (user ? getProfileImage(user.id || user.username || user.email) : undefined)}
            size="md"
            className="scale-110"
          />
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8 pb-24">
        <SectionHeading barColor="bg-accent">Account</SectionHeading>
        <div className="space-y-3 mb-10">
          <RowCard onClick={() => navigate('/setup-profile')}>
            <IconTile tint="lime">
              <UserPen className="w-5 h-5" strokeWidth={2.2} />
            </IconTile>
            <RowTextStack
              title="Edit Profile"
              subtitle={user?.name ? `Update your photo and bio` : 'Set up your profile'}
            />
            <Chevron />
          </RowCard>

          <div className="bg-card/60 rounded-xl p-5 border-l-4 border-accent-purple transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <IconTile tint="purple">
                  <Zap className="w-5 h-5 fill-accent-purple" />
                </IconTile>
                <div>
                  <p className="font-display font-semibold text-text-primary">Claude API Key</p>
                  <p className="text-sm text-text-secondary">Manage your AI integration</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingKey(!editingKey);
                  setKeyDraft(apiKey);
                }}
                className="text-accent-purple hover:bg-accent-purple/10 p-2 rounded-lg transition-colors"
                aria-label={editingKey ? 'Cancel edit' : 'Edit key'}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {editingKey ? (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-xs text-text-secondary">
                  Required for AI features (post enhancer, AI chat, trivia generation)
                </p>
                <input
                  type="password"
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm font-mono text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-purple transition-all"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveApiKey}
                    className="flex-1 px-4 py-2 rounded-lg bg-accent-purple text-white text-sm font-semibold active:scale-95 transition-transform"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingKey(false);
                      setKeyDraft('');
                    }}
                    className="px-4 py-2 rounded-lg bg-card-alt text-text-secondary text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-surface rounded-lg p-3 flex items-center justify-between font-mono text-sm text-accent-purple/90 border border-border/40">
                <span className="truncate">
                  {apiKey ? maskKey(apiKey) : 'No key set — AI features disabled'}
                </span>
                {apiKey && (
                  <button
                    onClick={copyKey}
                    aria-label="Copy API key"
                    className="shrink-0 ml-2 text-accent-purple hover:bg-accent-purple/10 p-1 rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-card/60 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <IconTile tint="warm">
                <Radio className="w-5 h-5" />
              </IconTile>
              <div>
                <p className="font-display font-semibold text-text-primary">Activity Status</p>
                <p className="text-sm text-text-secondary">Show when you're online</p>
              </div>
            </div>
            <Toggle checked={activityStatus} onChange={() => setActivityStatus(v => !v)} label="Activity status" />
          </div>
        </div>

        <SectionHeading barColor="bg-accent-purple">Preferences</SectionHeading>
        <div className="bg-card/60 rounded-xl overflow-hidden mb-10">
          <PreferenceRow
            icon={<Bell className="w-5 h-5" />}
            label="Push Notifications"
            onClick={() => setNotifications(v => !v)}
          >
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                notifications
                  ? 'bg-accent/10 text-accent'
                  : 'bg-card-alt text-text-tertiary'
              }`}
            >
              {notifications ? 'All On' : 'Off'}
            </span>
          </PreferenceRow>

          <PreferenceRow
            icon={<Palette className="w-5 h-5" />}
            label="Appearance"
            onClick={toggleTheme}
            tonalShift
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary capitalize">
                {theme === 'dark' ? 'Midnight Neon' : 'Daylight'}
              </span>
              <Chevron />
            </div>
          </PreferenceRow>

          <PreferenceRow
            icon={<Globe className="w-5 h-5" />}
            label="Language"
            onClick={() => {}}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">English (IN)</span>
              <Chevron />
            </div>
          </PreferenceRow>
        </div>

        <SectionHeading barColor="bg-accent-warm">Privacy &amp; Safety</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="relative overflow-hidden rounded-2xl p-6 aspect-square md:aspect-video glass border border-border/30 flex flex-col justify-between group">
            <div
              aria-hidden="true"
              className="absolute -top-4 -right-4 w-28 h-28 bg-accent-purple/15 rounded-full blur-2xl"
            />
            <div className="relative">
              <Eye className="w-7 h-7 text-accent-purple mb-4" />
              <p className="font-display font-bold text-xl leading-tight text-text-primary">
                Profile
                <br />
                Visibility
              </p>
            </div>
            <div className="relative flex items-center justify-between mt-4">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-purple">
                Public
              </span>
              <button
                className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple group-hover:scale-110 transition-transform"
                aria-label="Edit visibility"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden bg-card/70 p-6 rounded-2xl aspect-square md:aspect-video border border-border/40 flex flex-col justify-between">
            <div>
              <Ban className="w-7 h-7 text-accent-danger mb-4" />
              <p className="font-display font-bold text-xl leading-tight text-text-primary">
                Blocked
                <br />
                Users
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs font-bold text-text-secondary">0 People</span>
              <button className="px-4 py-2 rounded-full bg-card-alt text-xs font-bold text-text-primary hover:bg-card-alt/80 transition-colors">
                Manage
              </button>
            </div>
          </div>
        </div>

        <section className="bg-accent/5 rounded-3xl p-8 text-center border border-accent/15 mb-10">
          <h3 className="font-display font-bold text-2xl text-accent mb-2">Need help, Boss?</h3>
          <p className="text-text-secondary mb-6 max-w-xs mx-auto">
            Our support crew is active 24/7 for the nocturnal community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-gradient-to-br from-accent to-[#a8d84f] text-primary px-8 py-3 rounded-full font-bold transition-all hover:shadow-[0_0_20px_rgba(200,245,96,0.3)] active:scale-95">
              Contact Support
            </button>
            <button className="px-8 py-3 rounded-full font-bold border-2 border-accent/30 text-accent hover:bg-accent/10 transition-colors">
              Read FAQs
            </button>
          </div>
        </section>

        <div className="space-y-2 mb-12">
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

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-accent-danger/10 border border-accent-danger/20"
            >
              <p className="text-sm text-accent-danger font-medium mb-2">Are you sure?</p>
              <p className="text-xs text-text-secondary mb-3">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-card text-text-secondary text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-accent-danger text-white text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-center pt-6">
          <p className="font-display font-black text-4xl tracking-tighter uppercase select-none text-border/40">
            Neon Monsoon
          </p>
          <p className="text-[10px] text-text-tertiary mt-2 uppercase tracking-[0.2em]">
            CampusVibe v1.0.0 · Made with Midnight Energy
          </p>
        </footer>
      </main>
    </PageTransition>
  );
}

function SectionHeading({ barColor, children }) {
  return (
    <h2 className="font-display font-bold text-2xl mb-6 tracking-tight text-text-primary flex items-center gap-3">
      <span className={`w-1.5 h-8 ${barColor} rounded-full`} />
      {children}
    </h2>
  );
}

function RowCard({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card/60 hover:bg-card transition-colors rounded-xl p-5 flex items-center justify-between gap-4 text-left group"
    >
      {children}
    </button>
  );
}

function RowTextStack({ title, subtitle }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="font-display font-semibold text-text-primary truncate">{title}</p>
      <p className="text-sm text-text-secondary truncate">{subtitle}</p>
    </div>
  );
}

function IconTile({ tint, children }) {
  const tints = {
    lime: 'bg-accent/10 text-accent',
    purple: 'bg-accent-purple/10 text-accent-purple',
    warm: 'bg-accent-warm/10 text-accent-warm',
    danger: 'bg-accent-danger/10 text-accent-danger',
  };
  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tints[tint]}`}>
      {children}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      className="w-5 h-5 text-text-tertiary shrink-0 group-hover:text-accent transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-accent' : 'bg-card-alt border border-border'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function PreferenceRow({ icon, label, onClick, tonalShift, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-5 flex items-center justify-between transition-colors text-left ${
        tonalShift ? 'bg-card-alt/50 hover:bg-card-alt' : 'hover:bg-card-alt/40'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="text-text-secondary">{icon}</span>
        <p className="font-medium text-text-primary">{label}</p>
      </div>
      {children}
    </button>
  );
}
