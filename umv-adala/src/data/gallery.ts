import type { GalleryImage } from '@/types/domain'
import type { StockPhotoKey } from '@/data/stockPhotos'

// GALLERY DATA — a mix of licensed illustrative stock photos (see
// stockPhotos.ts, always shown with an "illustrative photo" disclaimer)
// and solid-colour placeholder tiles where no suitable open photo was
// sourced. None of these are real photographs of UMV Adla — TODO:
// replace every entry with real school photographs when available.
const captions: Record<GalleryImage['category'], { en: string; hi: string }> = {
  campus: { en: 'Campus view — photo to be added', hi: 'परिसर दृश्य — फोटो जोड़ी जाएगी' },
  classrooms: { en: 'Classroom — photo to be added', hi: 'कक्षा-कक्ष — फोटो जोड़ी जाएगी' },
  events: { en: 'School event — photo to be added', hi: 'विद्यालय कार्यक्रम — फोटो जोड़ी जाएगी' },
  sports: { en: 'Sports day — photo to be added', hi: 'खेल दिवस — फोटो जोड़ी जाएगी' },
  annual_function: { en: 'Annual function — photo to be added', hi: 'वार्षिक समारोह — फोटो जोड़ी जाएगी' },
  independence_day: { en: 'Independence Day — photo to be added', hi: 'स्वतंत्रता दिवस — फोटो जोड़ी जाएगी' },
}

// category -> stock photo keys to use for the first N entries (rest fall back to placeholder tiles)
const stockAssignments: Partial<Record<GalleryImage['category'], StockPhotoKey[]>> = {
  campus: ['campusEntrance', 'campusVillageSchool'],
  classrooms: ['classroomKerala', 'classroomTamilNadu'],
  events: ['eventClassroomKids', 'eventSchoolUniformWalk'],
  sports: ['sportsChildrenPlaying'],
  annual_function: ['annualFunctionDance'],
  independence_day: ['independenceDay'],
}

const categories: GalleryImage['category'][] = [
  'campus',
  'classrooms',
  'events',
  'sports',
  'annual_function',
  'independence_day',
]

// Only as many tiles as have a real stock photo assigned — an empty
// "photo to be added" placeholder tile reads as a broken image, so a
// category with one licensed photo gets one tile, not two.
export const staticGallery: GalleryImage[] = categories.flatMap((category, catIndex) => {
  const count = stockAssignments[category]?.length ?? 1
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1
    return {
      id: `gallery-${category}-${n}`,
      image_url: '',
      thumbnail_url: null,
      caption_en: captions[category].en,
      caption_hi: captions[category].hi,
      category,
      taken_on: null,
      display_order: catIndex * 2 + n,
      is_published: true,
      created_at: new Date().toISOString(),
    }
  })
})

/** Maps a gallery image id to a licensed stock photo, when one is assigned. */
export const staticGalleryStock: Partial<Record<string, StockPhotoKey>> = Object.fromEntries(
  categories.flatMap((category) =>
    (stockAssignments[category] ?? []).map((key, i) => [`gallery-${category}-${i + 1}`, key])
  )
)
