import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertCircle, ArrowRight, BadgeCheck, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COLLEGE_DOMAINS } from '../data/colleges';
import { getCollegeLogo } from '../data/collegeLogos';

function hashDomain(domain) {
  let h = 0;
  for (let i = 0; i < domain.length; i++) h = (h * 31 + domain.charCodeAt(i)) >>> 0;
  return h;
}

function activeVibes(domain) {
  const pool = [820, 1100, 1200, 1450, 1700, 2100, 2400, 3100, 3600];
  const n = pool[hashDomain(domain) % pool.length];
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : `${n}`;
}

export default function Login() {
  const navigate = useNavigate();
  const { sendOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const trimmed = email.trim().toLowerCase();
  const domain = trimmed.includes('@') ? trimmed.split('@')[1] : '';
  const matchedCollege = domain ? COLLEGE_DOMAINS[domain] : null;
  const logo = domain ? getCollegeLogo(domain) : null;

  const validateAndProceed = async () => {
    setError('');

    if (!trimmed) {
      setError('Please enter your college email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!matchedCollege) {
      setError('This email domain is not supported. Only verified college emails are allowed.');
      return;
    }

    setSending(true);
    try {
      await sendOtp(trimmed, matchedCollege);
      navigate('/verify');
    } catch (err) {
      setError(err?.message || 'Could not send code. Try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col px-6 py-10 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 w-80 h-80 rounded-full blur-[110px] bg-accent/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-[100px] bg-accent-purple/15"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex-1 flex flex-col w-full max-w-md mx-auto"
      >
        <header className="mb-10">
          <div className="mb-6">
            <span className="font-display italic font-black text-2xl text-accent tracking-tight">
              CampusVibe
            </span>
          </div>
          <h1 className="font-display font-bold text-[3.25rem] leading-[0.95] tracking-[-0.04em] mb-4">
            <span className="text-text-primary">Unlock</span>
            <br />
            <span className="text-accent">Your Campus.</span>
          </h1>
          <p className="text-text-secondary font-medium text-base leading-relaxed max-w-[280px]">
            Your college, your vibe, your people.
          </p>
        </header>

        <form
          onSubmit={e => { e.preventDefault(); validateAndProceed(); }}
          className="flex-1 flex flex-col gap-5"
          noValidate
        >
          <div className="space-y-2">
            <label
              htmlFor="college-email"
              className="block text-xs font-bold uppercase tracking-[0.2em] text-text-tertiary ml-1"
            >
              College Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-accent transition-colors"
                aria-hidden="true"
              />
              <input
                id="college-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="aravind@iitb.ac.in"
                aria-describedby={error ? 'email-error' : undefined}
                aria-invalid={!!error}
                className={`w-full bg-card/60 pl-12 pr-4 py-[18px] rounded-xl border-0 ring-1 outline-none transition-all text-text-primary text-base font-medium placeholder:text-text-tertiary ${
                  error
                    ? 'ring-accent-danger focus:ring-2 focus:ring-accent-danger'
                    : 'ring-border focus:ring-2 focus:ring-accent'
                }`}
                autoFocus
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>

            <div aria-live="assertive">
              {error && (
                <motion.p
                  id="email-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-accent-danger text-sm mt-2"
                  role="alert"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </motion.p>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {matchedCollege && (
              <motion.div
                key={domain}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="glass p-4 rounded-xl border border-accent/20 flex items-center gap-4"
              >
                <div className="relative w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                  {logo ? (
                    <img src={logo} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="font-display font-bold text-2xl text-accent">
                      {matchedCollege.name.charAt(0)}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-accent">
                      Verified Campus
                    </span>
                    <BadgeCheck className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary leading-tight truncate">
                    {matchedCollege.name}
                  </h3>
                  <p className="text-xs text-text-secondary font-medium">
                    {activeVibes(domain)} vibes active right now
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={sending}
            whileTap={{ scale: 0.97 }}
            className="w-full py-[18px] rounded-xl font-display font-black text-lg uppercase tracking-tight text-primary flex items-center justify-center gap-2 bg-gradient-to-br from-accent to-[#a8d84f] shadow-[0_10px_30px_-10px_rgba(200,245,96,0.55)] hover:scale-[1.01] active:scale-[0.97] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending code...' : 'Enter the Vibe'}
            {!sending && <ArrowRight className="w-5 h-5" strokeWidth={3} />}
          </motion.button>

          <div className="flex items-center gap-3 pt-2" aria-hidden="true">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-text-tertiary">
              New here?
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setError('Google sign-in is coming soon. Use your college email to continue.')}
              className="flex items-center justify-center gap-2 py-4 rounded-xl bg-card/70 hover:bg-card border border-border/60 font-bold text-text-primary active:scale-[0.98] transition-all"
            >
              <GoogleGlyph className="w-4 h-4" />
              <span className="text-sm">Google</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 py-4 rounded-xl bg-card/70 hover:bg-card border border-border/60 font-bold text-text-primary active:scale-[0.98] transition-all"
            >
              <Compass className="w-4 h-4" />
              <span className="text-sm">Explore</span>
            </button>
          </div>
        </form>

        <footer className="pt-10 text-center">
          <p className="text-text-tertiary text-xs font-medium">
            By entering, you agree to our{' '}
            <a href="#" className="text-accent hover:underline font-bold">Campus Code</a>
            {' '}&amp;{' '}
            <a href="#" className="text-accent hover:underline font-bold">Privacy</a>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}

function GoogleGlyph({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C33.6 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C33.6 6.1 29.1 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1c-2 1.4-4.4 2.1-7 2.1-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6 5.1c-.4.4 6.7-4.9 6.7-14.5 0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}
