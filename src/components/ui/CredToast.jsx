import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const CredToastContext = createContext(null);

export function CredToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showCredToast = useCallback((points, action) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, points, action }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2000);
  }, []);

  return (
    <CredToastContext.Provider value={{ showCredToast }}>
      {children}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40"
            >
              <Zap className="w-4 h-4 text-accent fill-accent" />
              <span className="text-accent font-bold text-sm">+{toast.points} Cred</span>
              {toast.action && (
                <span className="text-text-secondary text-xs">{toast.action}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </CredToastContext.Provider>
  );
}

export const useCredToast = () => useContext(CredToastContext);
