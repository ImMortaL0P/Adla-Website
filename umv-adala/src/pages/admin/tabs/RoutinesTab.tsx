import { Loader } from '@/components/common/Loader';
import { API_URL } from "@/lib/api";
import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function RoutinesTab() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [type] = useState('routine');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notices`);
      const data = await res.json();
      setNotices(data.filter((n: any) => n.type === "routine" || (n.title_en || "").toLowerCase().includes("routine") || (n.title_en || "").toLowerCase().includes("timetable") || (n.title_en || "").toLowerCase().includes("time table")));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/notices/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchNotices();
      else alert('Failed to delete notice');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn) return alert('English title is required');

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('title_en', titleEn);
    formData.append('title_hi', titleHi);
    formData.append('type', type);
    if (category) formData.append('category', category);
    if (file) formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/notices`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('Routine uploaded successfully!');
        setTitleEn(''); setTitleHi(''); setCategory(''); setFile(null);
        fetchNotices();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to upload routine');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading routine');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="py-8 flex justify-center"><Loader text="Loading notices..." /></div>;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {/* Upload Form */}
      <div className="col-span-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm h-fit">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
          <Plus size={20} /> Upload New Routine/Timetable
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Title (English) *</label>
            <input type="text" required value={titleEn} onChange={e => setTitleEn(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Title (Hindi)</label>
            <input type="text" value={titleHi} onChange={e => setTitleHi(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]" />
          </div>
          
          
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Category (e.g. Class 10, IX-A)</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="E.g. Class 12 Science" className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]" />
            </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Document File (PDF, etc)</label>
            <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-[hsl(var(--muted-foreground))] file:mr-4 file:rounded-md file:border-0 file:bg-[hsl(var(--primary-strong))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary))]" />
          </div>
          <button type="submit" disabled={uploading} className="w-full rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-white hover:bg-[hsl(var(--primary))] disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Publish Routine'}
          </button>
        </form>
      </div>

      {/* Notices List */}
      <div className="col-span-1 md:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">Manage Routines</h3>
        {notices.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">No notices found.</p>
        ) : (
          <ul className="space-y-3">
            {notices.map(notice => (
              <li key={notice.id} className="flex items-center justify-between gap-4 rounded-lg border border-[hsl(var(--border))] p-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-[hsl(var(--foreground))] truncate whitespace-normal">{notice.title_en}</h4>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                    {new Date(notice.published_at).toLocaleDateString()} · {notice.type.toUpperCase()}{notice.category ? ` · ${notice.category}` : ""}
                  </p>
                  {notice.attachment_url && (
                    <a href={notice.attachment_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-[hsl(var(--primary-strong))] hover:underline">
                      View Attachment
                    </a>
                  )}
                </div>
                <button type="button" onClick={() => handleDelete(notice.id)} className="shrink-0 p-3 -mr-2 -mt-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 focus:outline-none touch-manipulation" title="Delete Notice">
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
