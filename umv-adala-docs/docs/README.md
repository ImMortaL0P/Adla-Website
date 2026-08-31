# UMV Adala — Project Documentation

Documentation set for building the official website of **Utkramit Madhya Vidyalaya Adala** (UMV Adala), a Bihar Government school teaching Class 1–12 at Adla, Naubatpur, Patna district.

## How to use these documents

If you are an **AI coding agent**, read `01-TECH-STACK.md` through `05-DATA-MODEL.md` in full before writing any code, then execute `phases/PHASE-1.md` through `phases/PHASE-5.md` strictly in order. Stop at the end of each phase, run its acceptance checks, and report before continuing.

If you are a **human developer**, `01` and `06` are the two you need on day one. The phase files are your sprint plan.

If you are **school staff** who will maintain the site, only `07-CONTENT-GUIDE.md` concerns you.

## Contents

| File | What it covers |
|---|---|
| `00-PROJECT-BRIEF.md` | What we are building, for whom, and the constraints that shape every decision |
| `01-TECH-STACK.md` | Every dependency, why it was chosen, what was rejected |
| `02-DESIGN-SYSTEM.md` | Colour tokens, typography, spacing, motion system, component conventions |
| `03-ARCHITECTURE.md` | Folder structure, routing, state management, rendering strategy |
| `04-INFORMATION-ARCHITECTURE.md` | Every page, every route, what lives on each |
| `05-DATA-MODEL.md` | Supabase schema, RLS policies, storage buckets, the static-fallback contract |
| `06-STANDARDS-AND-QA.md` | Code standards, accessibility targets, performance budgets, the QA checklist |
| `07-CONTENT-GUIDE.md` | Non-technical guide for school staff on replacing placeholder content |
| `08-RISK-REGISTER.md` | The ten things most likely to go wrong, and how each is prevented |
| `phases/PHASE-1.md` | Foundation — design system, theming, i18n, layout shell, motion primitives |
| `phases/PHASE-2.md` | Public content pages |
| `phases/PHASE-3.md` | Supabase backend and live data |
| `phases/PHASE-4.md` | Admin panel and the results & examinations module |
| `phases/PHASE-5.md` | Polish, QA, accessibility, performance, deploy |

`../DEV.md` at the repository root is the condensed single-file version of all of this, for handing to an agent in one paste.

## Ground rules that apply to every document

1. **Nothing invented is presented as real.** Staff names, UDISE code, phone numbers, exam results and photographs are unknown. They appear as obvious placeholders, never as plausible fabrications.
2. **The site must work with the database switched off.** Static data files are the fallback, not a scaffold to be deleted.
3. **Mobile-first is literal.** The primary visitor is a parent on a low-end Android phone over patchy 4G.
4. **Bilingual from the first component.** Not retrofitted.
5. **Every animation respects `prefers-reduced-motion`.**
