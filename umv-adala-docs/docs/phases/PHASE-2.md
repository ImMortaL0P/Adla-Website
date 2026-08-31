# Phase 2 — Public Content Pages

**Goal:** every public page built and complete, running on static data.

**Estimated effort:** 4–6 days human.

**Prerequisite:** Phase 1 acceptance checks all passing.

**Do not build:** Supabase, admin panel, `/results`, `/downloads`.

---

## Approach

Content comes from `src/data/*.ts`, typed to match the eventual database rows exactly (see `05-DATA-MODEL.md`), so Phase 3 swaps the source without touching a component.

Write real bilingual copy — not lorem ipsum, not `[Hindi translation here]`. The Hindi is part of the deliverable and its length is what reveals the layout bugs. Placeholder *facts* (staff names, statistics) stay obviously placeholder; placeholder *prose* does not exist — write the actual sentences the school would use.

Build pages in the order below. Home last, because it composes pieces the other pages establish.

---

## Order of work

### 1. Shared components first
`<SectionHeading>`, `<PlaceholderImage>` (initials tile using tokens), `<EmptyState>`, `<Seo>` (react-helmet-async wrapper), `<ErrorBoundary>`, `<Breadcrumbs>`, `<StatCard>`, `<FilterChips>`.

### 2. About
`/about` — history, vision and mission, school timings, management structure, board affiliation, and an animated milestone timeline: vertical on mobile, alternating left/right on desktop, each node revealing on scroll.

`/about/principal` — portrait placeholder, the message, a pull-quote, signature block.

`/about/infrastructure` — building, classrooms, library, science lab, computer lab, playground, drinking water, toilets, boundary wall, mid-day meal kitchen. Icon + description cards, staggered.

### 3. Academics
`/academics` — overview and four stage cards linking onward.

Each stage page (`primary`, `middle`, `secondary`, `senior`): subjects offered, weekly period structure, medium of instruction (Hindi medium, English as a subject), assessment pattern. Senior secondary adds Science / Commerce / Arts stream cards with subject combinations.

Subject lists use real `<table>` markup with `<th scope>`, wrapped in an `overflow-x-auto` container so a wide table scrolls inside itself rather than breaking the page at 360px.

### 4. Staff
`/staff` — filter chips by department, plus a search box filtering on name and subject.

Cards: initials-avatar placeholder, name, designation, subject, qualification.

**Filtering must not thrash layout.** Keep DOM order stable and animate opacity and transform; do not reorder or unmount on filter change. Announce the result count via `aria-live` so screen-reader users know the filter did something.

`/staff/:slug` — individual profiles. Handle an unknown slug with the 404, not a crash.

### 5. Gallery
`/gallery` — category filters, masonry layout, lazy loading with blur-up placeholders, explicit width and height on every image to prevent layout shift.

Lightbox requirements, all of them: focus trapped inside, arrow keys navigate, Escape closes, focus returns to the thumbnail that opened it, caption in the active language, swipe on touch, and the image never larger than the viewport.

Until real photographs exist, render token-based placeholder tiles. **Do not use stock photographs of other schools or of children.**

### 6. Notices
`/notices` — list with type badges, date, bilingual titles. Filter by type and by year. "New" badge for anything under 14 days old. Sorted newest first.

`/notices/:slug` — full notice, with an attachment download when present. Notice bodies render as plain text or through a sanitised markdown renderer — never `dangerouslySetInnerHTML`.

### 7. Admission
Numbered process steps revealing on scroll; eligibility by class; required-documents checklist; fee structure table stating plainly that this is a government school and most fees do not apply; important dates; FAQ accordion (Radix, keyboard accessible).

**Enquiry form** — react-hook-form + zod. Fields: student name (required), guardian name, phone (required, Indian mobile pattern), email (optional, validated), class applying for, message.

In this phase, submission opens a prefilled WhatsApp message with a `mailto:` fallback. Validation, error messages, and the success state are all built now — Phase 3 changes only where the data goes.

Error messages are bilingual, specific, and linked to their input via `aria-describedby`.

### 8. Contact
Address block, phone, email, office hours, embedded map centred on 25.508267, 84.918096, a "Get directions" link to Google Maps, and a general contact form.

Lazy-load the map iframe — it is heavy and below the fold. A static placeholder that loads the map on click is better still on a slow connection.

### 9. Mandatory disclosure
The statutory table: school details, UDISE code, management, land and building, classroom count, staff counts, facilities. Proper table markup. Every unknown value marked as pending, never invented.

### 10. Home — last
1. Hero (from Phase 1)
2. Notices ticker — `<Marquee>`, pauses on hover and focus-within
3. At a glance — four `<CountUp>` stats, labelled as provisional
4. About preview — two columns, both revealing
5. Academics grid — four stage cards, staggered, hover lift
6. Facilities strip — icon tiles
7. Principal's message excerpt — portrait, pull-quote
8. Gallery preview — six-image masonry teaser
9. Admission CTA band — full-width accent panel
10. Location — map + address

Home is the heaviest page and the one most visitors land on. Keep its initial payload lean: lazy-load the map and gallery images, and prioritise the hero.

---

## Acceptance checks

- [ ] Every page renders correctly in all four combinations: light/EN, dark/EN, light/HI, dark/HI
- [ ] No layout jump when switching language on any page
- [ ] No text clipped or overflowing in Hindi at 360px, on any page
- [ ] No horizontal scroll at 360px anywhere
- [ ] Every image has meaningful `alt` in the active language
- [ ] Gallery lightbox: focus trapped, arrows work, Escape closes, focus restored
- [ ] Staff filter and search work together; result count announced
- [ ] Enquiry form: empty submit, invalid phone, invalid email all caught with bilingual messages
- [ ] Every page has a unique title and meta description
- [ ] Every list has a designed empty state
- [ ] axe DevTools clean on every page
- [ ] Heading order correct on every page — one `<h1>`, no skipped levels
- [ ] Unknown `/staff/:slug` and `/notices/:slug` render the 404, not a crash
- [ ] Zero console errors

---

## Report before continuing

State: which pages you completed, any layout compromises Hindi forced, and any content you were unable to write without real information from the school.
