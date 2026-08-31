import type { Notice } from '@/types/domain'

// PLACEHOLDER NOTICES — TODO: replace with real notices from the school office.
const now = Date.now()
const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString()

export const staticNotices: Notice[] = [
  {
    id: 'notice-1',
    slug: 'admission-notice-placeholder',
    title_en: 'Admission Open for New Session — Placeholder',
    title_hi: 'नए सत्र के लिए प्रवेश प्रारंभ — प्लेसहोल्डर',
    body_en: 'This is a placeholder notice. Real notices will be published here by the school office once available.',
    body_hi: 'यह एक प्लेसहोल्डर सूचना है। वास्तविक सूचनाएँ उपलब्ध होने पर विद्यालय कार्यालय द्वारा यहाँ प्रकाशित की जाएँगी।',
    type: 'notice',
    attachment_url: null,
    published_at: daysAgo(2),
    is_published: true,
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
  {
    id: 'notice-2',
    slug: 'holiday-circular-placeholder',
    title_en: 'Holiday Circular — Placeholder',
    title_hi: 'अवकाश परिपत्र — प्लेसहोल्डर',
    body_en: 'This is a placeholder circular regarding an upcoming holiday. Exact dates will be updated by the school.',
    body_hi: 'यह आगामी अवकाश से संबंधित एक प्लेसहोल्डर परिपत्र है। सटीक तिथियाँ विद्यालय द्वारा अद्यतन की जाएँगी।',
    type: 'circular',
    attachment_url: null,
    published_at: daysAgo(6),
    is_published: true,
    created_at: daysAgo(6),
    updated_at: daysAgo(6),
  },
  {
    id: 'notice-3',
    slug: 'annual-function-event-placeholder',
    title_en: 'Annual Function — Placeholder',
    title_hi: 'वार्षिक समारोह — प्लेसहोल्डर',
    body_en: 'This is a placeholder event notice for the school’s Annual Function. Date, time and venue will be announced here.',
    body_hi: 'यह विद्यालय के वार्षिक समारोह हेतु एक प्लेसहोल्डर सूचना है। तिथि, समय एवं स्थान की घोषणा यहाँ की जाएगी।',
    type: 'event',
    attachment_url: null,
    published_at: daysAgo(20),
    is_published: true,
    created_at: daysAgo(20),
    updated_at: daysAgo(20),
  },
  {
    id: 'notice-4',
    slug: 'result-declared-placeholder',
    title_en: 'Result Declared — Placeholder',
    title_hi: 'परिणाम घोषित — प्लेसहोल्डर',
    body_en: 'This is a placeholder notice announcing a result. Actual results are published on the Results page once available.',
    body_hi: 'यह परिणाम की घोषणा हेतु एक प्लेसहोल्डर सूचना है। वास्तविक परिणाम उपलब्ध होने पर परिणाम पृष्ठ पर प्रकाशित किए जाते हैं।',
    type: 'result',
    attachment_url: null,
    published_at: daysAgo(45),
    is_published: true,
    created_at: daysAgo(45),
    updated_at: daysAgo(45),
  },
]
