# Phase 5 — Polish, QA, and Deploy

**Goal:** the difference between "it works" and "it is finished".

**Estimated effort:** 3–4 days human. Do not compress this phase — it is where the quality actually arrives.

**Prerequisite:** Phases 1–4 acceptance checks all passing.

---

## 1. Motion pass

Walk every page top to bottom on a **4× CPU-throttled** profile — that is roughly a ₹8,000 Android phone, which is what most visitors are holding.

- Anything that stutters gets simplified or removed
- Anything animating `height`, `width`, `top` or `left` gets rewritten to `transform`
- Any animation that adds nothing gets deleted; restraint is the design
- Stagger delays that make a long list crawl get capped
- Verify no animation delays reading — text must be legible the moment it enters the viewport

## 2. Responsive audit

Every page at **320, 360, 390, 768, 1024, 1440, 1920**, in both languages and both themes.

- No horizontal scroll anywhere
- Tap targets ≥ 44×44px
- Wide tables scroll inside their own container, not the page
- Hindi does not clip or overflow at 360px — the layout gets fixed, never `overflow: hidden`
- Long words and unbroken strings wrap rather than overflow

## 3. Accessibility audit

Full detail in `06-STANDARDS-AND-QA.md` §2 and §5.

- axe DevTools clean on every page
- Complete keyboard pass on every page
- Screen-reader pass on: navigation, gallery lightbox, forms, results chart
- Contrast verified in all four theme/language combinations
- Heading order correct on every page — one `<h1>`, no skipped levels
- `prefers-reduced-motion` re-verified now that everything is built. This is the second required check on it, because regressions here are invisible in normal testing.
- Target: Lighthouse accessibility ≥ 95 on every page

## 4. Performance

Budget: **under 200 KB gzipped initial JS**, Lighthouse mobile performance ≥ 90.

- Analyse the bundle (`rollup-plugin-visualizer`). Investigate anything unexpectedly large rather than accepting it.
- Confirm route-level code splitting works and the admin bundle never loads for public visitors
- Images: WebP, explicit dimensions, `loading="lazy"` below the fold, `fetchpriority="high"` on the hero, served at rendered size
- Fonts: preconnect, preload the two body faces, subset, `display=swap`
- Icons imported individually, not from a barrel
- Map iframe lazy-loaded or click-to-load
- Test on Slow 4G with 4× CPU throttle, not on your laptop's connection

## 5. SEO

- Unique `<title>` and meta description on every route
- Open Graph and Twitter cards, verified in a preview tool
- `sitemap.xml` and `robots.txt`
- JSON-LD `School` structured data with the real address and coordinates:

```json
{
  "@context": "https://schema.org",
  "@type": "School",
  "name": "Utkramit Madhya Vidyalaya Adala",
  "alternateName": "उत्क्रमित मध्य विद्यालय अदला",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Adla, Naubatpur",
    "addressLocality": "Naubatpur",
    "addressRegion": "Bihar",
    "postalCode": "809011",
    "addressCountry": "IN"
  },
  "geo": { "@type": "GeoCoordinates",
           "latitude": 25.508267, "longitude": 84.918096 }
}
```

- Canonical URLs
- `lang` attribute correct in both language modes

## 6. Error handling

- Global error boundary with a friendly **bilingual** message and a route home — never a white screen or a stack trace
- Styled 404 with helpful links
- Network failures degrade to static content, never to a bare error string in front of a parent
- Forms preserve input on failure

## 7. Bug sweep

Systematic, not casual. In both languages and both themes:

- Click every link on every page
- Submit every form with valid, invalid, and empty input
- Exercise every filter, search, toggle, accordion, and lightbox
- Navigate with browser back and forward throughout
- Deep-link directly to every route
- Console must be completely clean — errors and warnings

Then run the full checklist in `06-STANDARDS-AND-QA.md` §5.

## 8. Documentation

**`README.md`** — what this is, tech stack, local setup, environment variables, scripts, how to create an admin account in Supabase, deployment steps, project structure.

**`CONTENT-GUIDE.md`** — bilingual, written for a teacher and not a developer. Which file or admin screen changes each piece of content, how to add a notice, how to add staff, how to upload photos, and the plain statement that publishing a student's name or photograph needs the family's agreement first.

**`supabase/migrations/`** — all SQL checked in and verified re-runnable on a fresh project.

## 9. Deploy

- `npm run build`, verify `dist/` locally with `npm run preview`
- Deploy to Netlify or Vercel
- **SPA redirect rule** — all paths → `/index.html` (200), or every deep link 404s
- Environment variables set in the host dashboard
- Automatic deploys from `main`
- Verify the production build: deep links, forms, theme, language, admin login
- Run Lighthouse against the **production URL**, not localhost

## 10. Handover

- [ ] Repository access transferred
- [ ] Supabase project ownership transferred, admin accounts created
- [ ] Content guide walked through with whoever will maintain the site
- [ ] The list of placeholder content still needing real values handed over explicitly

---

## Final acceptance

- [ ] Lighthouse mobile: performance ≥ 90, accessibility ≥ 95, best practices ≥ 95, SEO ≥ 95
- [ ] Zero TypeScript errors, zero ESLint errors
- [ ] Zero console errors or warnings in production
- [ ] Every page correct across light/dark × English/Hindi
- [ ] Site fully functional with Supabase disabled
- [ ] RLS verified by attempted unauthorised reads
- [ ] No fabricated content anywhere — no invented UDISE number, statistics, or stock photographs of other schools
- [ ] `README.md` and `CONTENT-GUIDE.md` complete
- [ ] Deployed, reachable, and tested on a real low-end Android phone if one is available
