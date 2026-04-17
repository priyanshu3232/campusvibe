import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from './AuthContext';

const FeedContext = createContext(null);
const PAGE_SIZE = 10;

const initialState = {
  posts: [],
  userLikes: [],
  userSaves: [],
  pollVotes: {},
  loading: false,
  loadingMore: false,
  hasMore: true,
  scope: 'global',
  cursor: null,
};

function feedReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        posts: action.payload.posts,
        cursor: action.payload.cursor,
        hasMore: action.payload.hasMore,
        scope: action.payload.scope,
      };
    case 'LOAD_MORE_START':
      return { ...state, loadingMore: true };
    case 'LOAD_MORE_SUCCESS':
      return {
        ...state,
        loadingMore: false,
        posts: [...state.posts, ...action.payload.posts],
        cursor: action.payload.cursor,
        hasMore: action.payload.hasMore,
      };
    case 'SET_INTERACTIONS':
      return {
        ...state,
        userLikes: action.payload.userLikes,
        userSaves: action.payload.userSaves,
        pollVotes: action.payload.pollVotes,
      };
    case 'PREPEND_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'TOGGLE_LIKE': {
      const postId = action.payload;
      const liked = state.userLikes.includes(postId);
      return {
        ...state,
        userLikes: liked ? state.userLikes.filter(id => id !== postId) : [...state.userLikes, postId],
        posts: state.posts.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes + (liked ? -1 : 1)) } : p),
      };
    }
    case 'TOGGLE_SAVE': {
      const postId = action.payload;
      const saved = state.userSaves.includes(postId);
      return {
        ...state,
        userSaves: saved ? state.userSaves.filter(id => id !== postId) : [...state.userSaves, postId],
      };
    }
    case 'VOTE_POLL': {
      const { postId, optionIndex } = action.payload;
      if (state.pollVotes[postId] !== undefined) return state;
      return {
        ...state,
        pollVotes: { ...state.pollVotes, [postId]: optionIndex },
        posts: state.posts.map(p => {
          if (p.id !== postId || !p.pollOptions) return p;
          return {
            ...p,
            pollOptions: p.pollOptions.map((opt, i) =>
              i === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          };
        }),
      };
    }
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

function mapPost(row) {
  const author = row.author || {};
  const college = author.college || row.college || null;
  const domain = college?.domains?.[0] || null;
  const pollOptions = (row.poll_options || [])
    .slice()
    .sort((a, b) => a.idx - b.idx)
    .map(o => ({ id: o.id, text: o.text, votes: o.vote_count || 0 }));
  return {
    id: row.id,
    userId: author.id,
    type: row.type,
    content: row.body,
    tags: row.hashtags || [],
    isGlobal: row.scope === 'global',
    image: null,
    timestamp: row.created_at,
    likes: row.like_count || 0,
    comments: row.comment_count || 0,
    shares: row.share_count || 0,
    saves: 0,
    collegeName: college?.name || null,
    pollOptions: pollOptions.length ? pollOptions : undefined,
    pollDuration: '24h',
    author: {
      id: author.id,
      name: author.display_name,
      username: author.username,
      avatar: author.avatar_id || 'av1',
      college: college?.name || null,
      collegeDomain: domain,
      year: author.year,
      credScore: author.cred_score || 0,
    },
  };
}

const POST_SELECT = `
  *,
  author:profiles!author_id ( id, display_name, username, avatar_id, year, cred_score, college:colleges ( id, name, domains ) ),
  poll_options ( id, idx, text, vote_count )
`;

export function FeedProvider({ children }) {
  const [state, dispatch] = useReducer(feedReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  const loadingRef = useRef(false);

  const loadFeed = useCallback(async (scope = 'global') => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    dispatch({ type: 'LOAD_START' });

    let query = supabase
      .from('posts')
      .select(POST_SELECT)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE);

    if (scope === 'college' && user?.id) {
      const { data: me } = await supabase.from('profiles').select('college_id').eq('id', user.id).maybeSingle();
      if (me?.college_id) query = query.eq('college_id', me.college_id);
    }

    const { data, error } = await query;
    loadingRef.current = false;
    if (error) {
      console.error('loadFeed error', error);
      dispatch({ type: 'LOAD_SUCCESS', payload: { posts: [], cursor: null, hasMore: false, scope } });
      return;
    }
    const posts = (data || []).map(mapPost);
    const last = data?.[data.length - 1];
    dispatch({
      type: 'LOAD_SUCCESS',
      payload: {
        posts,
        cursor: last ? last.created_at : null,
        hasMore: (data?.length || 0) === PAGE_SIZE,
        scope,
      },
    });
  }, [user?.id]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !state.hasMore || !state.cursor) return;
    loadingRef.current = true;
    dispatch({ type: 'LOAD_MORE_START' });

    let query = supabase
      .from('posts')
      .select(POST_SELECT)
      .is('deleted_at', null)
      .lt('created_at', state.cursor)
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE);

    if (state.scope === 'college' && user?.id) {
      const { data: me } = await supabase.from('profiles').select('college_id').eq('id', user.id).maybeSingle();
      if (me?.college_id) query = query.eq('college_id', me.college_id);
    }

    const { data, error } = await query;
    loadingRef.current = false;
    if (error) {
      console.error('loadMore error', error);
      return;
    }
    const posts = (data || []).map(mapPost);
    const last = data?.[data.length - 1];
    dispatch({
      type: 'LOAD_MORE_SUCCESS',
      payload: {
        posts,
        cursor: last ? last.created_at : state.cursor,
        hasMore: (data?.length || 0) === PAGE_SIZE,
      },
    });
  }, [state.cursor, state.hasMore, state.scope, user?.id]);

  const loadInteractions = useCallback(async () => {
    if (!user?.id) return;
    const [likes, bookmarks, votes] = await Promise.all([
      supabase.from('likes').select('post_id').eq('user_id', user.id),
      supabase.from('bookmarks').select('post_id').eq('user_id', user.id),
      supabase.from('poll_votes').select('post_id, option_id, poll_options!inner(idx)').eq('user_id', user.id),
    ]);
    const userLikes = (likes.data || []).map(r => r.post_id);
    const userSaves = (bookmarks.data || []).map(r => r.post_id);
    const pollVotes = {};
    (votes.data || []).forEach(r => {
      if (r.poll_options?.idx !== undefined) pollVotes[r.post_id] = r.poll_options.idx;
    });
    dispatch({ type: 'SET_INTERACTIONS', payload: { userLikes, userSaves, pollVotes } });
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadFeed('global');
      loadInteractions();
    } else {
      dispatch({ type: 'RESET' });
    }
  }, [isAuthenticated, user?.id, loadFeed, loadInteractions]);

  const addPost = useCallback(async (input) => {
    if (!user?.id) throw new Error('Not authenticated');

    const scope = input.isGlobal ? 'global' : 'college';
    const collegeIdRes = await supabase.from('profiles').select('college_id').eq('id', user.id).maybeSingle();
    const collegeId = collegeIdRes.data?.college_id || null;

    const { data: inserted, error: insertError } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        college_id: collegeId,
        scope,
        type: input.type,
        body: input.content,
        is_anonymous: input.type === 'confession',
        hashtags: input.tags || [],
      })
      .select('id, created_at')
      .single();

    if (insertError) throw insertError;

    if (input.type === 'poll' && input.pollOptions?.length) {
      const rows = input.pollOptions
        .filter(o => o && (o.text || o).toString().trim())
        .map((o, idx) => ({
          post_id: inserted.id,
          idx,
          text: typeof o === 'string' ? o : o.text,
        }));
      if (rows.length) {
        await supabase.from('poll_options').insert(rows);
      }
    }

    const { data: full } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .eq('id', inserted.id)
      .single();

    if (full) dispatch({ type: 'PREPEND_POST', payload: mapPost(full) });
    return inserted.id;
  }, [user?.id]);

  const toggleLike = useCallback(async (postId) => {
    if (!user?.id) return;
    const liked = state.userLikes.includes(postId);
    dispatch({ type: 'TOGGLE_LIKE', payload: postId });
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', postId);
    } else {
      await supabase.from('likes').insert({ user_id: user.id, post_id: postId });
    }
  }, [user?.id, state.userLikes]);

  const toggleSave = useCallback(async (postId) => {
    if (!user?.id) return;
    const saved = state.userSaves.includes(postId);
    dispatch({ type: 'TOGGLE_SAVE', payload: postId });
    if (saved) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', postId);
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, post_id: postId });
    }
  }, [user?.id, state.userSaves]);

  const votePoll = useCallback(async (postId, optionIndex) => {
    if (!user?.id) return;
    const post = state.posts.find(p => p.id === postId);
    const option = post?.pollOptions?.[optionIndex];
    if (!option?.id) return;
    dispatch({ type: 'VOTE_POLL', payload: { postId, optionIndex } });
    await supabase
      .from('poll_votes')
      .insert({ user_id: user.id, post_id: postId, option_id: option.id });
  }, [user?.id, state.posts]);

  const value = {
    ...state,
    loadFeed,
    loadMore,
    addPost,
    toggleLike,
    toggleSave,
    votePoll,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export default FeedContext;
export const useFeed = () => useContext(FeedContext);
