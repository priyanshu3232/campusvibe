import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import BottomNav from './components/layout/BottomNav';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

const Onboarding = lazy(() => import('./pages/Onboarding'));
const Login = lazy(() => import('./pages/Login'));
const Verify = lazy(() => import('./pages/Verify'));
const SetupProfile = lazy(() => import('./pages/SetupProfile'));
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Create = lazy(() => import('./pages/Create'));
const Chat = lazy(() => import('./pages/Chat'));
const ChatDetail = lazy(() => import('./pages/ChatDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Community = lazy(() => import('./pages/Community'));
const Reviews = lazy(() => import('./pages/Reviews'));
const PlaceDetail = lazy(() => import('./pages/PlaceDetail'));
const Games = lazy(() => import('./pages/Games'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center" role="status" aria-label="Loading">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-accent mb-2">CampusVibe</h1>
        <div className="flex gap-1 justify-center">
          <div className="w-2 h-2 rounded-full bg-accent typing-dot" />
          <div className="w-2 h-2 rounded-full bg-accent typing-dot" />
          <div className="w-2 h-2 rounded-full bg-accent typing-dot" />
        </div>
      </div>
    </div>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary">
      <Suspense fallback={<LoadingScreen />}>
        {children}
      </Suspense>
    </div>
  );
}

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary">
      <Sidebar />
      <div className="md:ml-20 lg:ml-64 transition-all duration-300">
        <TopBar />
        <main id="main-content" className="pb-20 md:pb-4 max-w-lg mx-auto md:max-w-2xl" role="main">
          <Suspense fallback={<LoadingScreen />}>
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </Suspense>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/" element={<AuthLayout><Onboarding /></AuthLayout>} />
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/verify" element={<AuthLayout><Verify /></AuthLayout>} />
          <Route path="/setup-profile" element={<AuthLayout><SetupProfile /></AuthLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/explore" element={<AppLayout><Explore /></AppLayout>} />
          <Route path="/create" element={<AppLayout><Create /></AppLayout>} />
          <Route path="/chat" element={<AppLayout><Chat /></AppLayout>} />
          <Route path="/chat/:userId" element={<AppLayout><ChatDetail /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          <Route path="/profile/:userId" element={<AppLayout><UserProfile /></AppLayout>} />
          <Route path="/community" element={<AppLayout><Community /></AppLayout>} />
          <Route path="/reviews" element={<AppLayout><Reviews /></AppLayout>} />
          <Route path="/reviews/:placeId" element={<AppLayout><PlaceDetail /></AppLayout>} />
          <Route path="/games" element={<AppLayout><Games /></AppLayout>} />
          <Route path="/leaderboard" element={<AppLayout><Leaderboard /></AppLayout>} />
          <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          <Route path="/404" element={<AppLayout><NotFound /></AppLayout>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </>
      )}
    </Routes>
  );
}
