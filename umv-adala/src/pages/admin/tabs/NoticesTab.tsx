import { API_URL } from "@/lib/api";
import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function NoticesTab() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [type, setType] = useState('notice');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notices`);
      const data = await res.json();
      setNotices(data);
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
    if (file) formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/notices`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('Notice uploaded successfully!');
        setTitleEn(''); setTitleHi(''); setType('notice'); setFile(null);
        fetchNotices();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to upload notice');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading notice');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="py-8 text-center">Loading notices...</div>;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {/* Upload Form */}
      <div className="col-span-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm h-fit">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
          <Plus size={20} /> Upload New Notice
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
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]">
              <option value="notice">Notice</option>
              <option value="circular">Circular</option>
              <option value="order">Order</option>
              <option value="tender">Tender</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Document File (PDF, etc)</label>
            <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-[hsl(var(--muted-foreground))] file:mr-4 file:rounded-md file:border-0 file:bg-[hsl(var(--primary-strong))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary))]" />
          </div>
          <button type="submit" disabled={uploading} className="w-full rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-white hover:bg-[hsl(var(--primary))] disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Publish Notice'}
          </button>
        </form>
      </div>

      {/* Notices List */}
      <div className="col-span-1 md:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">Manage Notices</h3>
        {notices.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">No notices found.</p>
        ) : (
          <ul className="space-y-3">
            {notices.map(notice => (
              <li key={notice.id} className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] p-4">
                <div>
                  <h4 className="font-medium text-[hsl(var(--foreground))]">{notice.title_en}</h4>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {new Date(notice.published_at).toLocaleDateString()} · {notice.type.toUpperCase()}
                  </p>
                  {notice.attachment_url && (
                    <a href={notice.attachment_url} target="_blank" rel="noreferrer" className="text-xs text-[hsl(var(--primary-strong))] hover:underline">
                      View Attachment
                    </a>
                  )}
                </div>
                <button onClick={() => handleDelete(notice.id)} className="text-red-500 hover:text-red-700" title="Delete Notice">
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
