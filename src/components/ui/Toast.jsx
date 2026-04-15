import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const typeConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-success',
    border: 'border-success/30',
  },
  error: {
    icon: XCircle,
    color: 'text-accent-danger',
    border: 'border-accent-danger/30',
  },
  info: {
    icon: Info,
    color: 'text-accent',
    border: 'border-accent/30',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-accent-warm',
    border: 'border-accent-warm/30',
  },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info') => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-80 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = typeConfig[toast.type] || typeConfig.info;
            const Icon = config.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`
                  glass-strong rounded-xl px-4 py-3
                  flex items-center gap-3
                  border ${config.border}
                  pointer-events-auto shadow-lg
                `}
              >
                <Icon size={18} className={`${config.color} shrink-0`} />
                <p className="text-text-primary text-sm font-body flex-1">
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-text-tertiary hover:text-text-primary transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
