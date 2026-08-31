# Phase 1 — Foundation

**Goal:** every decision that is expensive to change later is made and implemented correctly, and nothing else.

**Estimated effort:** 2–3 days human, 1 long session for an agent.

**Do not build in this phase:** page content, Supabase, the admin panel, the results module.

---

## Why this phase exists

Three things in this project are painful to retrofit and cheap to get right at the start: the colour token system, the bilingual layer, and the reduced-motion gate. Phase 1 exists to install all three before a single page of content is written.

The bilingual layer is the sharpest example. Adding `t()` calls to nine finished pages, in two languages, while re-checking every layout for Hindi overflow, is several days of tedious and error-prone work. Writing every string through `t()` from the first component costs nothing.

---

## Deliverables

### 1. Project scaffold
- Vite + React + TypeScript, `strict: true`
- Tailwind configured with the token mapping
- shadcn/ui installed, primitives restyled to the tokens (no default slate left anywhere)
- Path alias `@/` → `src/`
- ESLint (`@typescript-eslint`, `react-hooks`, `jsx-a11y`) + Prettier + Husky + lint-staged
- `.env.example`, `.gitignore`, `README.md` skeleton

### 2. Design tokens
Implement the full token set from `02-DESIGN-SYSTEM.md` §2 in `index.css` and map it in `tailwind.config.ts`.

**Then run the contrast audit** across all nine pairs, in both themes, and record the measured ratios in a comment block at the bottom of `index.css`. Adjust lightness until everything passes. `--primary-strong` exists because the decorative saffron fails AA as a button fill — use it there and keep the lighter hue for tints.

This audit is a deliverable, not a suggestion. If the comment block is absent, the phase is not complete.

### 3. Typography
Google Fonts loaded with preconnect and `display=swap`; the fluid clamp-based scale; `.lang-hi` line-height and letter-spacing adjustments. Check the header first — it is where both scripts sit adjacent and where mismatches show.

### 4. Theme system
- `ThemeProvider` — `light` / `dark` / `system`, persisted to `localStorage` under `umv-theme`
- `system` follows `prefers-color-scheme` live
- **Blocking inline script in `index.html` `<head>`** (see `03-ARCHITECTURE.md` §4). A `useEffect` runs after first paint and produces a white flash for every dark-mode visitor. Only the inline script fixes this.
- 300ms cross-fade applied to a wrapper element, not to `*`
- Header toggle with `aria-label` and `aria-pressed`

### 5. Language system
- `LanguageProvider` with `useT()`, typed so a missing Hindi key fails the build
- Persisted under `umv-lang`; sets `<html lang>` and toggles `.lang-hi`
- Header toggle showing `EN | हिं`
- English default
- **Every string in every component from this point onward goes through `t()`**

### 6. Layout shell
- `<SkipLink>` as the first focusable element in the DOM
- `<Header>` — crest, bilingual school name, nav (About and Academics as dropdowns), theme toggle, language toggle. Transparent over the hero, gaining blurred background and hairline border on scroll.
- `<MobileNav>` — slide-in sheet, staggered item reveal, expandable sections, toggles at the bottom within thumb reach, focus trapped, Escape closes, focus restored
- `<Footer>` — three columns, hairline, Government of Bihar attribution, copyright
- `<Layout>` composing them with `<main id="main">`

### 7. Routing
All routes from `04-INFORMATION-ARCHITECTURE.md` §1 stubbed with a heading and a short "coming in the next phase" note. `<ScrollToTop />` honouring hash anchors. A styled bilingual 404 with helpful links. Route-level `React.lazy` in place from the start.

### 8. Motion primitives
Build all seven from `02-DESIGN-SYSTEM.md` §6.2: `usePrefersReducedMotion`, `useInView`, `<Reveal>`, `<StaggerGroup>`, `<CountUp>`, `useParallax`, `<ScrollProgress>`, `<Marquee>`.

**Get the reduced-motion gate right now.** Reduced motion means skip the animation, never skip the reveal. The failure mode — content permanently at `opacity: 0` for users who asked for less motion — is invisible in normal testing and makes the site unusable for the people it affects. Add the CSS backstop as well as the JS gate.

### 9. School crest
Inline SVG component with 24/32/48/96px variants, drawn with `currentColor` and tokens. Generate `favicon.svg` and `og-image.png` from the same artwork.

### 10. Home hero
One full-viewport section: school name in both scripts, one-line positioning statement, two CTAs (Admission Enquiry / Explore Academics), CSS-only pastel gradient-mesh background, scroll cue. No stock photograph. Must look excellent in both themes at 360px and 1440px.

### 11. `src/data/school.ts`
All verified facts as constants; every unknown as a clearly-marked placeholder with `// TODO: replace`. Use `"XXXXXXXXXXX — to be updated"`, never a plausible fake.

---

## Acceptance checks

Do not begin Phase 2 until every line passes.

- [ ] Contrast audit comment block present in `index.css`; all nine pairs pass AA in both themes
- [ ] Toggle theme 10× rapidly — no flash, no layout shift, no console error
- [ ] Hard reload in dark mode — **no white flash**
- [ ] `system` mode follows an OS theme change without reload
- [ ] Toggle language — every visible string changes; no English in Hindi mode
- [ ] Header looks correct in Hindi: no clipping, no size mismatch between scripts
- [ ] `grep -rE "#[0-9a-fA-F]{3,6}|rgb\(|text-(red|blue|green|slate|gray)-" src/` returns nothing
- [ ] Tab through the page — skip link first, focus visible everywhere, logical order
- [ ] Mobile menu traps focus, closes on Escape, returns focus to the trigger
- [ ] DevTools → Rendering → `prefers-reduced-motion: reduce` — **all content visible**, nothing stuck hidden
- [ ] Hero renders correctly at 320, 360, 768, 1440 in both themes and both languages
- [ ] No horizontal scroll at 360px
- [ ] Lighthouse accessibility ≥ 95 on the hero page
- [ ] Zero TypeScript errors, zero ESLint errors, clean console

---

## Report before continuing

State: the measured contrast ratios, which token values you adjusted and why, the translation key structure you chose, and anything in this specification you found ambiguous or disagreed with.
