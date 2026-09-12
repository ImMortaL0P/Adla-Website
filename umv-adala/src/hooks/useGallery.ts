import { useState, useEffect } from 'react'
import { API_URL, resolveMediaUrl } from '@/lib/api'
import type { GalleryImage } from '@/types/domain'

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<{value: string; label_en?: string; label_hi?: string; label?: string}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/gallery`).then(res => res.json()),
      fetch(`${API_URL}/api/gallery/categories`).then(res => res.json())
    ])
      .then(([imagesData, categoriesData]) => {
        setImages(
          (imagesData as GalleryImage[]).map((img) => ({
            ...img,
            image_url: resolveMediaUrl(img.image_url),
            thumbnail_url: resolveMediaUrl(img.thumbnail_url) || null,
          }))
        )
        setCategories(categoriesData)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return { images, categories, loading }
}

export const ACCEPTED_GALLERY_FILE_TYPES = '.jpg,.jpeg,.png,.webp,.gif'

export const GALLERY_CATEGORIES = [
  { value: 'science_math_club', label: 'Science and Math Club' },
  { value: 'eco_youth_club', label: 'Eco & Youth Club' },
  { value: 'surakshit_sanivar', label: 'Surakshit Sanivar' },
  { value: 'independance_republic_day', label: 'Independance & Republic Day' },
  { value: 'other_school_events', label: 'Other School Events' },
] as const

export const GALLERY_CATEGORY_ORDER = GALLERY_CATEGORIES.map(c => c.value)

