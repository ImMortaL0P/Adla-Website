# 06 — Standards and QA

## 1. Code standards

**TypeScript**
- `strict: true`. **No `any`** — unknown shapes get `unknown` plus narrowing.
- Types for data shapes, interfaces for component props.
- No non-null assertions (`!`) except immediately after an explicit check.

**Components**
- Under ~150 lines. A file past that is doing two jobs; split it.
- Named exports. `default` only for lazy-loaded route components.
- Props destructured in the signature, with the type declared above the component.
- No prop drilling past two levels — use context.

**Hooks**
- Never `useEffect` for something derivable during render. This is the single most common React defect and it causes double renders and flicker.
- Every listener, observer, timer and subscription is cleaned up in the return function.
- Dependency arrays complete and honest. Do not silence the lint rule; fix the dependency.

**General**
- No `console.log` in committed code.
- No commented-out blocks — version control remembers.
- Comments explain *why*, never *what*.
- Conventional commits, one logical change each.

## 2. Accessibility — WCAG 2.1 AA

Non-negotiable, and the government-school context makes it a genuine obligation rather than a checkbox.

- Semantic HTML first: `<nav>`, `<main>`, `<article>`, `<button>` for actions, `<a>` for navigation. A `div` with an onClick is a defect.
- Exactly one `<h1>` per page; heading levels never skip.
- Every image has meaningful `alt` in the active language; decorative images get `alt=""`.
- Every interactive element is reachable and operable by keyboard, with a visible focus ring at 2px offset.
- Dialogs and the mobile menu trap focus, close on Escape, and restore focus to their trigger.
- Form inputs have associated `<label>` elements; errors are linked with `aria-describedby` and announced via `aria-live`.
- Toggles carry `aria-pressed` or `aria-expanded` and an `aria-label` naming the action, not just the icon.
- Contrast: 4.5:1 body, 3:1 for text ≥ 24px or ≥ 19px bold, 3:1 for UI borders and focus rings. **Verified in all four combinations** — light/EN, light/HI, dark/EN, dark/HI.
- Tap targets ≥ 44×44px.
- `prefers-reduced-motion` respected everywhere. Under reduced motion, content appears — it does not stay hidden.
- Charts have an accessible data-table alternative.

Target: axe DevTools clean, Lighthouse accessibility ≥ 95 on every page.

## 3. Performance budget

| Metric | Target |
|---|---|
| Initial JS, gzipped | < 200 KB |
| Largest Contentful Paint (mobile, Slow 4G) | < 2.5 s |
| Cumulative Layout Shift | < 0.1 |
| Interaction to Next Paint | < 200 ms |
| Lighthouse performance (mobile) | ≥ 90 |
| Lighthouse accessibility | ≥ 95 |
| Lighthouse best practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |

Test with 4× CPU throttle and Slow 4G. Your laptop is not the target device; a ₹8,000 Android phone is.

## 4. Browser and viewport matrix

Viewports to check on every page: **320, 360, 390, 768, 1024, 1440, 1920**.

360px is the real-world floor and where most layout bugs surface. No horizontal scroll at any width, on any page, in either language.

## 5. QA checklist

Run in full at the end of Phase 5, and the relevant portions at the end of each phase.

### Theming
- [ ] Toggle theme 10× rapidly — no flash, no layout shift, no console error
- [ ] Hard reload in dark mode — no white flash
- [ ] `system` mode follows an OS theme change live
- [ ] No hardcoded colour anywhere: `grep -rE "#[0-9a-fA-F]{3,6}|rgb\(|text-(red|blue|green|slate|gray)-" src/`

### Language
- [ ] Every visible string changes on toggle; no English leaks into Hindi mode
- [ ] No layout jump when switching (Hindi is longer)
- [ ] No text clipped or overflowing in Hindi, at 360px, on every page
- [ ] `<html lang>` updates
- [ ] Dates format correctly in both languages

### Motion
- [ ] Emulate `prefers-reduced-motion: reduce` — **all content visible**, nothing stuck at opacity 0
- [ ] No animation stutters at 4× CPU throttle
- [ ] Marquee pauses on hover and on keyboard focus
- [ ] No layout-affecting properties animated (`height`, `width`, `top`, `left`)

### Accessibility
- [ ] Full keyboard pass on every page — skip link first, logical order, nothing unreachable
- [ ] Focus visible on every control
- [ ] Gallery lightbox: focus trapped, arrows work, Escape closes, focus restored
- [ ] Mobile menu: focus trapped, Escape closes, focus restored
- [ ] Screen-reader pass on nav, gallery, and forms
- [ ] axe DevTools clean on every page
- [ ] Heading order correct on every page

### Forms
- [ ] Submit empty — clear, bilingual validation messages
- [ ] Submit invalid phone, invalid email — caught
- [ ] Submit valid — success state, form clears, confirmation shown
- [ ] Double-submit prevented
- [ ] Network failure — error shown, input preserved, not silently lost

### Data
- [ ] Site renders fully with Supabase env vars removed
- [ ] Loading skeletons match final layout dimensions; no shift on arrival
- [ ] Empty states designed and written in both languages
- [ ] One failing section does not blank the page

### Security
- [ ] Anonymous `select` on `admission_enquiries` returns zero rows
- [ ] Anonymous `select` on unpublished notices returns zero rows
- [ ] Anonymous `select` on non-consented toppers returns zero rows
- [ ] Logged-out user hitting `/admin/notices` sees login, never a flicker of data
- [ ] `grep -r "service_role" dist/` returns nothing
- [ ] No `dangerouslySetInnerHTML` on database content

### Content integrity
- [ ] No invented UDISE number, phone number, or statistic presented as real
- [ ] No stock photographs of other schools or unrelated children
- [ ] Every placeholder visibly reads as a placeholder
- [ ] Toppers render only where `consent_on_file` is true

### SEO and meta
- [ ] Unique title and description per route
- [ ] Open Graph and Twitter cards render correctly in a preview tool
- [ ] `sitemap.xml` and `robots.txt` present and correct
- [ ] JSON-LD `School` structured data validates, with the real address and coordinates
- [ ] Deep links work after deploy (SPA redirect configured)

### Final
- [ ] Zero TypeScript errors, zero ESLint errors
- [ ] Zero console errors or warnings in production build
- [ ] Every link clicked, every filter used, every toggle exercised — in both languages, both themes
- [ ] Tested on a real low-end Android phone if one is available

## 6. Definition of done

All five phases complete and each having passed its acceptance checks; Lighthouse mobile ≥ 90 performance and ≥ 95 accessibility; every page correct across light/dark × English/Hindi; the site fully functional with Supabase disabled; RLS verified by attempted unauthorised reads; `README.md` and `CONTENT-GUIDE.md` written; deployed and reachable.
