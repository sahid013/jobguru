-- Job Guru — initial schema
-- Run this in the Supabase SQL editor (or `supabase db push` with the CLI).

create extension if not exists "pgcrypto";

-- ───────────────────────── Profiles & roles ─────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        text not null default 'student' check (role in ('student', 'editor', 'admin')),
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Editors and admins can write content.
create or replace function public.can_edit()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('editor', 'admin')
  );
$$;

-- ───────────────────────── Syllabus ─────────────────────────
-- Each subject is written in a single language: 'bn' (Bangla) or 'en' (English).
create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  lang        text not null check (lang in ('bn', 'en')),
  title       text not null,
  marks       int  not null default 0,
  sort_order  int  not null default 0,
  -- [{ "heading": "Grammar — 15" | null, "items": ["…", "…"] }]
  sources     jsonb not null default '[]'::jsonb,
  source_note text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Topics form a tree (parent_id) so any depth of sub-topics is possible.
create table if not exists public.topics (
  id          uuid primary key default gen_random_uuid(),
  subject_id  uuid not null references public.subjects (id) on delete cascade,
  parent_id   uuid references public.topics (id) on delete cascade,
  slug        text not null,
  title       text not null,
  description text,
  points      text[] not null default '{}',
  marks       int,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (subject_id, slug)
);
create index if not exists topics_subject_idx on public.topics (subject_id, sort_order);
create index if not exists topics_parent_idx  on public.topics (parent_id);

-- ───────────────────────── Content ─────────────────────────
-- Study notes in Markdown, attached to a topic.
create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  topic_id    uuid not null references public.topics (id) on delete cascade,
  title       text not null,
  body        text not null default '',
  published   boolean not null default false,
  sort_order  int not null default 0,
  author_id   uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists notes_topic_idx on public.notes (topic_id, sort_order);

-- MCQ questions attached to a topic.
create table if not exists public.questions (
  id            uuid primary key default gen_random_uuid(),
  topic_id      uuid not null references public.topics (id) on delete cascade,
  stem          text not null,
  options       text[] not null check (array_length(options, 1) between 2 and 6),
  correct_index int  not null check (correct_index >= 0),
  explanation   text,
  source        text,           -- e.g. "৪৪তম বিসিএস" or "Model test"
  published     boolean not null default true,
  author_id     uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists questions_topic_idx on public.questions (topic_id);

-- Student answers — lets you build progress tracking later.
create table if not exists public.attempts (
  id             bigint generated always as identity primary key,
  user_id        uuid not null references auth.users (id) on delete cascade,
  question_id    uuid not null references public.questions (id) on delete cascade,
  selected_index int  not null,
  is_correct     boolean not null,
  created_at     timestamptz not null default now()
);
create index if not exists attempts_user_idx on public.attempts (user_id, created_at desc);

-- ───────────────────────── updated_at triggers ─────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$
declare t text;
begin
  foreach t in array array['subjects', 'topics', 'notes', 'questions'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s
                    for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ───────────────────────── Row Level Security ─────────────────────────
alter table public.profiles  enable row level security;
alter table public.subjects  enable row level security;
alter table public.topics    enable row level security;
alter table public.notes     enable row level security;
alter table public.questions enable row level security;
alter table public.attempts  enable row level security;

-- Profiles: users see and edit their own row (role changes happen in the dashboard).
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles
  for select using (id = auth.uid());

-- Syllabus: everyone reads, editors write.
drop policy if exists "subjects read" on public.subjects;
create policy "subjects read" on public.subjects for select using (true);
drop policy if exists "subjects write" on public.subjects;
create policy "subjects write" on public.subjects for all
  using (public.can_edit()) with check (public.can_edit());

drop policy if exists "topics read" on public.topics;
create policy "topics read" on public.topics for select using (true);
drop policy if exists "topics write" on public.topics;
create policy "topics write" on public.topics for all
  using (public.can_edit()) with check (public.can_edit());

-- Notes & questions: everyone reads published rows, editors read and write all.
drop policy if exists "notes read" on public.notes;
create policy "notes read" on public.notes for select
  using (published or public.can_edit());
drop policy if exists "notes write" on public.notes;
create policy "notes write" on public.notes for all
  using (public.can_edit()) with check (public.can_edit());

drop policy if exists "questions read" on public.questions;
create policy "questions read" on public.questions for select
  using (published or public.can_edit());
drop policy if exists "questions write" on public.questions;
create policy "questions write" on public.questions for all
  using (public.can_edit()) with check (public.can_edit());

-- Attempts: each student only sees and adds their own.
drop policy if exists "own attempts read" on public.attempts;
create policy "own attempts read" on public.attempts for select using (user_id = auth.uid());
drop policy if exists "own attempts insert" on public.attempts;
create policy "own attempts insert" on public.attempts for insert with check (user_id = auth.uid());
