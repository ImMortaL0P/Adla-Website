# 02 — Design System

## 1. Visual principles

**Muted pastel, not candy pastel.** Chalk, clay, sage, dusty sky. The school should read as trustworthy, warm and cared-for — not as a preschool, and not as a SaaS landing page. Restraint reads as seriousness.

**Borders, not shadows.** Hairline 1px borders at low opacity carry the structure. Heavy drop shadows are banned; at most a very soft ambient shadow on floating elements (dialogs, the sticky header).

**Whitespace is the layout.** Sections breathe. Vertical rhythm on an 8px scale. When a section feels crowded, the fix is space, not smaller type.

**Zero hardcoded colour.** Every colour is an HSL custom property. Writing `text-blue-500` or `#ffffff` in a component is a defect — there are no exceptions, including for "just this one thing".

## 2. Colour tokens

HSL triplets without the `hsl()` wrapper, so Tailwind's opacity modifiers work (`bg-primary/10`).

```css
:root {
  /* Surfaces — warm chalk paper */
  --background:        40 30% 97%;
  --foreground:        222 25% 16%;
  --card:              40 30% 99%;
  --card-foreground:   222 25% 16%;
  --popover:           40 30% 99%;
  --popover-foreground:222 25% 16%;
  --muted:             40 18% 93%;
  --muted-foreground:  222 12% 42%;
  --border:            40 15% 87%;
  --input:             40 15% 87%;
  --ring:              32 55% 58%;

  /* School accent roles */
  --saffron: 32 62% 62%;    /* muted marigold */
  --leaf:    145 28% 52%;   /* sage */
  --sky:     205 45% 60%;   /* dusty blue */
  --clay:    18 32% 58%;    /* terracotta */

  /* Semantic roles map onto the school roles */
  --primary:              32 62% 62%;
  --primary-foreground:   40 40% 99%;
  --primary-strong:       32 58% 44%;  /* AA-safe on light backgrounds */
  --secondary:            145 28% 52%;
  --secondary-foreground: 40 40% 99%;
  --accent:               205 45% 60%;
  --accent-foreground:    40 40% 99%;

  --destructive: 358 55% 55%;
  --success:     145 45% 42%;
  --warning:      38 70% 50%;

  --radius: 0.75rem;
}

.dark {
  /* Soft navy-charcoal — never pure black */
  --background:        220 18% 11%;
  --foreground:        40 22% 94%;
  --card:              220 16% 15%;
  --card-foreground:   40 22% 94%;
  --popover:           220 16% 15%;
  --popover-foreground:40 22% 94%;
  --muted:             220 14% 19%;
  --muted-foreground:  220 10% 66%;
  --border:            220 14% 23%;
  --input:             220 14% 23%;
  --ring:              32 50% 66%;

  /* Same hues, lightness lifted and saturation dropped → pastel on dark */
  --saffron: 32 48% 70%;
  --leaf:    145 24% 64%;
  --sky:     205 38% 70%;
  --clay:    18 28% 66%;

  --primary:              32 48% 70%;
  --primary-foreground:   220 20% 12%;
  --primary-strong:       32 52% 74%;
  --secondary:            145 24% 64%;
  --secondary-foreground: 220 20% 12%;
  --accent:               205 38% 70%;
  --accent-foreground:    220 20% 12%;

  --destructive: 358 50% 66%;
  --success:     145 38% 60%;
  --warning:      38 60% 66%;
}
```

### The contrast audit — do this, do not skip it

Before building anything on top of these tokens, compute the contrast ratio for every pair below and record the measured values in a comment block at the bottom of `index.css`. Adjust lightness values until all pass. Do it with a calculation, not by eye.

| Pair | Required |
|---|---|
| `foreground` on `background` | 4.5:1 |
| `foreground` on `card` | 4.5:1 |
| `muted-foreground` on `background` | 4.5:1 |
| `muted-foreground` on `muted` | 4.5:1 |
| `primary-foreground` on `primary` | 4.5:1 |
| `secondary-foreground` on `secondary` | 4.5:1 |
| `accent-foreground` on `accent` | 4.5:1 |
| `border` on `background` | 3:1 (non-text, but must be visible) |
| `ring` on `background` | 3:1 |

**Known trap:** `--saffron` at 62% lightness with white text fails AA in light mode. That is why `--primary-strong` exists — use it for filled button backgrounds and any coloured text, and keep the lighter `--saffron` for decorative fills, borders, and tints. Do not "fix" this by darkening the decorative hue; that flattens the whole palette.

Repeat the audit for dark mode independently. Passing in light mode tells you nothing about dark.

## 3. Typography

### Fonts

| Role | Latin | Devanagari |
|---|---|---|
| Display / headings | `Fraunces` (or `Bitter`) | `Tiro Devanagari Hindi` |
| Body / UI | `Inter` | `Noto Sans Devanagari` |

Load from Google Fonts with `preconnect` and `display=swap`. Subset to the ranges actually used. Preload the two body fonts; the display fonts can swap.

### The Devanagari adjustment

Devanagari has taller ascenders, a continuous headline (shirorekha), and needs more line-height than Latin at the same size. When Hindi is active, `<html>` carries `.lang-hi`:

```css
.lang-hi body                       { line-height: 1.75; letter-spacing: 0; }
.lang-hi h1, .lang-hi h2, .lang-hi h3 { line-height: 1.4; }
.lang-hi .tracking-tight            { letter-spacing: 0; }  /* tight tracking breaks conjuncts */
```

Hindi and English must look like the same design at the same size. The header, where both scripts sit adjacent, is the test case — check it first.

### Scale

Fluid, clamp-based, on an 8px rhythm:

```css
--fs-xs:   clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem);
--fs-sm:   clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem);
--fs-base: clamp(1rem, 0.97rem + 0.2vw, 1.0625rem);
--fs-lg:   clamp(1.125rem, 1.08rem + 0.25vw, 1.25rem);
--fs-xl:   clamp(1.375rem, 1.28rem + 0.45vw, 1.625rem);
--fs-2xl:  clamp(1.75rem, 1.55rem + 0.9vw, 2.25rem);
--fs-3xl:  clamp(2.125rem, 1.8rem + 1.5vw, 3rem);
--fs-4xl:  clamp(2.5rem, 1.95rem + 2.5vw, 4rem);
--fs-5xl:  clamp(3rem, 2.1rem + 4vw, 5.5rem);
```

Body text never below 16px on mobile. Headings must not wrap awkwardly at 360px — test every one, in both languages.

## 4. Spacing, radius, elevation

- **Spacing:** Tailwind's default 4px scale. Section vertical padding `py-16` mobile → `py-24` tablet → `py-32` desktop.
- **Container:** `max-w-7xl` with `px-5 sm:px-8 lg:px-12`.
- **Radius:** `--radius: 0.75rem`. Cards `rounded-xl`, buttons `rounded-lg`, pills `rounded-full`, images `rounded-lg`.
- **Elevation:** three levels only — flat (border), raised (border + `shadow-sm`), floating (border + `shadow-md`). Nothing heavier.

## 5. The school crest

An inline SVG component, not a raster asset. "UMV" set in a rounded shield with a subtle open-book motif and a small sun arc above. Drawn with `currentColor` and tokens so it recolours per theme automatically.

Sizes: 24 / 32 / 48 / 96 px variants via a `size` prop. Generate the favicon and Open Graph image from the same artwork.

## 6. Motion system

### 6.1 The reduced-motion gate — the most important part

```ts
// src/hooks/usePrefersReducedMotion.ts
// Returns true when the user has asked for reduced motion. Subscribes to changes.
```

Every animated component checks this and, when true, **renders in the final visible state immediately**.

The classic bug: reduced-motion users get elements permanently stuck at `opacity: 0` because the reveal transition never fires. Reduced motion must mean *skip the animation*, never *skip the reveal*. Write it that way, then verify it in DevTools → Rendering → emulate `prefers-reduced-motion: reduce`.

CSS backstop, in addition to the JS gate:

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

### 6.2 Primitives

| Component / hook | Behaviour |
|---|---|
| `useInView(opts)` | IntersectionObserver wrapper. `triggerOnce` default true, `rootMargin: '0px 0px -10% 0px'`. Disconnects on unmount. |
| `<Reveal delay direction>` | Fade + 16px rise (or slide from left/right). 500ms, `cubic-bezier(0.16, 1, 0.3, 1)`. |
| `<StaggerGroup stagger={80}>` | Passes incremental delay to children. Caps total stagger at ~500ms so long lists don't crawl. |
| `<CountUp to duration>` | rAF count, eased, starts in view. Formats with `toLocaleString('en-IN')`. Reduced motion → final number immediately. |
| `useParallax(strength)` | Transform-only translate on scroll via rAF. Disabled below 768px and under reduced motion. |
| `<ScrollProgress>` | Thin bar under the header. `transform: scaleX()` only. |
| `<Marquee>` | Infinite horizontal scroll for the notices ticker. Pauses on hover **and** on `focus-within`. |

### 6.3 Rules

- Durations 400–700ms. Ease-out. No bounce, no spring, no elastic.
- Animate **only** `transform` and `opacity`. Never `height`, `width`, `top`, or `left`.
- Nothing gates reading: text is legible the moment it enters the viewport; motion accompanies it.
- Route changes get at most a 150ms fade. No page transitions.
- Hover effects: 200ms, subtle lift (`translateY(-2px)`) plus a border-colour shift. No scale above 1.02.
- If an animation stutters at 4× CPU throttle, simplify or remove it.

## 7. Component conventions

- shadcn/ui primitives are restyled to the tokens on installation — do not leave the default slate palette anywhere.
- Every interactive element has a visible focus ring using `--ring`, at 2px offset. Never `outline: none` without a replacement.
- Tap targets minimum 44×44px.
- Buttons: `default` (primary-strong fill), `secondary`, `outline` (hairline border), `ghost`, `link`. Loading state is a spinner replacing the label, with the width preserved so nothing jumps.
- Cards: `bg-card`, hairline border, `rounded-xl`, `p-6`. Hover lift only when the card is a link.
- Every list has a designed empty state — icon, one line of explanation in the active language, and an action where one makes sense.
- Skeletons match the final layout's dimensions exactly. No spinners for content loading; no layout shift when content arrives.
