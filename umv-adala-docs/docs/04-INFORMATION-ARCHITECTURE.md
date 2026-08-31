# 04 — Information Architecture

## 1. Route map

| Route | Page | Phase | Notes |
|---|---|---|---|
| `/` | Home | 1 (hero) / 2 (rest) | |
| `/about` | About the school | 2 | History, vision, timeline |
| `/about/principal` | Principal's message | 2 | Portrait + letter |
| `/about/infrastructure` | Facilities | 2 | Building, labs, library, grounds |
| `/academics` | Academics overview | 2 | Links to the four stages |
| `/academics/primary` | Class 1–5 | 2 | |
| `/academics/middle` | Class 6–8 | 2 | |
| `/academics/secondary` | Class 9–10 | 2 | |
| `/academics/senior` | Class 11–12 | 2 | Science / Commerce / Arts streams |
| `/staff` | Staff directory | 2 | Filter + search |
| `/staff/:slug` | Staff profile | 2 | |
| `/gallery` | Photo gallery | 2 | Category filters, lightbox |
| `/notices` | Notices & circulars | 2 | Filter by type and year |
| `/notices/:slug` | Single notice | 2 | |
| `/results` | Results & examinations | 4 | Year selector, toppers, trend chart |
| `/admission` | Admission | 2 | Process, documents, enquiry form |
| `/downloads` | Downloads | 4 | Forms, syllabus, timetables |
| `/contact` | Contact | 2 | Map, form, office hours |
| `/mandatory-disclosure` | Statutory disclosure | 2 | Government requirement |
| `/admin/login` | Admin login | 4 | |
| `/admin` | Admin dashboard | 4 | Auth-gated |
| `/admin/:entity` | Admin CRUD screens | 4 | notices, staff, gallery, results, downloads, enquiries |
| `*` | 404 | 1 | Styled, bilingual, with helpful links |

Every public route needs its own `<title>`, meta description, canonical URL, and Open Graph tags.

## 2. Navigation

**Primary nav (desktop):** About · Academics · Staff · Gallery · Notices · Results · Admission · Contact

About and Academics are dropdowns containing their sub-pages. Downloads and Mandatory Disclosure live in the footer only — they are needed, but not often enough to spend primary nav space on.

**Mobile:** a slide-in sheet with staggered item reveal, expandable sections for About and Academics, and the theme and language toggles at the bottom where a thumb reaches. Focus is trapped while open; Escape closes; focus returns to the trigger.

**Header, always visible:** crest + school name in both scripts, theme toggle, language toggle (`EN | हिं`). Transparent over the hero, gaining a blurred background and hairline border on scroll. Scroll-progress bar pinned beneath.

**Footer, three columns:** school identity with address and coordinates; quick links including Downloads and Mandatory Disclosure; contact block with phone, email and office hours. Below a hairline: Government of Bihar / Department of Education attribution and copyright.

## 3. Page contents

### Home
In order:
1. Hero — school name both scripts, one-line positioning statement, two CTAs (Admission Enquiry / Explore Academics), CSS-only pastel gradient-mesh background, scroll cue
2. Notices ticker — marquee, pauses on hover and focus, links to `/notices`
3. At a glance — four `<CountUp>` stats (classes, teachers, students, established), clearly labelled as placeholder until real figures arrive
4. About preview — two columns, image + text, both revealing
5. Academics grid — four stage cards, staggered, hover lift
6. Facilities strip — icon tiles: library, science lab, computer lab, playground, mid-day meal, drinking water, toilets, boundary wall
7. Principal's message excerpt — portrait placeholder, pull-quote
8. Gallery preview — six-image masonry teaser
9. Admission CTA band — full-width accent panel
10. Location — map + address block

### About
History, vision and mission, school timings, management structure, board affiliation, and an animated milestone timeline (vertical on mobile, alternating on desktop, each node revealing on scroll).

### Academics
Overview page plus four stage sub-pages. Each stage covers: subjects offered, weekly period structure, medium of instruction (Hindi medium, with English as a subject), assessment pattern. Senior secondary adds stream cards with subject combinations. Subject lists use real `<table>` markup with proper headers, not divs.

### Staff
Directory with filter chips — Primary, Maths & Science, Languages, Social Science, Administration, Support Staff — and a search box. Cards show initials-avatar placeholder, name, designation, subject, qualification. Filtering animates via opacity and transform with stable DOM order; no layout thrash. Individual profiles at `/staff/:slug`.

### Gallery
Category filters: Campus, Classrooms, Events, Sports, Annual Function, Independence Day. Masonry layout, lazy loading with blur-up placeholders. Lightbox with focus trap, arrow-key navigation, Escape to close, focus restored to the trigger, and captions in the active language.

### Notices
List with type badges (Circular, Notice, Event, Holiday, Result), date, and bilingual titles. Filters by type and year. "New" badge for items under 14 days old. Individual notice pages with optional attachment download.

### Admission
Numbered process steps revealing on scroll; eligibility by class; required-documents checklist; fee structure table stating plainly that this is a government school and most fees do not apply; important dates; FAQ accordion; enquiry form. The form validates with zod, and in Phase 2 opens a prefilled WhatsApp message with a `mailto:` fallback. Phase 3 wires it to Supabase.

### Contact
Address, phone, email, office hours, embedded map centred on 25.508267, 84.918096 with a "Get directions" link, and a general contact form.

### Mandatory disclosure
The statutory table government schools publish: school details, UDISE code, management, land and building, classroom count, staff counts, facilities. All placeholders, clearly marked as pending.

### Results (Phase 4)
Year selector; board result summary cards for Class 10 and 12 with `<CountUp>`; pass-percentage trend chart (Recharts, token-themed, with a screen-reader data table alternative); toppers wall; exam timetable downloads; a well-written empty state for when nothing is published yet.

**Consent requirement:** student names and photographs are published only with consent. This is noted in the code and in the content guide.

## 4. Content inventory to prepare

Everything below is currently placeholder and needs real values from the school:

- Principal's name, photograph, and message
- Full staff list — name, designation, subject, qualification, photograph
- School history and year of establishment
- UDISE code and board affiliation details
- Student enrolment figures by stage
- Campus and event photographs
- Current notices and circulars
- Board results for recent years
- Contact phone, email, and office hours
- Mandatory disclosure figures — land area, classroom count, facilities
