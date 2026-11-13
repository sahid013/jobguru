-- Per-topic counts of published notes and questions.
-- Lets the site show "৩টি নোট · ১২টি প্রশ্ন" everywhere with one query.
-- security_invoker makes the view respect the caller's RLS policies.

create or replace view public.topic_content_counts
with (security_invoker = true) as
select
  t.id as topic_id,
  t.subject_id,
  (select count(*) from public.notes n where n.topic_id = t.id and n.published)      as notes,
  (select count(*) from public.questions q where q.topic_id = t.id and q.published)  as questions
from public.topics t;

grant select on public.topic_content_counts to anon, authenticated;
