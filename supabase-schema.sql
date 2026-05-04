-- ============================================================
-- CiviQ — Schema Supabase
-- Rulează în Supabase SQL Editor
-- ============================================================

-- Tabelul principal de sesizări
create table if not exists reports (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),

  -- Date introduse de utilizator
  description text not null,
  address text,
  sector int check (sector between 1 and 6),

  -- Clasificare AI
  problem_type text not null,
  title text,
  formal_text text,
  urgency text check (urgency in ('scăzută', 'medie', 'ridicată')),

  -- Autoritate destinatară
  authority_name text,
  authority_email text,

  -- Locație GPS (opțional)
  lat double precision,
  lng double precision,

  -- Fișiere atașate (opțional)
  photo_url text,

  -- Utilizator (opțional — anonymous dacă null)
  user_id uuid references auth.users(id) on delete set null,
  user_email text,

  -- Status sesizare
  status text default 'nou' check (status in ('nou', 'trimis', 'in_lucru', 'rezolvat', 'respins')),

  -- Trimitere către autoritate
  sent_at timestamp with time zone,
  sent_to_email text
);

-- Index pentru hartă
create index if not exists reports_location on reports (lat, lng) where lat is not null;
create index if not exists reports_type on reports (problem_type);
create index if not exists reports_status on reports (status);

-- RLS: oricine poate crea o sesizare
alter table reports enable row level security;

create policy "Oricine poate adăuga sesizări"
  on reports for insert
  with check (true);

create policy "Sesizările publice sunt vizibile pe hartă"
  on reports for select
  using (true);

create policy "Utilizatorul poate edita propriile sesizări"
  on reports for update
  using (auth.uid() = user_id);
