# 07 — Content Guide / सामग्री मार्गदर्शिका

*For school staff. No coding knowledge needed.*
*विद्यालय कर्मचारियों के लिए। कोडिंग की जानकारी आवश्यक नहीं।*

This is the template for the `CONTENT-GUIDE.md` that ships at the repository root. Complete it with the real admin URL once the site is deployed.

---

## What needs real information

The website is built and working, but some information is still placeholder — it shows as `XXXXX` or "to be updated". Replace each item below.

वेबसाइट तैयार है, लेकिन कुछ जानकारी अभी अस्थायी है। नीचे दी गई सूची के अनुसार असली जानकारी भरें।

| Item / विवरण | Where / कहाँ | Priority |
|---|---|---|
| Principal's name, photo, message | Admin → Staff, and `src/data/school.ts` | High |
| Full staff list | Admin → Staff | High |
| Phone number and email | `src/data/school.ts` | High |
| UDISE code | `src/data/school.ts` | High |
| Year established, school history | `src/data/school.ts` | Medium |
| Student enrolment numbers | `src/data/school.ts` | Medium |
| Campus and event photographs | Admin → Gallery | Medium |
| Board results (Class 10 and 12) | Admin → Results | Medium |
| Office hours | `src/data/school.ts` | Medium |
| Mandatory disclosure figures | `src/data/school.ts` | Low but required |

Items marked "Admin" are edited through the website itself. Items marked `src/data/school.ts` need a developer — send them the list.

---

## Using the admin panel

Go to **[your-site-url]/admin** and sign in with the email and password you were given. It works on a phone.

**[आपकी-वेबसाइट]/admin** पर जाएँ और अपना ईमेल और पासवर्ड डालें। यह मोबाइल पर भी काम करता है।

### Adding a notice / सूचना जोड़ना

1. Notices → **Add Notice**
2. Fill the English fields on the left, Hindi on the right
3. Choose the type — Circular, Notice, Event, Holiday, or Result
4. Attach a PDF if there is one
5. Turn **Published** on, then Save

If you leave the Hindi fields empty, the notice will show in English to everyone. The row will display a warning badge so you can come back and complete it.

यदि हिंदी फ़ील्ड खाली छोड़ेंगे, तो सूचना सभी को अंग्रेज़ी में दिखेगी।

### Adding staff / शिक्षक जोड़ना

Staff → Add Staff. Fill name, designation, department, subject and qualification in both languages, upload a photo, and save. Use **Display order** to control who appears first — the principal should be 1.

### Adding photographs / तस्वीरें जोड़ना

Gallery → Add Images. You can select several at once and drag to reorder. Photos taken on a phone are fine — the site shrinks them automatically. Add a caption in both languages so the photo makes sense to someone using a screen reader.

### Publishing results / परिणाम प्रकाशित करना

Results → Add Result. Enter the year, class, board, and the appeared/passed numbers. Save, then add toppers under that result.

---

## Before you publish a student's name or photograph

**Please read this. / कृपया इसे अवश्य पढ़ें।**

A student's name and photograph on this website are visible to anyone on the internet, anywhere, permanently. Search engines will copy them. They are difficult to remove completely once published.

Before adding a topper's name or photograph, get the agreement of the student's parent or guardian. Keep a written note of that agreement. The admin panel has a **consent recorded** checkbox — a student without it ticked will not appear on the website, and that is deliberate.

किसी भी विद्यार्थी का नाम या फ़ोटो वेबसाइट पर डालने से पहले उसके माता-पिता या अभिभावक की अनुमति अवश्य लें। बिना अनुमति दर्ज किए विद्यार्थी वेबसाइट पर नहीं दिखेगा।

This is not a formality. These are children, and the internet does not forget.

---

## Please do not

- **Do not** use photographs of other schools, or pictures downloaded from the internet, to fill space. An empty gallery is better than a misleading one.
- **Do not** enter a guessed UDISE code, phone number, or enrolment figure. Leave it as a placeholder until you have the real value — a wrong official number causes real problems.
- **Do not** publish results before they are officially declared.
- **Do not** share the admin password. If more people need access, ask for separate accounts.

---

## If something goes wrong

- **A change is not showing:** refresh the page. If it still does not appear, check that **Published** is switched on.
- **The site shows old notices:** this is normal for a short while, and it is deliberate — the site keeps a copy so it works even when the database is unavailable. It updates on its own.
- **You cannot sign in:** use the password reset link. If that fails, contact your developer.
- **A photograph will not upload:** it may be too large. The limit is 5 MB. Try again on a stronger connection.

---

## Contact for technical help

*[Developer name and contact — fill this in]*

Keep this document with the website login details, and pass both on to whoever takes over the site after you.
