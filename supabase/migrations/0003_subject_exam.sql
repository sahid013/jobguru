-- Subjects belong to one exam (BCS, Gas Field, …). Existing rows are all BCS.
alter table public.subjects add column if not exists exam text not null default 'bcs';
create index if not exists subjects_exam_idx on public.subjects (exam, sort_order);
