import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabase';
import { rootCollegeDomain } from '../data/colleges';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  pendingEmail: null,
  pendingCollege: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, isLoading: false };
    case 'SET_PENDING':
      return { ...state, pendingEmail: action.payload.email, pendingCollege: action.payload.college };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true, pendingEmail: null, pendingCollege: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

function mapProfile(profile, email) {
  if (!profile) return null;
  return {
    id: profile.id,
    email,
    name: profile.display_name,
    username: profile.username,
    bio: profile.bio || '',
    avatar: profile.avatar_id || 'av1',
    college: profile.college?.name || null,
    collegeDomain: profile.college?.domains?.[0] || null,
    city: profile.college?.city || null,
    year: profile.year,
    branch: profile.branch,
    interests: profile.interests || [],
    credScore: profile.cred_score || 0,
    level: profile.level || 'Fresher',
    followers: profile.follower_count || 0,
    following: profile.following_count || 0,
    postsCount: profile.post_count || 0,
    setupComplete: !!profile.college_id,
  };
}

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, college:colleges(id, name, city, domains)')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('fetchProfile error', error);
    return null;
  }
  return data;
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const session = data.session;
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        dispatch({ type: 'INIT', payload: mapProfile(profile, session.user.email) });
      } else {
        dispatch({ type: 'INIT', payload: null });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        dispatch({ type: 'LOGIN', payload: mapProfile(profile, session.user.email) });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const setPendingEmail = useCallback((email, college) => {
    dispatch({ type: 'SET_PENDING', payload: { email, college } });
  }, []);

  const sendOtp = useCallback(async (email, college) => {
    dispatch({ type: 'SET_PENDING', payload: { email, college } });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  }, []);

  const verifyOtp = useCallback(async (email, code) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });
    if (error) throw error;
    const profile = await fetchProfile(data.user.id);
    const user = mapProfile(profile, data.user.email);
    dispatch({ type: 'LOGIN', payload: user });
    return user;
  }, []);

  const completeSetup = useCallback(async (formData) => {
    const { data: sess } = await supabase.auth.getSession();
    const userId = sess.session?.user?.id;
    if (!userId) throw new Error('Not authenticated');

    let collegeId = formData.collegeId || null;
    if (!collegeId) {
      const domain = state.pendingEmail?.split('@')[1];
      const root = rootCollegeDomain(domain);
      if (root) {
        const { data: col } = await supabase
          .from('colleges')
          .select('id')
          .contains('domains', [root])
          .maybeSingle();
        collegeId = col?.id || null;
      }
    }

    const updates = {
      username: formData.username,
      display_name: formData.name,
      bio: formData.bio || null,
      avatar_id: formData.avatar,
      year: formData.year ? parseInt(formData.year, 10) : null,
      branch: formData.branch,
      interests: formData.interests,
      college_id: collegeId,
    };

    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (error) throw error;

    const profile = await fetchProfile(userId);
    const user = mapProfile(profile, sess.session.user.email);
    dispatch({ type: 'LOGIN', payload: user });
    return user;
  }, [state.pendingEmail]);

  const updateProfile = useCallback(async (updates) => {
    const userId = state.user?.id;
    if (!userId) return;
    const dbUpdates = {};
    if ('name' in updates) dbUpdates.display_name = updates.name;
    if ('bio' in updates) dbUpdates.bio = updates.bio;
    if ('avatar' in updates) dbUpdates.avatar_id = updates.avatar;
    if ('interests' in updates) dbUpdates.interests = updates.interests;
    if (Object.keys(dbUpdates).length) {
      await supabase.from('profiles').update(dbUpdates).eq('id', userId);
    }
    dispatch({ type: 'UPDATE_USER', payload: updates });
  }, [state.user?.id]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = {
    ...state,
    setPendingEmail,
    sendOtp,
    verifyOtp,
    completeSetup,
    login: completeSetup,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
export const useAuth = () => useContext(AuthContext);
