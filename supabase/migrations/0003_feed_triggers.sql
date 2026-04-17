-- Auto-bump poll_options.vote_count when a poll_vote is inserted/deleted

create or replace function public.bump_poll_vote_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update poll_options set vote_count = vote_count + 1 where id = new.option_id;
  elsif tg_op = 'DELETE' then
    update poll_options set vote_count = greatest(vote_count - 1, 0) where id = old.option_id;
  end if;
  return null;
end; $$;

drop trigger if exists poll_votes_count_trg on poll_votes;
create trigger poll_votes_count_trg
  after insert or delete on poll_votes
  for each row execute function public.bump_poll_vote_count();
