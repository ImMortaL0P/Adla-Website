import { API_URL } from "@/lib/api";
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function ContentTab() {
  const [contentList, setContentList] = useState<any[]>([]);
  

  const fields = [
    { key: 'admission_content', label: 'Admission Page Content (JSON Format)' },
  ];

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/content`);
      const data = await res.json();
      setContentList(data);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  const getValue = (key: string) => {
    const item = contentList.find(c => c.key === key);
    return item ? item.value_en : ''; 
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Admission content is stored in JSON format to support complex tables and lists. Please ensure the formatting remains valid when making changes.
        </p>
      </div>
      {fields.map(field => (
        <ContentEditor 
          key={field.key}
          contentKey={field.key}
          label={field.label}
          initialValue={getValue(field.key)}
          onSave={fetchContent}
        />
      ))}
    </div>
  );
}

function ContentEditor({ contentKey, label, initialValue, onSave }: any) {
  const [val, setVal] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    try {
      JSON.parse(val); // Validate JSON
    } catch (e) {
      return alert('Invalid JSON format. Please fix any syntax errors before saving.');
    }

    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key: contentKey, value_en: val, value_hi: '' })
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
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">{label}</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Key: {contentKey}</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex self-start sm:self-auto items-center gap-2 rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-sm text-white hover:bg-[hsl(var(--primary))] disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <div>
        <textarea
          value={val}
          onChange={e => setVal(e.target.value)}
          rows={20}
          className="w-full font-mono rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-xs text-[hsl(var(--foreground))]"
          placeholder="{}"
        />
      </div>
    </div>
  );
}
