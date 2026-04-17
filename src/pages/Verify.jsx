import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCollegeLogo } from '../data/collegeLogos';

export default function Verify() {
  const navigate = useNavigate();
  const { pendingEmail, pendingCollege, verifyOtp, sendOtp } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!pendingEmail) {
      navigate('/login');
      return;
    }
    inputRefs.current[0]?.focus();
  }, [pendingEmail, navigate]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const submitCode = async (code) => {
    if (verifying || verified) return;
    setError('');
    setVerifying(true);
    try {
      const user = await verifyOtp(pendingEmail, code);
      setVerified(true);
      setTimeout(() => {
        if (user?.setupComplete) navigate('/home');
        else navigate('/setup-profile');
      }, 600);
    } catch (err) {
      setError(err?.message || 'Invalid code. Try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== '') && next.length === 6) {
      submitCode(next.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split('');
    const next = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    if (digits.length === 6) submitCode(pasted);
    else inputRefs.current[digits.length]?.focus();
  };

  const resend = async () => {
    if (resendIn > 0) return;
    setError('');
    try {
      await sendOtp(pendingEmail, pendingCollege);
      setResendIn(30);
    } catch (err) {
      setError(err?.message || 'Could not resend code.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-1 text-text-tertiary hover:text-text-secondary transition-colors mb-8 self-start"
        aria-label="Back to login"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-accent" />
        </div>

        <h1 className="text-2xl font-display font-bold text-text-primary mb-2 text-center">
          Verify your email
        </h1>
        <p className="text-text-secondary text-center mb-2">We sent a 6-digit code to</p>
        <p className="text-accent font-medium mb-8">{pendingEmail}</p>

        <div className="flex gap-3 mb-6" role="group" aria-label="Verification code">
          {otp.map((digit, i) => (
            <motion.input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              disabled={verifying || verified}
              animate={digit ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.2 }}
              aria-label={`Digit ${i + 1}`}
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all disabled:opacity-60 ${
                digit
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-input border-border text-text-primary focus:border-accent focus:ring-1 focus:ring-accent/30'
              }`}
            />
          ))}
        </div>

        <div aria-live="polite" className="min-h-[24px]">
          {verifying && (
            <p className="text-text-secondary text-sm">Verifying...</p>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="flex items-center gap-1.5 text-accent-danger text-sm"
            >
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </motion.p>
          )}

          {verified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-success"
              role="status"
            >
              <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                <span className="text-primary text-sm font-bold">✓</span>
              </div>
              <span className="font-medium">Verified!</span>
            </motion.div>
          )}
        </div>

        <button
          onClick={resend}
          disabled={resendIn > 0}
          className="text-sm text-text-tertiary mt-4 hover:text-accent transition-colors disabled:hover:text-text-tertiary"
        >
          {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
        </button>

        {pendingCollege && (
          <div className="mt-8 bg-card rounded-xl p-4 border border-border w-full max-w-xs text-center">
            <p className="text-xs text-text-tertiary mb-1">Joining</p>
            {getCollegeLogo(pendingCollege?.domain) && (
              <img src={getCollegeLogo(pendingCollege.domain)} alt="" className="w-10 h-10 object-contain mx-auto mb-2" />
            )}
            <p className="font-display font-bold text-text-primary">{pendingCollege.name}</p>
            <p className="text-xs text-text-secondary">{pendingCollege.city}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
