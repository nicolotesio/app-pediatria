create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('errore', 'miglioria', 'nuovo-contenuto', 'altro')),
  message text not null check (char_length(message) between 10 and 2000),
  contact_email text,
  page_url text,
  user_agent text,
  status text not null default 'new' check (status in ('new', 'read', 'in_progress', 'done', 'archived')),
  admin_notes text
);

alter table public.feedback enable row level security;

drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
on public.feedback
for insert
to anon
with check (
  status = 'new'
  and char_length(message) between 10 and 2000
);

drop policy if exists "Authenticated users can manage feedback" on public.feedback;
create policy "Authenticated users can manage feedback"
on public.feedback
for all
to authenticated
using (true)
with check (true);
