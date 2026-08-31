# Phase 4 — Admin Panel and Results Module

**Goal:** school staff can update the site without a developer, and the results and examinations section goes live.

**Estimated effort:** 4–5 days human.

**Prerequisite:** Phase 3 acceptance checks all passing, RLS verified.

---

## Design constraint that shapes everything here

**The person using this panel is a headmaster or teacher, on a phone, between classes.** Not a developer at a desk.

That single fact drives the decisions below: the admin UI must be fully usable at 360px, every action must be obvious without training, destructive actions must be hard to trigger accidentally, and error messages must say what to do rather than what went wrong technically. A panel that only works on desktop is a panel that will not be used, and an unused panel means the site goes stale within a term.

---

## Part A — Admin panel

### 1. Authentication
Supabase Auth, email and password. **Public sign-up disabled** — accounts are created manually in the Supabase dashboard, and the process is documented in `README.md`.

`AuthProvider` exposes `user`, `profile`, `loading`, `signIn`, `signOut`.

`<ProtectedRoute>` renders nothing of the panel while auth state resolves — a flicker of the dashboard before redirect is a real leak, not a cosmetic bug. Unauthenticated users go to `/admin/login`.

Session persists; expiry redirects to login with a clear message rather than silent failure.

### 2. Admin shell
Sidebar (collapsing to a bottom bar on mobile), breadcrumbs, the signed-in user's name, sign-out. Deliberately plainer than the public site — this is a tool, and decoration gets in the way.

The admin bundle is lazy-loaded and never downloaded by public visitors.

### 3. Dashboard
Counts (notices, staff, gallery images, new enquiries), the five most recent enquiries, and quick-action buttons for the two things done most often: add a notice, add gallery photos.

### 4. CRUD screens
`notices`, `staff`, `gallery`, `results`, `toppers`, `downloads`.

Each list screen: search, filter, sort, pagination, publish/unpublish toggle inline, edit and delete actions. Delete asks for confirmation naming the item, and prefers unpublish over deletion wherever the content might be wanted back.

Each editor: **English and Hindi fields side by side**, visually paired.

The bilingual UI needs one specific affordance: **make a missing Hindi translation obvious**. A warning badge on any row where a `*_hi` field is empty, and a save-time notice that the item will fall back to English. Missing Hindi is the failure that will actually happen in practice, so the tool should surface it rather than let it pass silently.

Forms use react-hook-form + zod, sharing schemas with the public site. Unsaved-changes warning on navigate away.

### 5. Image upload
- Drag-and-drop plus a file picker
- **Client-side compression before upload** (`browser-image-compression`) — a 6 MB phone photo is the expected input, not an edge case. Target ~1600px longest edge and roughly 300 KB.
- Progress indicator, preview, reorder by drag
- Reject oversized or wrong-type files with a message saying what to do, not what failed
- Delete removes the storage object as well as the row — no orphans

### 6. Enquiries inbox
Table of submissions: name, phone, class, date, status. Status changes between new / contacted / closed. CSV export. Detail view with a `tel:` link and a WhatsApp link, because the actual next action is a phone call.

Handle personal data carefully: no enquiry data in URLs, in analytics, or in logs.

### 7. Mutation behaviour
Optimistic updates with rollback on failure. A toast on every mutation, success and error. React Query cache invalidated on success so the public site reflects the change on next fetch.

---

## Part B — Results and examinations (public)

`/results`

### Components
- **Year selector** — defaults to the most recent published year
- **Summary cards** for Class 10 and Class 12 — appeared, passed, pass percentage, with `<CountUp>`
- **Trend chart** — pass percentage across years, Recharts, themed entirely with the design tokens (no default Recharts colours), responsive, and accompanied by **a visually-hidden data table** so screen-reader users get the same information. A chart without a table alternative fails AA.
- **Division breakdown** — first/second/third division counts
- **Toppers wall** — rank cards with name, percentage, stream, photo
- **Exam timetables** — download links
- **Empty state** — genuinely well-written, for the likely case that no results are published yet

### Student privacy — a real obligation, not a formality
Toppers are rendered **only** where `consent_on_file` is true. This is enforced in the RLS policy (Phase 3) *and* checked in the UI, because defence in depth is appropriate when the subjects are children.

Put a comment in the component saying so, and a plain-language line in `CONTENT-GUIDE.md` telling school staff that a student's name and photograph go on the public internet permanently and need the family's agreement first.

### Downloads page
`/downloads` — forms, syllabus, timetables, circulars. Grouped by category, with file type and size shown so a parent on limited data knows what they are about to download.

---

## Acceptance checks

- [ ] Logged-out user hitting `/admin/notices` sees login — **no flicker of data**
- [ ] Admin bundle absent from the public route's network waterfall
- [ ] Creating a notice in admin makes it appear on `/notices` after refetch
- [ ] Editing and unpublishing both work end to end
- [ ] Delete asks for confirmation naming the item
- [ ] A row with an empty Hindi field shows the warning badge
- [ ] Uploading a 5 MB photo succeeds and the stored file is compressed
- [ ] A failed upload leaves no broken row
- [ ] Deleting an image removes the storage object
- [ ] **The entire admin panel is usable at 360px width**
- [ ] Enquiries inbox lists submissions; CSV export opens correctly
- [ ] Session expiry redirects with a clear message
- [ ] Results page renders correctly with no published results (empty state)
- [ ] Trend chart has a working screen-reader table alternative
- [ ] A topper with `consent_on_file = false` does not render
- [ ] Zero console errors

---

## Report before continuing

State: how the missing-translation warning is surfaced, the compression settings chosen, and confirmation that the panel was tested at 360px.
