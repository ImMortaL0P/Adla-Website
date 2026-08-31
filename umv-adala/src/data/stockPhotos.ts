/**
 * Open-licence stock photography, sourced from Wikimedia Commons.
 *
 * These are generic illustrative images — NOT photographs of UMV Adala,
 * its actual students, or its actual staff. Every place these are used
 * must show the "illustrative photo" disclaimer (see <StockPhoto>) so a
 * visitor cannot mistake them for real photos of this school (DEV.md §2).
 *
 * Licence terms require attribution; credits are listed here and
 * surfaced via CONTENT-GUIDE.md / the image title attribute.
 */

export interface StockPhoto {
  src: string
  width: number
  height: number
  alt: { en: string; hi: string }
  credit: string
  license: string
  licenseUrl: string
  sourceUrl: string
}

export const stockPhotos = {
  campusEntrance: {
    src: '/images/stock/campus-entrance.jpg',
    width: 1200,
    height: 540,
    alt: {
      en: 'Entrance of a government school building in Punjab (illustrative — not UMV Adala)',
      hi: 'पंजाब में एक सरकारी विद्यालय भवन का प्रवेश द्वार (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'Stalinjeet Brar',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Entrance_of_Government_High_School_Tehna_(Faridkot).jpg',
  },
  campusVillageSchool: {
    src: '/images/stock/campus-village-school.jpg',
    width: 1200,
    height: 900,
    alt: {
      en: 'A village school campus in Kerala (illustrative — not UMV Adala)',
      hi: 'केरल में एक ग्राम विद्यालय परिसर (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'Fabrice Florin',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:A_children_village_school_in_Kovalam_Kerala_India.jpg',
  },
  classroomKerala: {
    src: '/images/stock/classroom-kerala.jpg',
    width: 1200,
    height: 675,
    alt: {
      en: 'A classroom in a government primary school in Kerala (illustrative — not UMV Adala)',
      hi: 'केरल के एक सरकारी प्राथमिक विद्यालय की कक्षा (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'Ramjchandran',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:A_Classroom_in_a_Government_Primary_school_in_Kerala.jpg',
  },
  classroomTamilNadu: {
    src: '/images/stock/classroom-tamilnadu.jpg',
    width: 1200,
    height: 900,
    alt: {
      en: 'School children in a classroom in Tamil Nadu (illustrative — not UMV Adala)',
      hi: 'तमिलनाडु में एक कक्षा में विद्यालय के बच्चे (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'McKay Savage',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tamil_Nadu_school_kids.jpg',
  },
  sportsChildrenPlaying: {
    src: '/images/stock/sports-children-playing.jpg',
    width: 945,
    height: 1200,
    alt: {
      en: 'Children playing together in India (illustrative — not UMV Adala)',
      hi: 'भारत में साथ खेलते बच्चे (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'Sukanto Debnath',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:(1)_Children_playing_with_each_other_in_India.jpg',
  },
  annualFunctionDance: {
    src: '/images/stock/annual-function-dance.jpg',
    width: 1200,
    height: 803,
    alt: {
      en: 'Students performing a group dance at a school cultural festival in Kerala (illustrative — not UMV Adala)',
      hi: 'केरल में एक विद्यालय सांस्कृतिक उत्सव में समूह नृत्य प्रस्तुत करते विद्यार्थी (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'Krish9',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Group_Dance_at_54th_Kerala_School_Kalolsavam_2014_at_Palakkad..JPG',
  },
  independenceDay: {
    src: '/images/stock/independence-day.jpg',
    width: 1200,
    height: 900,
    alt: {
      en: 'Students celebrating Independence Day at a school in Kolkata (illustrative — not UMV Adala)',
      hi: 'कोलकाता के एक विद्यालय में स्वतंत्रता दिवस मनाते विद्यार्थी (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'Keiran Diksa',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:BRKM_Independence_day_2019.jpg',
  },
  facilityMidDayMeal: {
    src: '/images/stock/facility-midday-meal.jpg',
    width: 1200,
    height: 900,
    alt: {
      en: 'Children at a rural school being served a mid-day meal in Uttar Pradesh (illustrative — not UMV Adala)',
      hi: 'उत्तर प्रदेश के एक ग्रामीण विद्यालय में मध्याह्न भोजन करते बच्चे (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'Ajay Tallam',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Children_at_a_rural_school_provided_with_lunch_Uttar_Pradesh_India.jpg',
  },
  facilityComputerLab: {
    src: '/images/stock/facility-computer-lab.jpg',
    width: 1200,
    height: 676,
    alt: {
      en: 'A school computer lab (illustrative — not UMV Adala)',
      hi: 'एक विद्यालय कंप्यूटर प्रयोगशाला (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'HazelGHC',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:School_Computer_Lab.jpg',
  },
  eventClassroomKids: {
    src: '/images/stock/event-classroom-kids.jpg',
    width: 1200,
    height: 675,
    alt: {
      en: 'School children in a classroom in India (illustrative — not UMV Adala)',
      hi: 'भारत में एक कक्षा में विद्यालय के बच्चे (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
  eventSchoolUniformWalk: {
    src: '/images/stock/event-school-uniform-walk.jpg',
    width: 1200,
    height: 740,
    alt: {
      en: 'School children walking together in uniform in India (illustrative — not UMV Adala)',
      hi: 'भारत में विद्यालय की वर्दी में साथ चलते बच्चे (उदाहरणात्मक — यह UMV अदला नहीं है)',
    },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
} as const satisfies Record<string, StockPhoto>

export type StockPhotoKey = keyof typeof stockPhotos

/**
 * Generic illustrative staff/person portraits — used only as optional
 * photo_url values in data/staff.ts. Always shown with the same
 * "illustrative photo" disclaimer via <StockPhoto>. None are photos of
 * real UMV Adala staff. A few roles (Principal, support staff) were left
 * without a photo because no appropriately dignified/plain candidate was
 * found — they keep the initials placeholder tile instead.
 */
export const staffPortraits = {
  principal: {
    src: '/images/staff/staff-principal.jpg',
    width: 320,
    height: 480,
    alt: { en: 'Illustrative staff portrait', hi: 'उदाहरणात्मक स्टाफ चित्र' },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
  maths: {
    src: '/images/staff/staff-maths.jpg',
    width: 480,
    height: 328,
    alt: { en: 'Illustrative staff portrait', hi: 'उदाहरणात्मक स्टाफ चित्र' },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
  science: {
    src: '/images/staff/staff-science.jpg',
    width: 319,
    height: 480,
    alt: { en: 'Illustrative staff portrait', hi: 'उदाहरणात्मक स्टाफ चित्र' },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
  hindi: {
    src: '/images/staff/staff-hindi.jpg',
    width: 480,
    height: 480,
    alt: { en: 'Illustrative staff portrait', hi: 'उदाहरणात्मक स्टाफ चित्र' },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
  english: {
    src: '/images/staff/staff-english.jpg',
    width: 320,
    height: 480,
    alt: { en: 'Illustrative staff portrait', hi: 'उदाहरणात्मक स्टाफ चित्र' },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
  social: {
    src: '/images/staff/staff-social.jpg',
    width: 320,
    height: 480,
    alt: { en: 'Illustrative staff portrait', hi: 'उदाहरणात्मक स्टाफ चित्र' },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
  primary1: {
    src: '/images/staff/staff-primary1.jpg',
    width: 384,
    height: 480,
    alt: { en: 'Illustrative staff portrait', hi: 'उदाहरणात्मक स्टाफ चित्र' },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
  primary2: {
    src: '/images/staff/staff-primary2.jpg',
    width: 480,
    height: 269,
    alt: { en: 'Illustrative staff portrait', hi: 'उदाहरणात्मक स्टाफ चित्र' },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
  clerk: {
    src: '/images/staff/staff-clerk.jpg',
    width: 342,
    height: 480,
    alt: { en: 'Illustrative staff portrait', hi: 'उदाहरणात्मक स्टाफ चित्र' },
    credit: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    sourceUrl: 'https://pixabay.com/',
  },
} as const satisfies Record<string, StockPhoto>

export type StaffPortraitKey = keyof typeof staffPortraits

/** Looks up full stock-photo metadata (for <StockPhoto>) by its src path, e.g. a Staff.photo_url. */
export function findStaffPortraitBySrc(src: string | null): StockPhoto | undefined {
  if (!src) return undefined
  return Object.values(staffPortraits).find((p) => p.src === src)
}
