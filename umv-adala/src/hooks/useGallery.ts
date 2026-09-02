import { useState, useEffect } from 'react'
import { API_URL } from '@/lib/api'
import type { GalleryImage } from '@/types/domain'

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return { images, loading }
}

export const ACCEPTED_GALLERY_FILE_TYPES = '.jpg,.jpeg,.png,.webp,.gif'

export const GALLERY_CATEGORIES = [
  { value: 'campus', label: 'Campus' },
  { value: 'classrooms', label: 'Classrooms' },
  { value: 'events', label: 'Events' },
  { value: 'sports', label: 'Sports' },
  { value: 'annual_function', label: 'Annual Function' },
  { value: 'independence_day', label: 'Independence Day' },
] as const
