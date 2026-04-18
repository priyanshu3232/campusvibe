import { createContext, useContext, useReducer, useEffect } from 'react';

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
    case 'SET_PENDING_EMAIL':
      return { ...state, pendingEmail: action.payload.email, pendingCollege: action.payload.college };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true, pendingEmail: null, pendingCollege: null };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('campusvibe_user');
      if (stored) {
        dispatch({ type: 'INIT', payload: JSON.parse(stored) });
      } else {
        dispatch({ type: 'INIT', payload: null });
      }
    } catch {
      dispatch({ type: 'INIT', payload: null });
    }
  }, []);

  const setPendingEmail = (email, college) => {
    dispatch({ type: 'SET_PENDING_EMAIL', payload: { email, college } });
  };

  const login = (userData) => {
    localStorage.setItem('campusvibe_user', JSON.stringify(userData));
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const updateProfile = (updates) => {
    const updated = { ...state.user, ...updates };
    localStorage.setItem('campusvibe_user', JSON.stringify(updated));
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  };

  const logout = () => {
    localStorage.removeItem('campusvibe_user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, setPendingEmail, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export const useAuth = () => useContext(AuthContext);
