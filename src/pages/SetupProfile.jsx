import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AVATARS } from '../data/avatars';
import Avatar from '../components/ui/Avatar';

const BRANCHES = [
  'Computer Science (CSE)', 'Electronics (ECE)', 'Electrical (EEE)', 'Mechanical',
  'Civil', 'Chemical', 'Biotechnology', 'Mathematics', 'Physics', 'Chemistry',
  'Economics', 'MBA', 'Law', 'Design', 'Architecture', 'Other'
];

const INTERESTS = [
  'Coding', 'Sports', 'Music', 'Food', 'Startups', 'Gaming',
  'Art', 'Travel', 'Fitness', 'Memes', 'Photography', 'Reading'
];

const STEP_LABELS = ['Profile', 'Academic', 'Interests'];

export default function SetupProfile() {
  const navigate = useNavigate();
  const { pendingEmail, pendingCollege, login } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: 'av1',
    year: '',
    branch: '',
    interests: [],
  });
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.username.trim()) e.username = 'Username is required';
    else if (!/^[a-z0-9_]+$/.test(form.username)) e.username = 'Lowercase letters, numbers, underscores only';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.year) e.year = 'Select your year';
    if (!form.branch) e.branch = 'Select your branch';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3) {
      const userData = {
        userId: 'user_me',
        email: pendingEmail || 'demo@iitd.ac.in',
        college: pendingCollege?.name || 'IIT Delhi',
        collegeDomain: pendingCollege?.domain || pendingEmail?.split('@')[1] || 'iitd.ac.in',
        city: pendingCollege?.city || 'New Delhi',
        ...form,
        credScore: 25,
        followers: 0,
        following: 0,
        postsCount: 0,
        reviewsCount: 0,
        joinedAt: new Date().toISOString(),
      };
      login(userData);
      navigate('/home');
    }
  };

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 5 ? [...prev.interests, interest] : prev.interests
    }));
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Step progress bar with labels */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-accent' : 'bg-card-alt'}`} />
          ))}
        </div>
        <div className="flex justify-between px-1">
          {STEP_LABELS.map((label, i) => (
            <span key={label} className={`text-[10px] font-medium transition-colors ${i + 1 <= step ? 'text-accent' : 'text-text-tertiary'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col mt-4"
      >
        {step === 1 && (
          <>
            <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Set up your profile</h1>
            <p className="text-text-secondary mb-6">Let's make you look awesome</p>

            {/* Avatar selection with preview */}
            <div className="flex flex-col items-center mb-6">
              <Avatar avatarId={form.avatar} size="xl" showRing ringColor="accent" className="mb-4" />
              <p className="text-xs text-text-tertiary mb-3">Choose your avatar</p>
              <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Choose avatar">
                {AVATARS.map(av => (
                  <button
                    key={av.id}
                    onClick={() => setForm({ ...form, avatar: av.id })}
                    role="radio"
                    aria-checked={form.avatar === av.id}
                    aria-label={av.label}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                      form.avatar === av.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-primary scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: `${av.bg.replace('bg-', '').split('-').slice(0, -1).join('-')}` }}
                  >
                    <Avatar avatarId={av.id} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="display-name" className="block text-sm text-text-secondary mb-1 font-medium">Display Name</label>
                <input
                  id="display-name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all"
                />
                {errors.name && <p className="text-accent-danger text-xs mt-1" role="alert">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="username" className="block text-sm text-text-secondary mb-1 font-medium">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" aria-hidden="true">@</span>
                  <input
                    id="username"
                    type="text"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    placeholder="username"
                    aria-invalid={!!errors.username}
                    className="w-full bg-input border border-border rounded-xl pl-9 pr-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all"
                  />
                </div>
                {errors.username && <p className="text-accent-danger text-xs mt-1" role="alert">{errors.username}</p>}
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm text-text-secondary mb-1 font-medium">Bio <span className="text-text-tertiary">(optional)</span></label>
                <textarea
                  id="bio"
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value.slice(0, 150) })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all resize-none"
                />
                <p className="text-text-tertiary text-xs text-right" aria-live="polite">{form.bio.length}/150</p>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Academic details</h1>
            <p className="text-text-secondary mb-6">Help us personalize your experience</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-medium">Year</label>
                <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Select year">
                  {['1st', '2nd', '3rd', '4th', '5th'].map(y => (
                    <button
                      key={y}
                      onClick={() => setForm({ ...form, year: y })}
                      role="radio"
                      aria-checked={form.year === y}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        form.year === y ? 'bg-accent text-primary' : 'bg-card border border-border text-text-secondary hover:border-accent/30'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                {errors.year && <p className="text-accent-danger text-xs mt-1" role="alert">{errors.year}</p>}
              </div>

              <div>
                <label htmlFor="branch-select" className="block text-sm text-text-secondary mb-2 font-medium">Branch / Department</label>
                <select
                  id="branch-select"
                  value={form.branch}
                  onChange={e => setForm({ ...form, branch: e.target.value })}
                  aria-invalid={!!errors.branch}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-text-primary outline-none focus:border-accent transition-all appearance-none"
                >
                  <option value="" className="text-text-tertiary">Select branch</option>
                  {BRANCHES.map(b => (
                    <option key={b} value={b} className="bg-input">{b}</option>
                  ))}
                </select>
                {errors.branch && <p className="text-accent-danger text-xs mt-1" role="alert">{errors.branch}</p>}
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Pick your interests</h1>
            <p className="text-text-secondary mb-6">Choose up to 5 topics you love</p>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Select interests">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  aria-pressed={form.interests.includes(interest)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    form.interests.includes(interest)
                      ? 'bg-accent/15 text-accent border border-accent/40'
                      : 'bg-card text-text-secondary border border-border hover:border-accent/30'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-text-tertiary text-xs mt-3" aria-live="polite">{form.interests.length}/5 selected</p>
          </>
        )}
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        className="w-full py-4 rounded-xl bg-accent text-primary font-bold text-lg transition-transform mt-6 flex items-center justify-center gap-2"
      >
        {step === 3 ? "Let's Go!" : 'Continue'} <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
