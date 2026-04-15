import { useRef, useEffect } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) {
  const controls = useAnimation();
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0.2]);
  const modalRef = useRef(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', trap);
    first?.focus();
    return () => document.removeEventListener('keydown', trap);
  }, [isOpen, onClose]);

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 100 || info.velocity.y > 300) {
      onClose();
    } else {
      controls.start({ y: 0 });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            style={{ y, opacity }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ y: '100%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed z-50 bottom-0 inset-x-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full sm:mx-4"
          >
            <div className={`glass-strong rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto ${className}`}>
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-text-tertiary/40" />
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h2 className="text-text-primary font-display font-semibold text-lg">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-card/50"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="px-5 py-4">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
