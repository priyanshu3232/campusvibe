import { createContext, useContext, useReducer, useEffect } from 'react';

const FeedContext = createContext(null);

const initialState = {
  posts: [],
  userLikes: [],
  userSaves: [],
  pollVotes: {},
};

function feedReducer(state, action) {
  switch (action.type) {
    case 'INIT_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POST': {
      const newPost = { ...action.payload, id: 'post_' + Date.now(), timestamp: new Date().toISOString(), likes: 0, comments: 0, shares: 0, saves: 0 };
      const posts = [newPost, ...state.posts];
      localStorage.setItem('campusvibe_posts', JSON.stringify(posts));
      return { ...state, posts };
    }
    case 'TOGGLE_LIKE': {
      const postId = action.payload;
      const liked = state.userLikes.includes(postId);
      const userLikes = liked ? state.userLikes.filter(id => id !== postId) : [...state.userLikes, postId];
      const posts = state.posts.map(p => p.id === postId ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p);
      localStorage.setItem('campusvibe_likes', JSON.stringify(userLikes));
      localStorage.setItem('campusvibe_posts', JSON.stringify(posts));
      return { ...state, userLikes, posts };
    }
    case 'TOGGLE_SAVE': {
      const postId = action.payload;
      const saved = state.userSaves.includes(postId);
      const userSaves = saved ? state.userSaves.filter(id => id !== postId) : [...state.userSaves, postId];
      localStorage.setItem('campusvibe_saves', JSON.stringify(userSaves));
      return { ...state, userSaves };
    }
    case 'VOTE_POLL': {
      const { postId, optionIndex } = action.payload;
      if (state.pollVotes[postId] !== undefined) return state;
      const pollVotes = { ...state.pollVotes, [postId]: optionIndex };
      const posts = state.posts.map(p => {
        if (p.id !== postId || !p.pollOptions) return p;
        const pollOptions = p.pollOptions.map((opt, i) => i === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt);
        return { ...p, pollOptions };
      });
      localStorage.setItem('campusvibe_poll_votes', JSON.stringify(pollVotes));
      localStorage.setItem('campusvibe_posts', JSON.stringify(posts));
      return { ...state, pollVotes, posts };
    }
    default:
      return state;
  }
}

export function FeedProvider({ children }) {
  const [state, dispatch] = useReducer(feedReducer, initialState);

  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem('campusvibe_posts');
      const storedLikes = localStorage.getItem('campusvibe_likes');
      const storedSaves = localStorage.getItem('campusvibe_saves');
      const storedVotes = localStorage.getItem('campusvibe_poll_votes');

      if (storedPosts) {
        dispatch({ type: 'INIT_POSTS', payload: JSON.parse(storedPosts) });
      } else {
        import('../data/mockPosts.js').then(mod => {
          const posts = mod.MOCK_POSTS || mod.default;
          localStorage.setItem('campusvibe_posts', JSON.stringify(posts));
          dispatch({ type: 'INIT_POSTS', payload: posts });
        });
      }

      if (storedLikes) {
        dispatch({ type: 'INIT_POSTS', payload: JSON.parse(localStorage.getItem('campusvibe_posts') || '[]') });
        Object.assign(initialState, { userLikes: JSON.parse(storedLikes) });
      }
    } catch {}
  }, []);

  const addPost = (post) => dispatch({ type: 'ADD_POST', payload: post });
  const toggleLike = (postId) => dispatch({ type: 'TOGGLE_LIKE', payload: postId });
  const toggleSave = (postId) => dispatch({ type: 'TOGGLE_SAVE', payload: postId });
  const votePoll = (postId, optionIndex) => dispatch({ type: 'VOTE_POLL', payload: { postId, optionIndex } });

  return (
    <FeedContext.Provider value={{ ...state, addPost, toggleLike, toggleSave, votePoll }}>
      {children}
    </FeedContext.Provider>
  );
}

export default FeedContext;
export const useFeed = () => useContext(FeedContext);
