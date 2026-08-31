# 03 — Architecture

## 1. Rendering strategy

Static SPA. `npm run build` produces `dist/`, deployed to a CDN. Data is fetched client-side from Supabase with React Query, falling back to bundled static data.

No SSR. The trade-off: slightly weaker first-paint SEO in exchange for a deployment the school can maintain and a hosting bill of zero. Mitigated by per-route meta tags, a generated `sitemap.xml`, and JSON-LD structured data — which is sufficient for a site whose search competition is essentially nil.

## 2. Folder structure

```
umv-adala/
├── docs/                       ← this documentation set
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── robots.txt
│   └── sitemap.xml
├── supabase/
│   └── migrations/             ← numbered SQL files, checked in
├── src/
│   ├── components/
│   │   ├── layout/             Header, Footer, Layout, MobileNav, SkipLink
│   │   ├── motion/             Reveal, StaggerGroup, CountUp, ScrollProgress, Marquee
│   │   ├── ui/                 shadcn primitives (restyled)
│   │   ├── common/             SchoolCrest, SectionHeading, PlaceholderImage,
│   │   │                       EmptyState, ErrorBoundary, Seo
│   │   ├── home/
│   │   ├── about/
│   │   ├── academics/
│   │   ├── staff/
│   │   ├── gallery/
│   │   ├── notices/
│   │   ├── results/
│   │   ├── admission/
│   │   └── admin/
│   ├── context/                ThemeContext, LanguageContext, AuthContext
│   ├── hooks/                  useInView, usePrefersReducedMotion, useParallax,
│   │                           useScrollPosition, useMediaQuery
│   ├── i18n/                   translations.ts, types.ts
│   ├── data/                   school.ts, staff.ts, notices.ts, gallery.ts,
│   │                           academics.ts, results.ts, downloads.ts
│   ├── lib/                    supabase.ts, queries/, utils.ts, seo.ts, validators.ts
│   ├── pages/                  one file per route
│   ├── types/                  database.ts (generated), domain.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── CONTENT-GUIDE.md
├── DEV.md
└── README.md
```

Co-locate anything component-specific: `Component/index.tsx`, `Component/types.ts`, `Component/useComponentThing.ts`. A component folder appears only when there is more than one file.

## 3. Provider tree

```tsx
<ErrorBoundary>
  <HelmetProvider>
    <QueryClientProvider>
      <ThemeProvider>        {/* light | dark | system */}
        <LanguageProvider>   {/* en | hi */}
          <AuthProvider>     {/* Phase 4; null-safe before then */}
            <BrowserRouter>
              <ScrollToTop />
              <Routes />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
</ErrorBoundary>
```

Order matters: theme and language wrap routing so a route change never remounts them.

## 4. Theme

Three states — `light`, `dark`, `system` — persisted to `localStorage` under `umv-theme`. `system` follows `prefers-color-scheme` live via a media-query listener.

**The flash problem.** A `useEffect` runs after first paint, so a dark-mode user sees a white flash on every load. The only fix is a blocking inline script in `index.html`'s `<head>`:

```html
<script>
  (function () {
    try {
      var s = localStorage.getItem('umv-theme') || 'system';
      var d = s === 'dark' || (s === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', d);
    } catch (e) {}
  })();
</script>
```

Wrapped in try/catch because `localStorage` throws in some privacy modes.

The 300ms cross-fade on theme change applies to a wrapper element's `background-color` and `color`, **not** to `*` — transitioning every element on the page is a significant jank source on cheap phones.

## 5. Internationalisation

Hand-rolled, no library. See `01-TECH-STACK.md` for why.

```ts
// src/i18n/types.ts
export type Lang = 'en' | 'hi'

// Deriving the key type from the English object means every Hindi
// translation must exist, or the build fails. This is the point.
export type TranslationKey = keyof typeof en
export type Translations = Record<Lang, Record<TranslationKey, string>>
```

```ts
// usage
const { t, lang, setLang } = useT()
<h1>{t('home.hero.title')}</h1>
```

Rules:

- Every user-visible string goes through `t()`. From the first component, not retrofitted.
- Keys are dotted and namespaced by page: `home.hero.title`, `staff.filter.all`.
- Persist to `localStorage` under `umv-lang`; set `<html lang>` and toggle `.lang-hi`.
- **English is the default landing language.** Hindi is one click away in the header.
- Content from the database carries `*_en` / `*_hi` column pairs; a `pick(row, lang)` helper resolves them and falls back to the other language rather than rendering empty.
- Dates format through `date-fns` with the matching locale.

**Hindi text runs 15–25% longer than English.** Reserve space in cards, buttons and nav items so switching language does not cause layout jump. Do not solve overflow with `overflow: hidden` — fix the layout.

## 6. Data flow and the fallback contract

This is the architectural rule that matters most.

```
Component
  └── useNotices()                    ← React Query hook
        ├── queryFn → Supabase select
        ├── on error   → static data from src/data/notices.ts
        ├── on empty   → static data
        └── on success → live data
```

Every entity hook follows this shape. Concretely:

```ts
export function useNotices() {
  const q = useQuery({
    queryKey: ['notices'],
    queryFn: fetchNotices,
    staleTime: 5 * 60_000,
    retry: 1,
  })
  // The fallback is the product, not a development convenience.
  const data = q.data?.length ? q.data : staticNotices
  return { ...q, data }
}
```

Why: Supabase free-tier projects pause after a week of inactivity. A school website that goes blank because a database slept is a worse outcome than showing notices that are a few weeks stale. The static files are seeded from the same content and updated whenever the school does a major content change.

Each major section is wrapped in its own error boundary, so a failure degrades one block rather than the page.

## 7. Routing

`react-router-dom` v6 with a shared `<Layout>` route. Route-level code splitting via `React.lazy` + `<Suspense>` for every page except Home, with a skeleton fallback matching the page's layout.

`<ScrollToTop />` resets scroll on `pathname` change, but honours hash anchors when present.

Admin routes sit behind `<ProtectedRoute>`, which redirects unauthenticated users to `/admin/login` — it must render nothing of the panel while auth state is resolving, not a flicker of the dashboard.

## 8. Performance

Budget: **under 200 KB gzipped initial JS.**

- Route-level code splitting; admin bundle never loads for public visitors.
- Images: WebP, explicit `width`/`height` to prevent CLS, `loading="lazy"` below the fold, `fetchpriority="high"` on the hero. Served through Supabase's transform API at the size actually rendered.
- Fonts: preconnect, preload the two body faces, `display=swap`, subset.
- No barrel-file imports from `lucide-react` — import icons individually.
- React Query `staleTime` set generously; this content changes daily at most.
- Analyse the bundle with `rollup-plugin-visualizer` before shipping. Anything unexpectedly large gets investigated, not accepted.

## 9. Security

- Only `VITE_SUPABASE_ANON_KEY` reaches the client. The service-role key never appears in frontend code, in any `VITE_` variable, or in the repository.
- Row Level Security on every table, with no exceptions. See `05-DATA-MODEL.md`.
- Uploads validated for MIME type and size client-side, and constrained again by storage policy server-side.
- No `dangerouslySetInnerHTML` on any user- or admin-supplied content. Notice bodies render as plain text or through a sanitised markdown renderer.
- Admin accounts are created manually in the Supabase dashboard. Public sign-up is disabled.
- After the production build, grep `dist/` to confirm no key other than the anon key is present.
