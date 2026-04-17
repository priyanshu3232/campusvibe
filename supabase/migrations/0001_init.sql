-- CampusVibe initial schema
-- Run in Supabase SQL Editor. Idempotent where safe.

-- =========================================================
-- EXTENSIONS
-- =========================================================
create extension if not exists "pgcrypto";

-- =========================================================
-- ENUMS
-- =========================================================
do $$ begin
  create type post_scope as enum ('global', 'college');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_type as enum ('text', 'poll', 'confession');
exception when duplicate_object then null; end $$;

do $$ begin
  create type conversation_type as enum ('dm', 'ai');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_type as enum ('like', 'follow', 'comment', 'mention', 'poll_result', 'cred');
exception when duplicate_object then null; end $$;

-- =========================================================
-- COLLEGES  (public reference data)
-- =========================================================
create table if not exists colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domains text[] not null,
  logo_url text,
  city text,
  tier int default 3,
  created_at timestamptz default now()
);
create index if not exists colleges_domains_idx on colleges using gin (domains);

alter table colleges enable row level security;
create policy "colleges readable by anyone"
  on colleges for select using (true);

-- =========================================================
-- PROFILES  (extends auth.users)
-- =========================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  college_id uuid references colleges(id),
  username text unique not null,
  display_name text not null,
  avatar_id text,
  bio text,
  year int,
  branch text,
  interests text[] default '{}',
  cred_score int default 0,
  level text default 'Fresher',
  post_count int default 0,
  follower_count int default 0,
  following_count int default 0,
  last_active_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "profiles readable by authenticated users"
  on profiles for select to authenticated using (true);
create policy "users update own profile"
  on profiles for update using (auth.uid() = id);
create policy "users insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- =========================================================
-- POSTS
-- =========================================================
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  college_id uuid references colleges(id),
  scope post_scope not null default 'global',
  type post_type not null default 'text',
  body text not null,
  is_anonymous boolean default false,
  hashtags text[] default '{}',
  like_count int default 0,
  comment_count int default 0,
  share_count int default 0,
  created_at timestamptz default now(),
  deleted_at timestamptz
);
create index if not exists posts_feed_global on posts (created_at desc) where deleted_at is null and scope = 'global';
create index if not exists posts_feed_college on posts (college_id, created_at desc) where deleted_at is null;
create index if not exists posts_author on posts (author_id, created_at desc);
create index if not exists posts_hashtags on posts using gin (hashtags);

alter table posts enable row level security;
create policy "posts readable by authenticated"
  on posts for select to authenticated using (deleted_at is null);
create policy "authors insert own posts"
  on posts for insert with check (auth.uid() = author_id);
create policy "authors update own posts"
  on posts for update using (auth.uid() = author_id);

-- =========================================================
-- POLLS
-- =========================================================
create table if not exists poll_options (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  idx int not null,
  text text not null,
  vote_count int default 0,
  unique (post_id, idx)
);
create table if not exists poll_votes (
  user_id uuid not null references profiles(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  option_id uuid not null references poll_options(id) on delete cascade,
  voted_at timestamptz default now(),
  primary key (user_id, post_id)
);

alter table poll_options enable row level security;
alter table poll_votes enable row level security;
create policy "poll options readable" on poll_options for select to authenticated using (true);
create policy "poll votes readable" on poll_votes for select to authenticated using (true);
create policy "users cast own vote" on poll_votes for insert with check (auth.uid() = user_id);

-- =========================================================
-- COMMENTS
-- =========================================================
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  body text not null,
  created_at timestamptz default now(),
  deleted_at timestamptz
);
create index if not exists comments_post on comments (post_id, created_at);

alter table comments enable row level security;
create policy "comments readable" on comments for select to authenticated using (deleted_at is null);
create policy "users write own comments" on comments for insert with check (auth.uid() = author_id);
create policy "users update own comments" on comments for update using (auth.uid() = author_id);

-- =========================================================
-- LIKES & BOOKMARKS
-- =========================================================
create table if not exists likes (
  user_id uuid not null references profiles(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);
create table if not exists bookmarks (
  user_id uuid not null references profiles(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

alter table likes enable row level security;
alter table bookmarks enable row level security;
create policy "likes readable" on likes for select to authenticated using (true);
create policy "users manage own likes" on likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own bookmarks" on bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- FOLLOWS
-- =========================================================
create table if not exists follows (
  follower_id uuid not null references profiles(id) on delete cascade,
  followee_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);
create index if not exists follows_followee on follows (followee_id);

alter table follows enable row level security;
create policy "follows readable" on follows for select to authenticated using (true);
create policy "users manage own follows" on follows for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- =========================================================
-- CHAT
-- =========================================================
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  type conversation_type not null default 'dm',
  created_at timestamptz default now()
);
create table if not exists conv_members (
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  last_read_at timestamptz default now(),
  primary key (conversation_id, user_id)
);
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);
create index if not exists messages_conv on messages (conversation_id, created_at);

alter table conversations enable row level security;
alter table conv_members enable row level security;
alter table messages enable row level security;

create policy "members see their conversations" on conversations for select using (
  exists (select 1 from conv_members m where m.conversation_id = conversations.id and m.user_id = auth.uid())
);
create policy "members see membership" on conv_members for select using (
  user_id = auth.uid() or exists (select 1 from conv_members m where m.conversation_id = conv_members.conversation_id and m.user_id = auth.uid())
);
create policy "members read messages" on messages for select using (
  exists (select 1 from conv_members m where m.conversation_id = messages.conversation_id and m.user_id = auth.uid())
);
create policy "members send messages" on messages for insert with check (
  sender_id = auth.uid() and exists (select 1 from conv_members m where m.conversation_id = messages.conversation_id and m.user_id = auth.uid())
);

-- =========================================================
-- PLACES & REVIEWS
-- =========================================================
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references colleges(id),
  name text not null,
  category text,
  price_range text,
  lat double precision,
  lng double precision,
  avg_rating numeric(3,2) default 0,
  review_count int default 0,
  recommend_pct int default 0,
  created_at timestamptz default now()
);
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  created_at timestamptz default now(),
  deleted_at timestamptz,
  unique (user_id, place_id)
);

alter table places enable row level security;
alter table reviews enable row level security;
create policy "places readable" on places for select to authenticated using (true);
create policy "reviews readable" on reviews for select to authenticated using (deleted_at is null);
create policy "users manage own reviews" on reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- GAMES & CRED
-- =========================================================
create table if not exists game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  game_id text not null,
  score int not null,
  played_at timestamptz default now()
);
create index if not exists game_scores_user on game_scores (user_id, played_at desc);

create table if not exists cred_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  action text not null,
  points int not null,
  ref_type text,
  ref_id uuid,
  created_at timestamptz default now()
);
-- idempotency for one-time actions (COMPLETE_PROFILE, FIRST_POST, REACH_10_FOLLOWERS)
create unique index if not exists cred_events_once
  on cred_events (user_id, action)
  where action in ('COMPLETE_PROFILE', 'FIRST_POST', 'REACH_10_FOLLOWERS');

alter table game_scores enable row level security;
alter table cred_events enable row level security;
create policy "users read own scores" on game_scores for select using (auth.uid() = user_id);
create policy "users insert own scores" on game_scores for insert with check (auth.uid() = user_id);
create policy "users read own cred" on cred_events for select using (auth.uid() = user_id);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles(id) on delete cascade,
  actor_id uuid references profiles(id) on delete set null,
  type notification_type not null,
  ref_type text,
  ref_id uuid,
  read_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists notifications_recipient on notifications (recipient_id, created_at desc);

alter table notifications enable row level security;
create policy "users read own notifications" on notifications for select using (auth.uid() = recipient_id);
create policy "users update own notifications" on notifications for update using (auth.uid() = recipient_id);

-- =========================================================
-- DEVICES (push tokens)
-- =========================================================
create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  platform text not null,
  fcm_token text not null unique,
  last_seen_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table devices enable row level security;
create policy "users manage own devices" on devices for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- REPORTS (moderation)
-- =========================================================
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text default 'open',
  created_at timestamptz default now()
);

alter table reports enable row level security;
create policy "users submit own reports" on reports for insert with check (auth.uid() = reporter_id);
create policy "users read own reports" on reports for select using (auth.uid() = reporter_id);

-- =========================================================
-- TRIGGERS: auto-create profile row on signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', 'New User')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- TRIGGERS: keep counters in sync
-- =========================================================
create or replace function public.bump_like_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update posts set like_count = like_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end; $$;

drop trigger if exists likes_count_trg on likes;
create trigger likes_count_trg
  after insert or delete on likes
  for each row execute function public.bump_like_count();

create or replace function public.bump_comment_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update posts set comment_count = comment_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end; $$;

drop trigger if exists comments_count_trg on comments;
create trigger comments_count_trg
  after insert or delete on comments
  for each row execute function public.bump_comment_count();

create or replace function public.bump_follow_counts()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update profiles set following_count = following_count + 1 where id = new.follower_id;
    update profiles set follower_count = follower_count + 1 where id = new.followee_id;
  elsif tg_op = 'DELETE' then
    update profiles set following_count = greatest(following_count - 1, 0) where id = old.follower_id;
    update profiles set follower_count = greatest(follower_count - 1, 0) where id = old.followee_id;
  end if;
  return null;
end; $$;

drop trigger if exists follows_count_trg on follows;
create trigger follows_count_trg
  after insert or delete on follows
  for each row execute function public.bump_follow_counts();
