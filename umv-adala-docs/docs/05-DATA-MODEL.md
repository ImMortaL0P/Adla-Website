# 05 — Data Model

Phase 3 onward. Until then, the shapes below exist only as TypeScript interfaces backing the static files in `src/data/`.

## 1. Principles

- **Bilingual columns, not bilingual rows.** Every translatable field is a `*_en` / `*_hi` pair on the same row. Separate translation tables would double every query for no benefit at this scale.
- **Every table has RLS enabled. No exceptions.** A table without a policy is a table anyone can read.
- **Publish flags, not deletion.** Content is unpublished rather than deleted, so an accidental removal is recoverable.
- **The static files mirror the schema.** Same field names, so switching between sources needs no mapping layer.

## 2. Schema

```sql
-- ---------------------------------------------------------------
-- notices
-- ---------------------------------------------------------------
create table notices (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title_en      text not null,
  title_hi      text not null,
  body_en       text,
  body_hi       text,
  type          text not null check (type in
                  ('circular','notice','event','holiday','result')),
  attachment_url text,
  published_at  timestamptz not null default now(),
  is_published  boolean not null default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index on notices (is_published, published_at desc);

-- ---------------------------------------------------------------
-- staff
-- ---------------------------------------------------------------
create table staff (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name_en        text not null,
  name_hi        text not null,
  designation_en text not null,
  designation_hi text not null,
  department     text not null check (department in
                   ('primary','maths_science','languages',
                    'social_science','administration','support')),
  subject_en     text,
  subject_hi     text,
  qualification  text,
  bio_en         text,
  bio_hi         text,
  photo_url      text,
  display_order  int not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz default now()
);
create index on staff (is_active, display_order);

-- ---------------------------------------------------------------
-- gallery_images
-- ---------------------------------------------------------------
create table gallery_images (
  id            uuid primary key default gen_random_uuid(),
  image_url     text not null,
  thumbnail_url text,
  caption_en    text,
  caption_hi    text,
  category      text not null check (category in
                  ('campus','classrooms','events','sports',
                   'annual_function','independence_day')),
  taken_on      date,
  display_order int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz default now()
);

-- ---------------------------------------------------------------
-- results  +  toppers
-- ---------------------------------------------------------------
create table results (
  id              uuid primary key default gen_random_uuid(),
  exam_year       int not null,
  board           text not null,                      -- e.g. 'BSEB'
  class_level     text not null check (class_level in ('10','12')),
  stream          text,                               -- class 12 only
  total_appeared  int,
  total_passed    int,
  pass_percentage numeric(5,2),
  first_division  int,
  second_division int,
  third_division  int,
  is_published    boolean not null default false,
  published_at    timestamptz,
  unique (exam_year, class_level, stream)
);

create table toppers (
  id           uuid primary key default gen_random_uuid(),
  result_id    uuid not null references results(id) on delete cascade,
  student_name text not null,
  percentage   numeric(5,2),
  stream       text,
  photo_url    text,
  rank         int,
  -- Consent is a data field, not a policy someone remembers.
  -- A topper without recorded consent is never rendered publicly.
  consent_on_file boolean not null default false
);

-- ---------------------------------------------------------------
-- admission_enquiries  — contains personal data
-- ---------------------------------------------------------------
create table admission_enquiries (
  id             uuid primary key default gen_random_uuid(),
  student_name   text not null,
  guardian_name  text,
  phone          text not null,
  email          text,
  class_applying text,
  message        text,
  status         text not null default 'new'
                   check (status in ('new','contacted','closed')),
  created_at     timestamptz default now()
);

-- ---------------------------------------------------------------
-- downloads
-- ---------------------------------------------------------------
create table downloads (
  id           uuid primary key default gen_random_uuid(),
  title_en     text not null,
  title_hi     text not null,
  file_url     text not null,
  category     text not null check (category in
                 ('forms','syllabus','timetable','circular','other')),
  file_size_kb int,
  is_published boolean not null default true,
  uploaded_at  timestamptz default now()
);

-- ---------------------------------------------------------------
-- profiles — admin roles
-- ---------------------------------------------------------------
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text not null default 'viewer'
               check (role in ('admin','editor','viewer')),
  created_at timestamptz default now()
);
```

## 3. Row Level Security

```sql
-- Helper. SECURITY DEFINER so the policy can read profiles
-- without the caller needing select rights on it.
create or replace function is_admin()
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin','editor')
  );
$$;

alter table notices              enable row level security;
alter table staff                enable row level security;
alter table gallery_images       enable row level security;
alter table results              enable row level security;
alter table toppers              enable row level security;
alter table downloads            enable row level security;
alter table admission_enquiries  enable row level security;
alter table profiles             enable row level security;

-- Public content: anonymous reads only what is published
create policy "public reads published notices" on notices
  for select using (is_published = true);
create policy "admins manage notices" on notices
  for all using (is_admin()) with check (is_admin());

create policy "public reads active staff" on staff
  for select using (is_active = true);
create policy "admins manage staff" on staff
  for all using (is_admin()) with check (is_admin());

create policy "public reads published gallery" on gallery_images
  for select using (is_published = true);
create policy "admins manage gallery" on gallery_images
  for all using (is_admin()) with check (is_admin());

create policy "public reads published results" on results
  for select using (is_published = true);
create policy "admins manage results" on results
  for all using (is_admin()) with check (is_admin());

-- Toppers are visible only when consent is recorded AND the parent
-- result is published.
create policy "public reads consented toppers" on toppers
  for select using (
    consent_on_file = true
    and exists (select 1 from results r
                where r.id = result_id and r.is_published = true)
  );
create policy "admins manage toppers" on toppers
  for all using (is_admin()) with check (is_admin());

create policy "public reads published downloads" on downloads
  for select using (is_published = true);
create policy "admins manage downloads" on downloads
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------
-- The most important policy in the project.
-- Anyone may submit an enquiry. NOBODY anonymous may read them back.
-- Without the deliberate absence of a public select policy, every
-- parent's phone number is readable by anyone who opens the JS bundle.
-- ---------------------------------------------------------------
create policy "anyone submits an enquiry" on admission_enquiries
  for insert to anon, authenticated with check (true);
create policy "only admins read enquiries" on admission_enquiries
  for select using (is_admin());
create policy "only admins update enquiries" on admission_enquiries
  for update using (is_admin());

create policy "users read own profile" on profiles
  for select using (auth.uid() = id);
```

### Verify, do not assume

Run these against the live project with the anon key and confirm each returns zero rows:

```sql
select * from admission_enquiries;              -- must be empty
select * from notices where is_published = false; -- must be empty
select * from toppers where consent_on_file = false; -- must be empty
```

A policy that exists is not a policy that works. Test it.

## 4. Storage

| Bucket | Public read | Write | Contents |
|---|---|---|---|
| `gallery` | yes | admins | Gallery photographs |
| `staff` | yes | admins | Staff portraits |
| `documents` | yes | admins | PDFs — forms, syllabus, timetables |

Constraints: images max 5 MB pre-compression, PDFs max 10 MB. Compress client-side before upload with `browser-image-compression` — a headmaster uploading a 6 MB phone photo is the expected case, not the exception. Serve through Supabase's transform API at the rendered size; never ship a 3000px image into a 400px card.

## 5. Static fallback contract

`src/data/*.ts` files export arrays typed identically to the database rows. They are seeded with the same content the school publishes and updated at each major content change.

```ts
// src/data/notices.ts
import type { Notice } from '@/types/domain'

/**
 * Fallback notices. Rendered when Supabase is unreachable, paused,
 * or returns nothing. Keep in sync after major content updates.
 * See CONTENT-GUIDE.md before editing.
 */
export const staticNotices: Notice[] = [ /* ... */ ]
```

Every query hook resolves: live data if present → static data otherwise. Never an empty page. See `03-ARCHITECTURE.md` §6.

## 6. Migrations

Numbered SQL files in `supabase/migrations/`, checked into the repository:

```
001_initial_schema.sql
002_rls_policies.sql
003_storage_buckets.sql
004_seed_placeholder_data.sql
```

Never edit a migration that has been applied. Add a new one.
