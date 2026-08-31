# 08 — Risk Register

The specific ways this build fails. Each is preventable, and each is cheaper to prevent than to discover late. Address them deliberately rather than hoping.

---

## R1 — Reduced-motion users see nothing

**Severity: critical. Likelihood: high if not addressed in Phase 1.**

Scroll reveals set `opacity: 0` and transition to `1` when the element enters the viewport. Under `prefers-reduced-motion: reduce`, a naive implementation disables the transition — and the element stays permanently invisible. The site becomes unreadable for exactly the users who asked for accommodation, and it is invisible in normal testing.

**Prevention:** one central `usePrefersReducedMotion` gate; when true, components render in the **final visible state immediately**. Reduced motion means skip the animation, never skip the reveal. Plus the CSS backstop. Verified in Phase 1 and again in Phase 5.

---

## R2 — Parents' phone numbers publicly readable

**Severity: critical. Likelihood: moderate.**

The `admission_enquiries` table holds names and phone numbers. Supabase's anon key is embedded in the public JavaScript bundle by design — it is not a secret. Without an explicit policy denying anonymous `select`, anyone who opens DevTools can dump every enquiry the school has ever received.

**Prevention:** RLS with insert-only for `anon` and select restricted to admins. **Verified by attempting the read with the anon key**, not by reading the SQL. Phase 3 acceptance check.

---

## R3 — Theme flash on load

**Severity: moderate. Likelihood: certain without the fix.**

A `useEffect` that applies the theme runs after first paint. Every dark-mode visitor sees a white flash on every page load.

**Prevention:** a blocking inline script in `<head>` that reads `localStorage` and sets the class before paint. Wrapped in try/catch — `localStorage` throws in some privacy modes.

---

## R4 — Hindi text overflowing

**Severity: moderate. Likelihood: high.**

Devanagari runs 15–25% longer than the equivalent English, with taller ascenders. Layouts designed and tested in English break in Hindi: clipped buttons, wrapped nav items, cards of unequal height, headings colliding.

**Prevention:** write real Hindi copy in Phase 2, not placeholders — the length is what reveals the bug. Test every page at 360px in Hindi. Fix the layout; never `overflow: hidden`.

---

## R5 — Missing Hindi translations shipping silently

**Severity: moderate. Likelihood: high over time.**

Someone adds a notice in a hurry and leaves the Hindi blank. The Hindi page shows an empty card.

**Prevention:** type the translation object so a missing static key fails the build. For database content, `pick()` falls back to the other language rather than rendering empty. In the admin, a warning badge on any row with an empty `*_hi` field.

---

## R6 — Site goes blank when Supabase pauses

**Severity: critical. Likelihood: high on the free tier.**

Free Supabase projects pause after about a week of inactivity. A school site that goes blank because its database slept is a serious failure — and a school website may legitimately go weeks without an update.

**Prevention:** the static fallback contract. Every query hook falls back to `src/data/*.ts`. Verified by removing the environment variables entirely and confirming the site renders completely. Phase 3 acceptance check.

---

## R7 — Fabricated content presented as real

**Severity: critical, and different in kind from the others.**

An agent filling gaps will happily generate a plausible 11-digit UDISE number, invent pass percentages, and pull stock photographs of unrelated schoolchildren. The result is a real institution's official website carrying fabricated records — which is a genuine problem, not a cosmetic one. Parents make decisions on this information; officials treat it as a record.

**Prevention:** obvious placeholders only — `XXXXXXXXXXX — to be updated`, initials tiles instead of photographs. Stated in the brief, restated in every phase, and a QA checklist item. When in doubt, leave it visibly empty.

---

## R8 — Heavy images on slow connections

**Severity: moderate. Likelihood: high once staff start uploading.**

A headmaster uploads a 6 MB photo from their phone. It is served at full size into a 400px card. A parent on 4G waits, then leaves.

**Prevention:** client-side compression before upload (~1600px, ~300 KB), Supabase transform API at rendered size, lazy loading below the fold, explicit dimensions to prevent shift.

---

## R9 — Admin panel unusable on a phone

**Severity: moderate. Likelihood: high if not designed for.**

The panel gets built and tested on a 27-inch monitor. The headmaster tries to post a notice from a phone between classes, gives up, and the site is stale within a term. An unused admin panel is the same as no admin panel.

**Prevention:** the panel is designed mobile-first alongside the public site, and "usable at 360px" is a Phase 4 acceptance check.

---

## R10 — Filter animations thrashing layout

**Severity: low. Likelihood: moderate.**

The staff and gallery filters unmount and remount cards, causing reflow, scroll jump, and visible stutter on cheap phones.

**Prevention:** stable DOM order; animate opacity and transform only; never reorder on filter. Announce the result count via `aria-live`.

---

## R11 — Focus lost after closing an overlay

**Severity: moderate for keyboard and screen-reader users.**

Closing the lightbox or mobile menu drops focus to `<body>`. A keyboard user is dumped at the top of the document with no idea where they were.

**Prevention:** focus trapped while open, returned to the triggering element on close. Radix primitives handle this correctly — which is a large part of why shadcn/ui is in the stack rather than hand-rolled components.

---

## R12 — Scope creep into a student portal

**Severity: schedule.**

"Can it also show attendance and marks?" is the natural next request. It needs real student data, role management, data-entry workflows, and an operational commitment the school has not made. Attempted mid-build, it derails everything else.

**Prevention:** explicitly out of scope in `00-PROJECT-BRIEF.md`. If asked, scope it as a separate project after this one is live and being maintained.

---

## Watch-outs by phase

| Phase | Highest risks |
|---|---|
| 1 | R1, R3 |
| 2 | R4, R7, R10, R11 |
| 3 | R2, R6 |
| 4 | R5, R8, R9 |
| 5 | R1 again (regression), R7 final sweep |
