import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { ACCEPTED_GALLERY_FILE_TYPES, GALLERY_CATEGORIES } from '@/hooks/useGallery'

interface GalleryManagerProps {
  driveReady: boolean
}

export function GalleryManager({ driveReady }: GalleryManagerProps) {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [captionEn, setCaptionEn] = useState('')
  const [captionHi, setCaptionHi] = useState('')
  const [category, setCategory] = useState('campus')
  const [takenOn, setTakenOn] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gallery`)
      const data = await res.json()
      setImages(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this gallery image? It will also be removed from Google Drive.')) return
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) fetchImages()
      else alert('Failed to delete image')
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!captionEn || !file) return alert('English caption and image file are required')

    setUploading(true)
    const token = localStorage.getItem('adminToken')
    const formData = new FormData()
    formData.append('caption_en', captionEn)
    formData.append('caption_hi', captionHi)
    formData.append('category', category)
    if (takenOn) formData.append('taken_on', takenOn)
    formData.append('file', file)

    try {
      const res = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setCaptionEn('')
        setCaptionHi('')
        setCategory('campus')
        setTakenOn('')
        setFile(null)
        fetchImages()
      } else {
        alert(data.message || 'Failed to upload image')
      }
    } catch (err) {
      console.error(err)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading gallery...</div>

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="col-span-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm h-fit">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
          <Plus size={20} /> Upload Gallery Image
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Caption (English) *</label>
            <input
              type="text"
              required
              value={captionEn}
              onChange={(e) => setCaptionEn(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Caption (Hindi)</label>
            <input
              type="text"
              value={captionHi}
              onChange={(e) => setCaptionHi(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2"
            >
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Date taken (optional)</label>
            <input
              type="date"
              value={takenOn}
              onChange={(e) => setTakenOn(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Image (stored on Google Drive)</label>
            <input
              type="file"
              accept={ACCEPTED_GALLERY_FILE_TYPES}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[hsl(var(--primary-strong))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">JPEG, PNG, WebP, or GIF · max 8 MB</p>
          </div>
          <button
            type="submit"
            disabled={uploading || !driveReady}
            className="w-full rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-white hover:bg-[hsl(var(--primary))] disabled:opacity-50"
          >
            {uploading ? 'Uploading to Drive...' : 'Add to Gallery'}
          </button>
        </form>
      </div>

      <div className="col-span-1 md:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Manage Gallery ({images.length})</h3>
        {images.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">No gallery images yet. Upload photos from the form.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <li key={image.id} className="overflow-hidden rounded-lg border border-[hsl(var(--border))]">
                <img
                  src={image.thumbnail_url || image.image_url}
                  alt={image.caption_en}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
                <div className="flex items-start justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{image.caption_en}</p>
                    <p className="text-xs capitalize text-[hsl(var(--muted-foreground))]">{image.category.replace('_', ' ')}</p>
                  </div>
                  <button onClick={() => handleDelete(image.id)} className="shrink-0 text-red-500 hover:text-red-700" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
