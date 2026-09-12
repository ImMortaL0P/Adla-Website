import { API_URL } from "@/lib/api";
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function ContentTab() {
  const [contentList, setContentList] = useState<any[]>([]);

  const fields = [
    { key: 'admission_start_date', label: 'Admission Starts Date', placeholder: 'e.g. 15th March 2026' },
    { key: 'admission_fee', label: 'Admission Fee', placeholder: 'e.g. ₹500' },
  ];

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/content`);
      const data = await res.json();
      setContentList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getValue = (key: string) => {
    const item = contentList.find(c => c.key === key);
    return item ? item.value_en : '';
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Update these straightforward text fields for Admission details. Leave blank to revert to "To be announced".
        </p>
      </div>

      {fields.map(field => (
        <ContentEditor
          key={field.key}
          contentKey={field.key}
          label={field.label}
          placeholder={field.placeholder}
          initialValue={getValue(field.key)}
          onSave={fetchContent}
        />
      ))}
    </div>
  );
}

function ContentEditor({ contentKey, label, placeholder, initialValue, onSave }: any) {
  const [val, setVal] = useState(initialValue || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setVal(initialValue || '');
  }, [initialValue]);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key: contentKey, value_en: val, value_hi: val })
      });
      if (res.ok) {
        alert('Saved successfully!');
        onSave();
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">{label}</h3>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-3 flex items-center gap-2 rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-sm text-white hover:bg-[hsl(var(--primary))] disabled:opacity-50 sm:mt-0"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div>
        <input
          type="text"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder={placeholder}
          className="w-full max-w-md rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
        />
      </div>
    </div>
  );
}
