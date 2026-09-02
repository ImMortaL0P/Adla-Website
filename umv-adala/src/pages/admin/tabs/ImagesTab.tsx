import { API_URL } from "@/lib/api";
import { useState, useEffect } from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';

export default function ImagesTab() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('gallery'); // system or gallery
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/images`);
      const data = await res.json();
      setImages(data);
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
      const res = await fetch(`${API_URL}/api/images/${id}`, {
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
    if (!key || !file || !label) return alert('Key, Label, and File are required');

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('key', key);
    formData.append('label', label);
    formData.append('category', category);
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/images`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('Image uploaded successfully!');
        setKey(''); setLabel(''); setFile(null);
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

  if (loading) return <div className="py-8 text-center">Loading images...</div>;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {/* Upload Form */}
      <div className="col-span-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm h-fit">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
          <ImageIcon size={20} /> Upload Image
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Category</label>
            <select value={category} onChange={e => { setCategory(e.target.value); setKey(''); }} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]">
              <option value="gallery">Gallery Image</option>
              <option value="system">System (Landing, About, etc.)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Unique Key *</label>
            {category === 'system' ? (
              <select required value={key} onChange={e => setKey(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]">
                <option value="">-- Select System Image to Replace --</option>
                <option value="hero_bg">Landing Page Background (hero_bg)</option>
                <option value="about_bg">About Page Background (about_bg)</option>
                <option value="logo_main">Main Logo (logo_main)</option>
                <option value="logo_footer">Footer Logo (logo_footer)</option>
                <option value="headmaster_photo">Headmaster Photo (headmaster_photo)</option>
              </select>
            ) : (
              <input type="text" required value={key} onChange={e => setKey(e.target.value)} placeholder="e.g., annual_function_2024" className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]" />
            )}
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
              {category === 'system' 
                ? "Select which core website image you want to replace. Uploading will override the current one." 
                : "Give this gallery image a unique identifier."}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Label / Caption *</label>
            <input type="text" required value={label} onChange={e => setLabel(e.target.value)} placeholder={category === 'system' ? 'e.g., New Landing Background' : 'e.g., Annual Function Dance'} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Image File *</label>
            <input type="file" required accept="image/*" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-[hsl(var(--muted-foreground))] file:mr-4 file:rounded-md file:border-0 file:bg-[hsl(var(--primary-strong))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary))]" />
          </div>
          <button type="submit" disabled={uploading} className="w-full rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-white hover:bg-[hsl(var(--primary))] disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      {/* Images List */}
      <div className="col-span-1 md:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">Manage Images</h3>
        {images.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">No images found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map(image => (
              <div key={image.id} className="relative group overflow-hidden rounded-lg border border-[hsl(var(--border))]">
                <img src={image.url} alt={image.label} className="h-32 w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-between items-start">
                    <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-md max-w-[80%] truncate">
                      {image.key}
                    </span>
                    <button onClick={() => handleDelete(image.id)} className="text-red-400 hover:text-red-300 bg-black/80 p-1.5 rounded-md" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span className="text-white text-xs font-medium truncate">{image.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
