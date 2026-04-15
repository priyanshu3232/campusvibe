import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import './styles/index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { FeedProvider } from './context/FeedContext';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { CredToastProvider } from './components/ui/CredToast';
import OfflineBanner from './components/ui/OfflineBanner';

// Initialize native plugins when running on a native platform
if (Capacitor.isNativePlatform()) {
  import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: '#1A1A2E' });
  }).catch(() => {});

  import('@capacitor/splash-screen').then(({ SplashScreen }) => {
    SplashScreen.hide();
  }).catch(() => {});
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FeedProvider>
            <ToastProvider>
              <CredToastProvider>
                <GameProvider>
                  <OfflineBanner />
                  <a href="#main-content" className="skip-link">Skip to content</a>
                  <App />
                </GameProvider>
              </CredToastProvider>
            </ToastProvider>
          </FeedProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
