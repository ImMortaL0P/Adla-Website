import { API_URL } from "@/lib/api";
import { useState, useEffect } from 'react';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';

export default function StaffTab() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [roleEn, setRoleEn] = useState('');
  const [roleHi, setRoleHi] = useState('');
  const [qualEn, setQualEn] = useState('');
  const [qualHi, setQualHi] = useState('');
  const [exp, setExp] = useState('');
  const [type, setType] = useState('teaching');
  const [order, setOrder] = useState('0');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_URL}/api/staff`);
      const data = await res.json();
      setStaffList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchStaff();
      else alert('Failed to delete');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !roleEn) return alert('Name and Role are required');

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('name_en', nameEn);
    formData.append('name_hi', nameHi);
    formData.append('role_en', roleEn);
    formData.append('role_hi', roleHi);
    formData.append('qualifications_en', qualEn);
    formData.append('qualifications_hi', qualHi);
    formData.append('experience', exp);
    formData.append('type', type);
    formData.append('order', order);
    if (file) formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/staff`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('Staff added successfully!');
        setNameEn(''); setNameHi(''); setRoleEn(''); setRoleHi('');
        setQualEn(''); setQualHi(''); setExp(''); setType('teaching'); setOrder('0'); setFile(null);
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add staff');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding staff');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="py-8 text-center">Loading staff...</div>;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {/* Add Form */}
      <div className="col-span-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm h-fit">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
          <Plus size={20} /> Add Staff Member
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Name (EN) *</label>
              <input type="text" required value={nameEn} onChange={e => setNameEn(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Name (HI) *</label>
              <input type="text" required value={nameHi} onChange={e => setNameHi(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Role (EN) *</label>
              <input type="text" required value={roleEn} onChange={e => setRoleEn(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Role (HI) *</label>
              <input type="text" required value={roleHi} onChange={e => setRoleHi(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Quals (EN)</label>
              <input type="text" value={qualEn} onChange={e => setQualEn(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Quals (HI)</label>
              <input type="text" value={qualHi} onChange={e => setQualHi(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Exp</label>
              <input type="text" value={exp} onChange={e => setExp(e.target.value)} placeholder="e.g. 5y" className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-sm">
                <option value="teaching">Teaching</option>
                <option value="support">Support</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Order</label>
              <input type="number" value={order} onChange={e => setOrder(e.target.value)} className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--foreground))]">Photo (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-xs text-[hsl(var(--muted-foreground))] file:mr-2 file:rounded-md file:border-0 file:bg-[hsl(var(--primary-strong))] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary))]" />
          </div>
          <button type="submit" disabled={uploading} className="w-full rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-sm text-white hover:bg-[hsl(var(--primary))] disabled:opacity-50">
            {uploading ? 'Saving...' : 'Add Staff'}
          </button>
        </form>
      </div>

      {/* Staff List */}
      <div className="col-span-1 md:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">Manage Staff Directory</h3>
        {staffList.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">No staff members found.</p>
        ) : (
          <ul className="space-y-3">
            {staffList.map(staff => (
              <li key={staff.id} className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] p-4">
                <div className="flex items-center gap-4">
                  {staff.imageUrl ? (
                    <img src={staff.imageUrl} alt={staff.name_en} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                      <ImageIcon size={20} />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-[hsl(var(--foreground))]">{staff.name_en}</h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{staff.role_en} · {staff.type}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(staff.id)} className="text-red-500 hover:text-red-700" title="Delete">
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
