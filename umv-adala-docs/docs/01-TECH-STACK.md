# 01 — Technology Stack

Every choice below is fixed. Where a decision could reasonably have gone another way, the reasoning is given — follow the choice, but understand why, because that reasoning also tells you how to resolve questions this document does not cover.

## 1. Core

| Layer | Choice | Version | Why |
|---|---|---|---|
| Build tool | **Vite** | ^5.4 | Fast dev server, tiny config, excellent code splitting. Next.js was rejected — this site has no server-rendering need that static build plus client fetch does not cover, and Next adds hosting complexity the school cannot maintain. |
| Language | **TypeScript** | ^5.5 | `strict: true`. Non-negotiable: the bilingual content model is where type safety earns its cost — a missing Hindi translation becomes a compile error rather than an English string leaking into a Hindi page. |
| UI library | **React** | ^18.3 | Ecosystem, and the agent building this knows it best. |
| Styling | **Tailwind CSS** | ^3.4 | With CSS custom properties for all colour. See `02-DESIGN-SYSTEM.md` — the tokens are the contract, Tailwind is just the delivery mechanism. |
| Components | **shadcn/ui** | latest | Copied into the repo, not installed as a dependency. Radix primitives underneath give correct accessibility for dialogs, dropdowns, and the mobile sheet — hand-rolling those is where a11y bugs come from. |
| Icons | **lucide-react** | ^0.4x | Tree-shakeable, consistent stroke weight, matches the restrained visual register. |
| Routing | **react-router-dom** | ^6.26 | Real routes, real URLs. Every page must be shareable and indexable. |

## 2. Data and state

| Concern | Choice | Notes |
|---|---|---|
| Server state | **@tanstack/react-query** ^5 | Caching, retry, stale-while-revalidate. Critical for the fallback contract — a failed query falls back to static data rather than blanking the section. |
| Client state | **React Context** | Theme, language, auth. Three contexts, nothing more. No Redux, no Zustand — this app does not have state complex enough to justify either. |
| Forms | **react-hook-form** ^7 + **zod** ^3 | Uncontrolled inputs keep re-renders low on cheap phones. Zod schemas are shared between form validation and Supabase insert typing. |
| Backend | **Supabase** | Postgres + Auth + Storage. Phase 3 onward only. |
| Static fallback | **Typed TS data files** | `src/data/*.ts`. Permanent, not temporary. |

## 3. Animation — deliberately minimal

**No animation library.** Not Framer Motion, not GSAP, not react-spring.

This is the most likely place for an agent to deviate, so the reasoning is worth stating plainly: Framer Motion adds roughly 50 KB gzipped for behaviour this site can get from CSS transitions plus one IntersectionObserver hook. On the target device — a low-end Android phone on 4G — that is a real cost paid on every visit, in exchange for animations that must stay subtle anyway. The motion primitives in `02-DESIGN-SYSTEM.md` are perhaps 150 lines of code total.

What we use instead:

- CSS transitions on `transform` and `opacity` only
- `IntersectionObserver` for scroll reveals
- `requestAnimationFrame` for count-ups and parallax
- CSS `@keyframes` for the marquee ticker

## 4. Supporting libraries

| Package | Purpose | Phase |
|---|---|---|
| `@supabase/supabase-js` | Database, auth, storage client | 3 |
| `recharts` | Pass-percentage trend chart on the results page | 4 |
| `browser-image-compression` | Client-side compression before upload — essential when a headmaster uploads a 6 MB phone photo | 4 |
| `date-fns` | Date formatting with locale support for Hindi dates | 2 |
| `clsx` + `tailwind-merge` | Conditional class composition | 1 |
| `react-helmet-async` | Per-route meta tags | 2 |

Nothing else without a stated reason. Every added dependency is weight on a slow connection.

## 5. Explicitly rejected

| Rejected | Instead | Reason |
|---|---|---|
| Next.js | Vite SPA | No SSR requirement; simpler for the school to host and maintain |
| Framer Motion / GSAP | CSS + IntersectionObserver | ~50 KB for effects we deliberately keep subtle |
| i18next / react-intl | Hand-rolled typed context | The whole i18n need is one object and one hook; a library adds weight and indirection |
| Redux / Zustand | React Context | State here is three global values |
| Styled-components / Emotion | Tailwind + CSS vars | Runtime CSS-in-JS costs on low-end devices |
| Firebase | Supabase | Postgres, real RLS, generous free tier, SQL the school's future developer can read |
| A CMS (Strapi, Sanity) | Supabase + custom admin | One less service to pay for and maintain; the admin panel we need is small |

## 6. Tooling

- **ESLint** with `@typescript-eslint`, `eslint-plugin-react-hooks`, `jsx-a11y`. The a11y plugin is not optional — it catches roughly half the accessibility defects before they reach review.
- **Prettier**, 100 char width, single quotes, no semicolons omitted.
- **Husky + lint-staged** — lint and type-check on commit.
- **Vitest** + **@testing-library/react** for the handful of things worth unit-testing: the i18n hook, the reduced-motion hook, form validation schemas.
- **axe DevTools** and **Lighthouse** for the Phase 5 audit.

## 7. Environment

```bash
node >= 20.x
npm >= 10.x     # npm, not pnpm or yarn — one less thing for the next maintainer
```

```bash
# .env.example — commit this, never the real .env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
VITE_SITE_URL=https://umvadala.example
```

**The Supabase service-role key must never appear in client code or in any `VITE_`-prefixed variable.** Everything prefixed `VITE_` is embedded in the public bundle. If you find yourself needing the service key in the frontend, an RLS policy is wrong — fix the policy.

## 8. Deployment

Static build (`npm run build` → `dist/`) deployed to **Netlify** or **Vercel**. Both free tiers are adequate. Required configuration:

- SPA redirect: all paths → `/index.html` (200), so deep links work
- Environment variables set in the host dashboard
- Automatic deploys from the `main` branch
- Custom domain when the school has one

## 9. Browser support

| Target | Rationale |
|---|---|
| Chrome / Android WebView, last 2 years | The dominant real-world case |
| Safari iOS 15+ | |
| Firefox, Edge, last 2 versions | |
| **Not** IE11 | |

Test on a throttled connection (Slow 4G) with 4× CPU throttling in DevTools. That profile, not your laptop, is the real target.
