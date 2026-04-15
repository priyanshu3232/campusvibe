import { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => { setIsOffline(false); setDismissed(false); };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] offline-banner">
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-accent-warm text-primary text-sm font-medium">
        <WifiOff className="w-4 h-4" />
        <span>You're offline. Some features may not work.</span>
        <button onClick={() => setDismissed(true)} className="ml-2 p-0.5 rounded hover:bg-black/10" aria-label="Dismiss offline notification">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
