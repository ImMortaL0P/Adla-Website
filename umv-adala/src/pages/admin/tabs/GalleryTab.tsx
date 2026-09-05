import { API_URL, resolveMediaUrl } from "@/lib/api";
import { useState, useEffect } from 'react';
import { Trash2, Image as ImageIcon, Upload, Calendar } from 'lucide-react';
import { GALLERY_CATEGORIES } from '@/hooks/useGallery';

export default function GalleryTab() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [category, setCategory] = useState<string>('campus');
  const [captionEn, setCaptionEn] = useState('');
  const [captionHi, setCaptionHi] = useState('');
  const [eventNameEn, setEventNameEn] = useState('');
  const [eventNameHi, setEventNameHi] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescriptionEn, setEventDescriptionEn] = useState('');
  const [eventDescriptionHi, setEventDescriptionHi] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gallery`);
      const data = await res.json();
      setImages(data.map((img: any) => ({
        ...img,
        image_url: resolveMediaUrl(img.image_url),
        thumbnail_url: resolveMediaUrl(img.thumbnail_url),
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchImages();
      else alert('Failed to delete image');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captionEn || !file) return alert('English caption and image file are required');

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('caption_en', captionEn);
    formData.append('caption_hi', captionHi);
    formData.append('category', category);
    formData.append('file', file);

    // Add event metadata if provided
    if (eventNameEn) formData.append('event_name_en', eventNameEn);
    if (eventNameHi) formData.append('event_name_hi', eventNameHi);
    if (eventDate) formData.append('event_date', new Date(eventDate).toISOString());
    if (eventDescriptionEn) formData.append('event_description_en', eventDescriptionEn);
    if (eventDescriptionHi) formData.append('event_description_hi', eventDescriptionHi);

    try {
      const res = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('Image uploaded successfully!');
        // Reset form
        setCaptionEn(''); setCaptionHi('');
        setEventNameEn(''); setEventNameHi('');
        setEventDate(''); setEventDescriptionEn(''); setEventDescriptionHi('');
        setFile(null);
        fetchImages();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="py-8 text-center">Loading gallery...</div>;

  // Group images by event or category
  const groupedImages = images.reduce((acc, img) => {
    const groupKey = img.event_name_en || img.category;
    if (!acc[groupKey]) {
      acc[groupKey] = {
        name: img.event_name_en || img.category,
        date: img.event_date,
        images: []
      };
    }
    acc[groupKey].images.push(img);
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Upload Form */}
      <div className="col-span-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm h-fit">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
          <Upload size={20} /> Upload Gallery Image
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Category *</label>
            <select
              required
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
            >
              {GALLERY_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-[hsl(var(--border))] pt-4">
            <p className="mb-3 text-sm font-semibold text-[hsl(var(--foreground))]">Event Details (Optional)</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))]">Event Name (English)</label>
                <input
                  type="text"
                  value={eventNameEn}
                  onChange={e => setEventNameEn(e.target.value)}
                  placeholder="e.g., Annual Sports Day 2024"
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))]">Event Name (Hindi)</label>
                <input
                  type="text"
                  value={eventNameHi}
                  onChange={e => setEventNameHi(e.target.value)}
                  placeholder="वार्षिक खेल दिवस 2024"
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))]"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  <Calendar size={14} /> Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))]">Event Description (English)</label>
                <textarea
                  value={eventDescriptionEn}
                  onChange={e => setEventDescriptionEn(e.target.value)}
                  rows={2}
                  placeholder="Brief description of the event..."
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))]">Event Description (Hindi)</label>
                <textarea
                  value={eventDescriptionHi}
                  onChange={e => setEventDescriptionHi(e.target.value)}
                  rows={2}
                  placeholder="कार्यक्रम का संक्षिप्त विवरण..."
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))]"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[hsl(var(--border))] pt-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Image Caption (English) *</label>
                <input
                  type="text"
                  required
                  value={captionEn}
                  onChange={e => setCaptionEn(e.target.value)}
                  placeholder="e.g., Students receiving medals"
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Image Caption (Hindi)</label>
                <input
                  type="text"
                  value={captionHi}
                  onChange={e => setCaptionHi(e.target.value)}
                  placeholder="छात्र पदक प्राप्त करते हुए"
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Image File *</label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 block w-full text-sm text-[hsl(var(--muted-foreground))] file:mr-4 file:rounded-md file:border-0 file:bg-[hsl(var(--primary-strong))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary))]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-white transition-colors duration-200 hover:bg-[hsl(var(--primary))] disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      {/* Images List - Grouped by Event */}
      <div className="col-span-1 lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Gallery Images</h3>
          <span className="text-sm text-[hsl(var(--muted-foreground))]">{images.length} total images</span>
        </div>

        {images.length === 0 ? (
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center">
            <ImageIcon size={32} className="mx-auto mb-3 text-[hsl(var(--muted-foreground))]" />
            <p className="text-[hsl(var(--muted-foreground))]">No gallery images yet.</p>
          </div>
        ) : (
          Object.entries(groupedImages)
            .sort(([, a]: any, [, b]: any) => {
              // Sort by date if available, otherwise alphabetically
              if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
              if (a.date) return -1;
              if (b.date) return 1;
              return a.name.localeCompare(b.name);
            })
            .map(([groupKey, group]: [string, any]) => (
              <div key={groupKey} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
                  <div>
                    <h4 className="font-semibold text-[hsl(var(--foreground))]">{group.name}</h4>
                    {group.date && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                        <Calendar size={12} />
                        {new Date(group.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1 text-xs font-medium text-[hsl(var(--foreground))]">
                    {group.images.length} {group.images.length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {group.images.map((image: any) => (
                    <div key={image.id} className="relative group overflow-hidden rounded-lg border border-[hsl(var(--border))]">
                      <img
                        src={image.thumbnail_url || image.image_url}
                        alt={image.caption_en}
                        className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="text-red-400 hover:text-red-300 bg-black/80 p-2 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-white text-xs truncate">{image.caption_en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
