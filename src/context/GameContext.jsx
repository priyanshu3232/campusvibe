import { createContext, useContext, useReducer, useEffect } from 'react';
import { getLevel, addCred, CRED_ACTIONS } from '../utils/credSystem';
import { useCredToast } from '../components/ui/CredToast';

const GameContext = createContext(null);

const initialState = {
  credScore: 0,
  level: null,
  gameScores: { trivia: [], guessCollege: [], wordChain: [] },
  dailyLoginClaimed: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload, level: getLevel(action.payload.credScore || 0) };
    case 'ADD_CRED': {
      const credScore = addCred(state.credScore, action.payload);
      const level = getLevel(credScore);
      return { ...state, credScore, level };
    }
    case 'SET_CRED': {
      const credScore = action.payload;
      const level = getLevel(credScore);
      return { ...state, credScore, level };
    }
    case 'ADD_GAME_SCORE': {
      const { game, score } = action.payload;
      const gameScores = { ...state.gameScores, [game]: [...(state.gameScores[game] || []), { score, date: new Date().toISOString() }] };
      return { ...state, gameScores };
    }
    case 'CLAIM_DAILY_LOGIN':
      return { ...state, dailyLoginClaimed: true };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('campusvibe_game');
      if (stored) {
        dispatch({ type: 'INIT', payload: JSON.parse(stored) });
      } else {
        dispatch({ type: 'INIT', payload: { credScore: 25 } });
      }
    } catch {
      dispatch({ type: 'INIT', payload: { credScore: 25 } });
    }
  }, []);

  useEffect(() => {
    if (state.credScore > 0) {
      localStorage.setItem('campusvibe_game', JSON.stringify({
        credScore: state.credScore,
        gameScores: state.gameScores,
        dailyLoginClaimed: state.dailyLoginClaimed,
      }));
    }
  }, [state.credScore, state.gameScores, state.dailyLoginClaimed]);

  const { showCredToast } = useCredToast();

  const earnCred = (action) => {
    dispatch({ type: 'ADD_CRED', payload: action });
    const points = CRED_ACTIONS[action];
    if (points && showCredToast) {
      showCredToast(points, action.replace(/_/g, ' '));
    }
  };
  const setCred = (score) => dispatch({ type: 'SET_CRED', payload: score });
  const addGameScore = (game, score) => dispatch({ type: 'ADD_GAME_SCORE', payload: { game, score } });
  const claimDailyLogin = () => {
    dispatch({ type: 'CLAIM_DAILY_LOGIN' });
    earnCred('daily_login');
  };

  return (
    <GameContext.Provider value={{ ...state, earnCred, setCred, addGameScore, claimDailyLogin }}>
      {children}
    </GameContext.Provider>
  );
}

export default GameContext;
export const useGame = () => useContext(GameContext);
