import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COLLEGE_DOMAINS } from '../data/colleges';
import { getCollegeLogo } from '../data/collegeLogos';

export default function Login() {
  const navigate = useNavigate();
  const { setPendingEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateAndProceed = () => {
    setError('');
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      setError('Please enter your college email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    const domain = trimmed.split('@')[1];
    const college = COLLEGE_DOMAINS[domain];

    if (!college) {
      setError('This email domain is not supported. Only verified college emails are allowed.');
      return;
    }

    setPendingEmail(trimmed, college);
    navigate('/verify');
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-text-tertiary hover:text-text-secondary transition-colors mb-8 self-start"
        aria-label="Back to onboarding"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
          Join your campus
        </h1>
        <p className="text-text-secondary mb-8">
          Sign in with your official college email to connect with your community.
        </p>

        <form
          onSubmit={e => { e.preventDefault(); validateAndProceed(); }}
          className="space-y-4 flex-1"
          noValidate
        >
          <div>
            <label htmlFor="college-email" className="block text-sm text-text-secondary mb-2 font-medium">College Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" aria-hidden="true" />
              <input
                id="college-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="name@iitd.ac.in"
                aria-describedby={error ? 'email-error' : undefined}
                aria-invalid={!!error}
                className={`w-full bg-input border rounded-xl pl-12 pr-4 py-4 text-text-primary placeholder:text-text-tertiary outline-none transition-all ${
                  error ? 'border-accent-danger focus:ring-accent-danger/30' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent/30'
                }`}
                autoFocus
              />
            </div>
            {(() => {
              const trimmed = email.trim().toLowerCase();
              const domain = trimmed.includes('@') ? trimmed.split('@')[1] : '';
              const matchedCollege = domain ? COLLEGE_DOMAINS[domain] : null;
              const logo = domain ? getCollegeLogo(domain) : null;
              if (matchedCollege) {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-success/10 border border-success/20"
                  >
                    {logo && <img src={logo} alt="" className="w-6 h-6 object-contain" />}
                    <span className="text-sm text-success font-medium">{matchedCollege.name}, {matchedCollege.city}</span>
                  </motion.div>
                );
              }
              return null;
            })()}
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

          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-text-tertiary mb-2 font-medium">Supported colleges include:</p>
            <div className="flex flex-wrap gap-1.5">
              {['IITs', 'NITs', 'BITS', 'IIITs', 'VIT', 'SRM', 'DTU', 'DU', 'JNU', 'Manipal', 'IIMs'].map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-card-alt rounded-full text-xs text-text-secondary">
                  {tag}
                </span>
              ))}
              <span className="px-2 py-0.5 bg-card-alt rounded-full text-xs text-text-secondary">+25 more</span>
            </div>
          </div>

          <div className="flex-1" />

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-accent text-primary font-bold text-lg active:scale-[0.98] transition-transform"
          >
            Continue
          </button>
        </form>
      </motion.div>
    </div>
  );
}
