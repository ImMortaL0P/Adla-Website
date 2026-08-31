# 00 — Project Brief

## The school

| Field | Value |
|---|---|
| Name (English) | Utkramit Madhya Vidyalaya Adala |
| Short name | UMV Adala |
| Name (Hindi) | उत्क्रमित मध्य विद्यालय अदला |
| Type | Bihar Government School |
| Classes | 1 to 12 |
| Address | Adla, Naubatpur, Patna District, Bihar — 809011 |
| Locality | Sarasat, Naubatpur block |
| Coordinates | 25.508267, 84.918096 |
| Managed by | Department of Education, Government of Bihar |

Everything above is verified and used verbatim throughout the build. Everything else about the school — principal, staff, enrolment, UDISE code, results, photographs — is currently unknown and appears as marked placeholder.

## What we are building

A complete public website for the school: identity and history, academics across all twelve classes, staff directory, photo gallery, notices and circulars, examination results, admission information with an enquiry form, downloads, contact, and the statutory mandatory-disclosure page. Behind it, an admin panel so school staff can update content themselves without a developer.

The site is bilingual (Hindi and English), themed (light and dark, both in muted pastels), and animated with restrained scroll interactions.

## Who it is for

Two audiences with almost opposite conditions, and the tension between them drives most technical decisions.

**Parents and community members.** Overwhelmingly on low-end Android phones over intermittent 4G, many reading Hindi in preference to English, some with limited comfort navigating websites. They want three things quickly: is there a notice, when is admission, how do I reach the school. For them the site must be light, legible at arm's length, and forgiving.

**Education department officials and prospective staff.** On desktop, on reliable connections, wanting the formal record — mandatory disclosure, results, infrastructure, staff strength. For them the site must be complete and credible.

The design consequence: **content before decoration, always.** A parent must be able to read a notice before a single animation has finished. Animation accompanies the arrival of content; it never gates it.

## What "good" looks like here

This is a village government school, not a startup. The visual register should be **warm, dignified, cared-for** — the feeling that someone maintains this place. Not corporate SaaS gradients, not primary-colour preschool clip art, not the dense blue-and-orange tables that most Indian government school sites default to.

The palette answer is muted pastel: chalk paper, dusty marigold, sage, soft sky. Restraint reads as seriousness.

## Hard constraints

1. **The site must render completely with the backend switched off.** Supabase free-tier projects pause after inactivity. A school website that goes blank because a database slept is a worse failure than slightly stale notices. Static data files are a permanent fallback layer.

2. **No fabricated content.** No invented UDISE number, no made-up exam statistics, no stock photographs of other schools or unrelated children presented as this school. A real institution's website carrying fabricated records is a genuine problem, not a styling shortcut. Placeholders must look unmistakably like placeholders.

3. **Student privacy.** Any page publishing student names or photographs — the toppers wall in particular — carries a consent requirement documented in the code and in the content guide. Admission enquiry submissions contain parents' phone numbers and must never be publicly readable.

4. **Maintainable by someone with limited technical support.** The person updating this site in two years may be a teacher with a phone. Content structure and documentation favour clarity over cleverness throughout.

5. **Performance budget.** Under 200 KB gzipped initial JavaScript. Lighthouse mobile performance ≥ 90. This is not a vanity metric; it is the difference between a parent seeing the notice and giving up.

## Out of scope for this build

- Student/parent login portal with attendance, marks and fee status. Deliberately excluded — it needs real student data, role management, and an operational commitment the school has not made. Revisit as a separate project.
- Online fee payment.
- SMS notification integration.
- Native mobile app.

## Success criteria

The build is done when all five phases have passed their acceptance checks, Lighthouse mobile scores ≥ 90 performance and ≥ 95 accessibility, every page is correct across light/dark × English/Hindi, the site works with Supabase disabled, and the row-level security policies have been verified by attempting unauthorised reads.
