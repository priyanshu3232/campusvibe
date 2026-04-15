import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, MapPinOff } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm"
      >
        <div className="w-24 h-24 rounded-3xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-6">
          <MapPinOff className="w-12 h-12 text-accent-purple" />
        </div>
        <h1 className="text-6xl font-display font-bold text-text-primary mb-2">404</h1>
        <h2 className="text-xl font-display font-semibold text-text-primary mb-3">
          Page Not Found
        </h2>
        <p className="text-text-secondary mb-8">
          Looks like this page bunked class today. Maybe it's at the canteen?
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-text-secondary font-medium hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-primary font-semibold"
          >
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
