# Phase 3 — Supabase Backend

**Goal:** content moves to a database the school can eventually edit, without the site ever depending on that database being awake.

**Estimated effort:** 2–3 days human.

**Prerequisite:** Phase 2 acceptance checks all passing.

**Do not build:** the admin UI (Phase 4).

---

## The rule that governs this phase

**The site must render completely with Supabase switched off.**

Free-tier Supabase projects pause after about a week of inactivity. A village school's website going blank because a database slept is a worse failure than notices being three weeks stale. So the static data files built in Phase 2 are not scaffolding to be deleted — they become a permanent fallback layer.

Every query hook resolves: live data if present, static data otherwise. Never an empty page.

---

## Work

### 1. Provision
Create the Supabase project (region: Mumbai / `ap-south-1`, closest to the users). Record the URL and anon key in `.env`; commit only `.env.example`.

### 2. Schema
Apply `05-DATA-MODEL.md` §2 as `supabase/migrations/001_initial_schema.sql`. Check migrations into the repository — an unversioned database is one the next maintainer cannot reproduce.

### 3. Row Level Security
Apply §3 as `002_rls_policies.sql`. Enable RLS on **every** table.

**Then verify it.** Using the anon key against the live project, confirm each of these returns zero rows:

```sql
select * from admission_enquiries;
select * from notices where is_published = false;
select * from toppers where consent_on_file = false;
```

A policy that exists is not a policy that works. The enquiries table holds parents' phone numbers; a missing policy there publishes them to anyone who opens the JavaScript bundle. Test it directly rather than trusting the SQL.

### 4. Storage
Buckets `gallery`, `staff`, `documents` — public read, admin write, in `003_storage_buckets.sql`. Size limits: images 5 MB, PDFs 10 MB.

### 5. Seed
`004_seed_placeholder_data.sql` — load the same placeholder content the static files carry, so the two sources agree.

### 6. Client layer
- `src/lib/supabase.ts` — typed client, created once
- Generate types with the Supabase CLI; check `src/types/database.ts` into the repository
- `src/lib/queries/` — one module per entity

### 7. Query hooks with fallback

```ts
export function useNotices() {
  const q = useQuery({
    queryKey: ['notices'],
    queryFn: fetchPublishedNotices,
    staleTime: 5 * 60_000,
    retry: 1,                 // fail fast to the fallback
  })
  // The fallback is the product, not a development convenience.
  const data = q.data?.length ? q.data : staticNotices
  return { ...q, data, isFallback: !q.data?.length }
}
```

One hook per entity: `useNotices`, `useNotice(slug)`, `useStaff`, `useStaffMember(slug)`, `useGallery`, `useDownloads`.

`staleTime` set generously — this content changes daily at most.

### 8. Bilingual resolution
A `pick(row, field, lang)` helper returns `row[field_hi]` or `row[field_en]` by active language, **falling back to the other language rather than rendering empty**. A missing Hindi translation should show the English text, not a blank card.

### 9. Loading and error states
- Skeletons matching the final layout's dimensions exactly — no spinners, no shift when content arrives
- Each major section wrapped in its own error boundary, so one failure degrades one block rather than the page
- Never a bare error string in front of a parent; show the fallback content instead

### 10. Wire the enquiry form
Point the admission enquiry form at `admission_enquiries` via insert. Keep the WhatsApp path as a secondary "or message us directly" option — it is genuinely more likely to get a fast reply, and it works when the database does not.

On insert failure: show a clear bilingual error, **preserve everything the user typed**, and offer the WhatsApp fallback. A parent who has typed their details must never lose them to a network blip.

Rate-limit client-side (disable submit for 30s after success) and validate server-side through the zod schema shared with the form.

### 11. Images
Serve through Supabase's transform API at the size actually rendered. Never ship a 3000px image into a 400px card. Keep `width`/`height` attributes so CLS stays at zero.

---

## Acceptance checks

- [ ] **Site renders fully with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` removed** — every page, every section
- [ ] Anonymous `select` on `admission_enquiries` returns zero rows
- [ ] Anonymous `select` on unpublished notices returns zero rows
- [ ] Anonymous `select` on non-consented toppers returns zero rows
- [ ] `grep -r "service_role" src/ dist/` returns nothing
- [ ] Skeletons match final dimensions; no layout shift on data arrival
- [ ] A forced query failure degrades one section, not the page
- [ ] Enquiry form insert succeeds; a forced failure preserves the input and offers WhatsApp
- [ ] Missing Hindi translation falls back to English, never to blank
- [ ] Migrations checked in and re-runnable on a fresh project
- [ ] Zero console errors

---

## Report before continuing

State: the verification results for each RLS test, and confirmation that the site was loaded with the environment variables removed and rendered completely.
