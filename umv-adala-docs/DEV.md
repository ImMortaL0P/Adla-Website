# DEV.md — UMV Adala School Website

**Build specification for an AI coding agent.**
Read this file completely before writing any code. Build in the five phases given, in order. Do not skip ahead. At the end of each phase, stop, run the phase's acceptance checks, and report what you built before starting the next phase.

---

## 0. Project summary

Build the official website for **UMV Adala** (Utkramit Madhya Vidyalaya Adala), a Bihar Government school teaching Class 1 to Class 12, located at Adla, Naubatpur, Patna district, Bihar.

The site must be:

- **Bilingual** — English and Hindi, switchable, English default.
- **Dual-theme** — light and dark, both in subtle muted pastel shades.
- **Animated** — scroll reveals, staggered entrances, parallax, count-ups — all restrained and all respecting `prefers-reduced-motion`.
- **Complete** — every page a government school actually needs, not a brochure.
- **Bug-free and accessible** — WCAG 2.1 AA, keyboard navigable, no console errors, no TypeScript `any`.

The audience is split and this matters for every design decision: **parents and villagers on low-end Android phones over patchy 4G**, and **education-department officials on desktop**. Mobile-first is not a slogan here; it is the primary case. Keep the JavaScript bundle small, lazy-load images, and never let an animation delay the reading of text.

---

## 1. Stack — fixed, do not substitute

| Concern | Choice |
|---|---|
| Build tool | Vite |
| Framework | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS with CSS custom properties |
| UI primitives | shadcn/ui (Radix under the hood) |
| Routing | react-router-dom v6 |
| Icons | lucide-react |
| Animation | CSS transitions + IntersectionObserver. **No animation library.** No Framer Motion, no GSAP. |
| Backend | Supabase (Postgres + Auth + Storage) — **Phase 3 onward only** |
| Data fetching | @tanstack/react-query |
| Forms | react-hook-form + zod |
| Deployment target | Netlify or Vercel, static build |

**Content strategy: editable data file.** All school content — staff, notices, gallery, results, academics — lives in typed TypeScript files under `src/data/`, written so a non-programmer can copy an existing entry and change the values. Supabase is layered on top in Phase 3 so the school can eventually edit content through an admin panel; the data files remain the fallback and the seed. **The site must render correctly and completely with Supabase switched off.** This is a hard requirement — a village school's site must not go blank because a free-tier database paused.

---

## 2. School facts — use verbatim

```ts
// These are real. Use them exactly.
Name (EN):     Utkramit Madhya Vidyalaya Adala
Short name:    UMV Adala
Name (HI):     उत्क्रमित मध्य विद्यालय अदला
Type:          Bihar Government School
Classes:       1 to 12
Address:       Adla, Naubatpur, Patna District, Bihar — 809011
Locality:      Sarasat, Naubatpur block
Coordinates:   25.508267, 84.918096
Managed by:    Department of Education, Government of Bihar
```

### Placeholder discipline — important

Everything else — principal's name, teacher names, phone numbers, email, UDISE code, student counts, exam results, photographs — is **not known**. You must:

1. Put every placeholder in `src/data/school.ts` with a `// TODO: replace` comment.
2. Use obviously-placeholder values, never plausible-looking fakes. `UDISE: "XXXXXXXXXXX — to be updated"`, not a made-up 11-digit number. `Phone: "+91 XXXXX XXXXX"`.
3. Never present invented statistics as fact anywhere in the UI. If a stat block needs numbers, label the section clearly and use round placeholder values with a `// TODO`.
4. For staff photos and gallery images, use solid-colour token-based placeholder tiles with initials — **do not** pull stock photos of unrelated schools or children. This is a real institution; a fabricated photo of a real school is a genuine problem, not a styling shortcut.

Write a `CONTENT-GUIDE.md` at the repo root explaining, in plain language and in both English and Hindi, exactly which files to edit to replace each placeholder.

---

## 3. Design system

The palette is the single most important decision in this build. Get it right in Phase 1 and everything downstream is easy.

### 3.1 Principles

- **Muted pastel, not candy pastel.** Chalk, clay, sage, dusty sky. A government school should read as trustworthy, warm, and cared-for — not as a preschool and not as a corporate SaaS landing page.
- **Zero hardcoded colours anywhere.** Every colour is an HSL custom property. If you write `text-blue-500` or `#fff` in a component, you have made a mistake — fix it rather than shipping it.
- **Borders over shadows.** Hairline 1px borders at low opacity carry the structure. Heavy drop shadows are banned; at most a very soft ambient shadow on floating elements.
- **Generous whitespace.** Sections breathe. Vertical rhythm on an 8px scale.

### 3.2 Tokens — `src/index.css`

Define these as HSL triplets (no `hsl()` wrapper, so Tailwind can add opacity):

```css
:root {
  /* Surfaces — warm chalk paper */
  --background:        40 30% 97%;
  --foreground:        222 25% 16%;
  --card:              40 30% 99%;
  --card-foreground:   222 25% 16%;
  --muted:             40 18% 93%;
  --muted-foreground:  222 12% 42%;
  --border:            40 15% 87%;
  --input:             40 15% 87%;
  --ring:              32 55% 58%;

  /* School accent roles */
  --saffron:           32 62% 62%;   /* primary — muted marigold */
  --leaf:              145 28% 52%;  /* secondary — sage */
  --sky:               205 45% 60%;  /* accent — dusty blue */
  --clay:              18 32% 58%;   /* tertiary — terracotta */

  --primary:            var(--saffron);
  --primary-foreground: 40 40% 99%;
  --secondary:            var(--leaf);
  --secondary-foreground: 40 40% 99%;
  --accent:               var(--sky);
  --accent-foreground:    40 40% 99%;

  --destructive: 358 55% 55%;
  --success:     145 45% 42%;
  --warning:     38 70% 50%;

  --radius: 0.75rem;
}

.dark {
  /* Soft navy-charcoal, never pure black */
  --background:        220 18% 11%;
  --foreground:        40 22% 94%;
  --card:              220 16% 15%;
  --card-foreground:   40 22% 94%;
  --muted:             220 14% 19%;
  --muted-foreground:  220 10% 66%;
  --border:            220 14% 23%;
  --input:             220 14% 23%;
  --ring:              32 50% 66%;

  /* Same hues, lifted lightness, dropped saturation → pastel on dark */
  --saffron: 32 48% 70%;
  --leaf:    145 24% 64%;
  --sky:     205 38% 70%;
  --clay:    18 28% 66%;

  --primary-foreground:   220 20% 12%;
  --secondary-foreground: 220 20% 12%;
  --accent-foreground:    220 20% 12%;
}
```

**Verify every pair.** Body text on background, muted text on background, muted text on card, and each accent used as a button background with its foreground — all must hit 4.5:1 (3:1 for text at 24px+ or 19px bold). Do this with a contrast calculation, not by eye, and adjust the lightness values above if any pair fails. Record the measured ratios in a comment block at the bottom of `index.css`.

A common failure: `--saffron` at 62% lightness as a button background with white text fails AA in light mode. If so, darken the button variant specifically (`--primary-strong`) rather than changing the decorative hue.

### 3.3 Typography

Load from Google Fonts with `display=swap` and preconnect:

- **Display / headings:** `Fraunces` or `Bitter` (English) + `Tiro Devanagari Hindi` (Hindi)
- **Body / UI:** `Inter` (English) + `Noto Sans Devanagari` (Hindi)

Devanagari has taller ascenders and needs more line-height than Latin. Set a `.lang-hi` class on `<html>` when Hindi is active and adjust:

```css
.lang-hi body { line-height: 1.75; letter-spacing: 0; }
.lang-hi h1, .lang-hi h2, .lang-hi h3 { line-height: 1.4; }
```

Hindi and English must look like the same design at the same size. Check the header, where the two scripts sit adjacent.

Type scale (clamp-based, fluid): `--fs-xs` through `--fs-5xl`. Headings never wrap awkwardly at 360px — test.

### 3.4 School crest

Draw an inline SVG monogram component: "UMV" set in a rounded shield with a subtle open-book motif and a small sun/lotus arc above. Uses `currentColor` and tokens so it recolours per theme. No raster image, no external asset. Sizes: 24 / 32 / 48 / 96px variants. Also generate a favicon and an `og-image` from it.

---

## 4. Motion system

Build these once in Phase 1; every later phase composes them.

### 4.1 The central reduced-motion gate

```ts
// src/hooks/usePrefersReducedMotion.ts
// Returns true when the user asks for reduced motion. Listens for changes.
```

**Every animated component checks this and, when true, renders in the final visible state immediately.** The classic bug is that reduced-motion users get elements stuck at `opacity: 0` because the reveal never fires. Write it so that reduced motion means *skip the animation*, never *skip the reveal*. Also add a CSS backstop:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 4.2 Components to build

| Component / hook | Behaviour |
|---|---|
| `useInView(options)` | IntersectionObserver wrapper. `triggerOnce` default true, `rootMargin: "0px 0px -10% 0px"`. Disconnects on unmount. |
| `<Reveal delay direction>` | Fade + 16px rise (or slide from left/right). 500ms, `cubic-bezier(0.16, 1, 0.3, 1)`. |
| `<StaggerGroup stagger={80}>` | Clones children, passing incremental delay. Caps total stagger at ~500ms so long lists don't crawl. |
| `<CountUp to duration>` | requestAnimationFrame count, eased, starts when in view, respects reduced motion by showing the final number. Formats with `toLocaleString('en-IN')`. |
| `useParallax(strength)` | Translates on scroll via rAF + transform only. Disabled under 768px and under reduced motion. |
| `<ScrollProgress>` | Thin gradient bar pinned under the header. `transform: scaleX()` only. |
| `<Marquee>` | Infinite horizontal scroll for the notices ticker. Pauses on hover and on focus-within. |

**Rules:** 400–700ms durations, ease-out, no bounce, no spring. Animate only `transform` and `opacity` — never `height`, `top`, or `width`. Nothing that delays reading: text is legible the moment it enters, motion only accompanies it. No animation on route change beyond a 150ms fade.

---

## 5. Information architecture

```
/                     Home
/about                About the school
/about/principal      Principal's message
/about/infrastructure Facilities & infrastructure
/academics            Academics overview
/academics/primary    Class 1–5
/academics/middle     Class 6–8
/academics/secondary  Class 9–10
/academics/senior     Class 11–12 (streams)
/staff                Staff directory
/staff/:slug          Individual staff profile
/gallery              Photo gallery
/notices              Notices & circulars
/notices/:slug        Single notice
/results              Results & examinations
/admission            Admission information + enquiry form
/downloads            Forms, syllabus, timetables
/contact              Contact + map
/mandatory-disclosure Statutory disclosure (government requirement)
/admin/*              Admin panel — Phase 4, auth-gated
*                     404
```

Every route is a real route with its own `<title>`, meta description, and canonical URL. Scroll resets to top on navigation, except when a hash anchor is present.

---

## 6. The five phases

### PHASE 1 — Foundation

**Deliverables**

1. Vite + React + TS project, Tailwind configured, shadcn/ui installed, path alias `@/`, ESLint + Prettier.
2. Full token system in `index.css` and `tailwind.config.ts`, with the contrast audit comment block.
3. Fonts loaded, type scale defined, `.lang-hi` adjustments in place.
4. `ThemeProvider` — light / dark / system, persisted to `localStorage`, with a blocking inline script in `index.html` that sets the class before first paint. **No flash of wrong theme.** 300ms cross-fade on change, applied to a wrapper rather than `*` (animating everything is a jank source).
5. `LanguageProvider` — `useT()` hook, typed `translations` object keyed `en` / `hi`, persisted, sets `<html lang>` and `.lang-hi`. **No i18n library.** Type the translation keys so a missing Hindi string is a compile error.
6. Layout shell: `<Header>`, `<Footer>`, `<Layout>`, skip-to-content link as the first focusable element.
7. All routes from §5 stubbed with a heading and a "coming soon" note.
8. Every motion primitive from §4.
9. Home hero only: school name in both scripts, one-line positioning statement, two CTAs, CSS-only pastel gradient-mesh background, scroll cue. Excellent in both themes at 360px and 1440px.
10. `src/data/school.ts` with all constants and placeholders.

**The i18n layer goes in now, not later.** Every string in the entire site routes through the translation object from the first component. Retrofitting bilingual copy onto finished pages is where this kind of project usually collapses.

**Acceptance checks**
- Toggle theme 10× rapidly — no flash, no layout shift, no console error.
- Hard-reload in dark mode — no white flash.
- Toggle language — every visible string changes; no English leaks into Hindi mode.
- Tab through the header — skip link appears first, focus rings visible on every control, mobile menu traps focus and closes on Escape.
- DevTools → Rendering → emulate `prefers-reduced-motion: reduce` — all content visible, nothing stuck invisible.
- Lighthouse accessibility ≥ 95 on the hero page.

---

### PHASE 2 — Public content pages

Build every page in §5 except `/results`, `/downloads`, and `/admin`. Static data from `src/data/`.

**Home** — hero (from Phase 1), then:
- Notices ticker (marquee, pauses on hover/focus, links to `/notices`)
- "At a glance" stats strip with `<CountUp>` — classes, teachers, students, year established (placeholders, clearly labelled)
- About preview — two columns, image placeholder + text, `<Reveal>` on both
- Academics grid — four stage cards (Primary / Middle / Secondary / Senior Secondary) with staggered reveal and hover lift
- Facilities strip — icon + label tiles (library, science lab, computer lab, playground, mid-day meal, drinking water, toilets, boundary wall)
- Principal's message excerpt with portrait placeholder and a pull-quote
- Gallery preview — 6-image masonry teaser linking to `/gallery`
- Admission CTA band — full-width accent panel
- Location map + address block

**About** — history, vision & mission, school timings, management structure, affiliation/board details, an animated milestone timeline (vertical on mobile, alternating on desktop, each node revealing on scroll).

**Academics** — overview plus the four stage sub-pages. Each: subjects offered, weekly period structure, medium of instruction (Hindi medium — note English as a subject), assessment pattern, and for senior secondary the stream cards (Science / Commerce / Arts) with subject combinations. Use a proper accessible table for subject lists, not divs.

**Staff** — directory with filter chips by department (Primary / Maths & Science / Languages / Social Science / Administration / Support staff) and a search box. Cards with initials-avatar placeholders, name, designation, subject, qualification. Filtering must animate the grid without layout thrash — use CSS `grid` + opacity, and keep DOM order stable. Individual profile pages at `/staff/:slug`.

**Gallery** — category filters (Campus / Classrooms / Events / Sports / Annual Function / Independence Day). Masonry layout. Accessible lightbox: focus trap, arrow-key navigation, Escape to close, restores focus to the trigger, captions in both languages. Lazy-load with blur-up placeholders.

**Notices** — list with type badges (Circular / Notice / Event / Holiday / Result), date, and Hindi/English titles. Filter by type and year. Individual notice pages. "New" badge for items under 14 days old.

**Admission** — process steps (numbered, revealing on scroll), eligibility by class, required documents checklist, fee structure table (government school — mostly free; state it plainly), important dates, FAQ accordion, and the enquiry form. Form validated with zod + react-hook-form; in this phase it opens a prefilled WhatsApp message and a `mailto:` as fallback. Wire it to Supabase in Phase 3.

**Contact** — address block, phone, email, office hours, an embedded map centred on 25.508267, 84.918096 with a "Get directions" link to Google Maps, and a general contact form.

**Mandatory disclosure** — the statutory table government schools must publish: school details, UDISE, management, land and building, classrooms, staff counts, facilities. All placeholders, clearly marked.

**Acceptance checks**
- Every page renders correctly in 4 combinations: light/EN, dark/EN, light/HI, dark/HI.
- No layout shift when switching language (Hindi text is longer — reserve space, don't let cards jump).
- Gallery lightbox fully keyboard operable.
- All images have meaningful `alt` in the active language.
- No horizontal scroll at 360px on any page.

---

### PHASE 3 — Supabase backend

Provision Supabase and move dynamic content to the database, **with the data files as fallback**.

**Schema**

```sql
-- All content tables carry bilingual columns: *_en and *_hi

notices (
  id uuid pk default gen_random_uuid(),
  title_en text not null, title_hi text not null,
  body_en text, body_hi text,
  type text not null check (type in ('circular','notice','event','holiday','result')),
  published_at timestamptz not null default now(),
  is_published boolean not null default false,
  attachment_url text,
  slug text unique not null,
  created_at timestamptz default now()
)

staff (
  id uuid pk, name_en text, name_hi text, designation_en text, designation_hi text,
  department text, subject_en text, subject_hi text, qualification text,
  photo_url text, display_order int default 0, is_active boolean default true, slug text unique
)

gallery_images (
  id uuid pk, image_url text not null, caption_en text, caption_hi text,
  category text, taken_on date, display_order int default 0
)

results (
  id uuid pk, exam_year int not null, board text, class_level text,
  total_appeared int, total_passed int, pass_percentage numeric(5,2),
  first_division int, second_division int, third_division int, published_at timestamptz
)

toppers (
  id uuid pk, result_id uuid references results(id) on delete cascade,
  student_name text, percentage numeric(5,2), stream text, photo_url text, rank int
)

admission_enquiries (
  id uuid pk, student_name text not null, guardian_name text, phone text not null,
  email text, class_applying text, message text,
  status text default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz default now()
)

downloads (
  id uuid pk, title_en text, title_hi text, file_url text, category text,
  file_size_kb int, uploaded_at timestamptz default now()
)
```

**Row Level Security — every table, no exceptions.**

- Content tables: `select` allowed to `anon` **only where `is_published = true`** (or equivalent). All `insert`/`update`/`delete` restricted to authenticated admins.
- `admission_enquiries`: `anon` may `insert` only. `anon` must **never** be able to `select` — that would leak parents' phone numbers to anyone who reads your JS bundle. This is the single most important security line in the project. Test it explicitly by attempting an anonymous select and confirming it returns zero rows.
- Add a `profiles` table with a `role` column, and an `is_admin()` security-definer function used in admin policies.

**Client layer**
- Typed Supabase client, generated types checked into the repo.
- React Query hooks per entity with sensible `staleTime`.
- **Every hook falls back to the static data file on error or empty result.** Wrap in an error boundary per section, never a whole-page crash.
- Loading states are skeletons matching the final layout — no spinners, no content jump.
- Storage buckets: `gallery`, `staff`, `documents`. Public read, admin write. Serve images through Supabase's transform API at appropriate sizes.

**Env vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Ship a `.env.example`. Never commit real keys. The service-role key must never appear in client code — if you find yourself reaching for it in the frontend, the RLS policy is wrong.

**Acceptance checks**
- Site renders fully with Supabase env vars removed (fallback path works).
- Anonymous `select` on `admission_enquiries` returns nothing.
- Anonymous `select` on unpublished notices returns nothing.
- No key other than the anon key exists anywhere in the built bundle — grep `dist/` to confirm.

---

### PHASE 4 — Admin panel + results module

**Admin** at `/admin`, Supabase Auth email+password, no public sign-up (accounts created by you in the dashboard).

- Protected route wrapper; unauthenticated users are redirected, not shown a flicker of the panel.
- Dashboard: counts, recent enquiries, quick actions.
- CRUD for notices, staff, gallery, results, toppers, downloads. Each editor has **side-by-side English and Hindi fields** — the panel should make it obvious when a Hindi translation is missing, because that is the failure mode that will actually happen.
- Image upload with client-side compression before upload (browser-image-compression), drag-and-drop, progress, and preview. Reject files over 5MB with a clear message.
- Enquiries inbox: table, status changes, CSV export.
- Optimistic updates with rollback on failure. Toast on every mutation, success and error.
- The admin UI must be usable on a phone — a headmaster will update a notice from a phone, not a desktop.

**Results & examinations** page (public):
- Year selector.
- Board result summary cards for Class 10 and 12 — appeared / passed / pass percentage — with `<CountUp>`.
- A pass-percentage trend chart across years. Use Recharts, themed with the tokens, accessible (include a data table alternative for screen readers).
- Toppers wall: rank cards with placeholder avatars, name, percentage, stream. **Only publish student names and photos with consent** — put a comment in the code and a line in `CONTENT-GUIDE.md` saying so plainly.
- Exam timetable / datesheet downloads.
- Empty state that reads well when no results are published yet.

**Acceptance checks**
- Logged-out user hitting `/admin/notices` sees the login page, never the data.
- Creating a notice in the admin makes it appear on `/notices` after refetch.
- A failed upload shows an error and does not leave a broken row in the database.

---

### PHASE 5 — Polish, QA, deploy

1. **Motion pass** — walk every page top to bottom on a mid-range phone profile (CPU 4× throttle). Anything that stutters gets simplified. Remove animations that add nothing.
2. **Responsive audit** — 320, 360, 390, 768, 1024, 1440, 1920. No horizontal scroll anywhere. Tap targets ≥ 44×44px.
3. **Accessibility** — axe DevTools clean on every page. Full keyboard pass. Test with a screen reader on the nav, gallery lightbox, and forms. Verify contrast in all four theme/language combinations. Heading order correct on every page.
4. **Performance** — Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility, ≥ 95 best practices, ≥ 95 SEO. Route-level code splitting with `React.lazy`. Images as WebP with width/height set to prevent CLS. Fonts preloaded and subset. Target under 200KB gzipped initial JS.
5. **SEO** — per-route meta, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`, and JSON-LD `School` structured data using the real address and coordinates.
6. **Error handling** — a global error boundary with a friendly bilingual message, a styled 404 with helpful links, and offline-tolerant behaviour for the data fetches.
7. **Bug sweep** — click every link, submit every form with valid, invalid, and empty input, test every filter and every toggle, in both languages and both themes. Console must be clean.
8. **Docs** — `README.md` (setup, env, scripts, deploy), `CONTENT-GUIDE.md` (bilingual, non-technical), and SQL migration files checked into `supabase/migrations/`.
9. **Deploy** — build, deploy to Netlify or Vercel with SPA redirect rules, set env vars, verify the production build.

---

## 7. Code standards

- TypeScript strict. **No `any`.** Unknown shapes get `unknown` plus narrowing.
- Components under ~150 lines. If a file grows past that, it is doing two jobs — split it.
- Named exports; `default` only for lazy-loaded route components.
- Co-locate: `ComponentName/index.tsx`, `ComponentName/types.ts`.
- No prop drilling past two levels — use context.
- Never `useEffect` for something derivable during render.
- Clean up every listener, observer, timer, and subscription.
- No `console.log` in committed code.
- Conventional commits, one logical change each.

**File tree**

```
src/
  components/
    layout/     Header, Footer, Layout, MobileNav, SkipLink
    motion/     Reveal, StaggerGroup, CountUp, ScrollProgress, Marquee
    ui/         shadcn primitives
    common/     SchoolCrest, SectionHeading, PlaceholderImage, EmptyState
    home/ about/ academics/ staff/ gallery/ notices/ results/ admission/
    admin/
  context/      ThemeContext, LanguageContext, AuthContext
  hooks/        useInView, usePrefersReducedMotion, useParallax, useScrollPosition
  i18n/         translations.ts, types.ts
  data/         school.ts, staff.ts, notices.ts, gallery.ts, academics.ts, results.ts
  lib/          supabase.ts, utils.ts, seo.ts
  pages/
  types/
```

---

## 8. Things that will go wrong — handle them up front

These are the specific failure modes for this build. Address each deliberately.

1. **Reduced-motion elements stuck invisible.** The most common bug in animated sites. Test it in Phase 1 and again in Phase 5.
2. **Theme flash on load.** Only an inline blocking script in `<head>` fixes this. A `useEffect` does not.
3. **Hindi text overflowing.** Devanagari runs 15–25% longer than English. Every card, button, and nav item must be tested in Hindi. Do not fix this with `overflow: hidden` — fix the layout.
4. **Missing Hindi translations.** Type the translation object so an absent key fails the build.
5. **Enquiry data leaking.** Anonymous read access on `admission_enquiries` would expose parents' phone numbers publicly. Verify the policy directly.
6. **Site dies when Supabase pauses.** Free-tier projects pause after inactivity. The static fallback is not optional.
7. **Heavy images on 4G.** Compress on upload, serve transformed sizes, lazy-load below the fold, always set dimensions.
8. **Fabricated content presented as real.** No invented UDISE numbers, no stock photos of other schools, no made-up exam statistics. Placeholders must look like placeholders.
9. **Filter animations thrashing layout.** Animate opacity and transform; keep DOM order stable.
10. **Focus lost after closing the lightbox or mobile menu.** Return focus to the element that opened it.

---

## 9. Definition of done

- All five phases complete, each having passed its acceptance checks.
- Lighthouse mobile: performance ≥ 90, accessibility ≥ 95, best practices ≥ 95, SEO ≥ 95.
- Zero console errors or warnings in production.
- Zero TypeScript errors, zero ESLint errors.
- Every page correct in light/dark × English/Hindi.
- Site fully functional with Supabase disabled.
- RLS verified by attempting unauthorised reads.
- `README.md` and `CONTENT-GUIDE.md` written.
- Deployed and reachable.

---

*Build carefully. This is a real school serving real families, and the site will likely be maintained by someone with limited technical support. Favour clarity over cleverness everywhere — in the code, in the content structure, and in the documentation.*
