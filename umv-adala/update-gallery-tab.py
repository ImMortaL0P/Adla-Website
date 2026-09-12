import re

with open('src/pages/admin/tabs/GalleryTab.tsx', 'r') as f:
    content = f.read()

content = content.replace("const [file, setFile] = useState<File | null>(null);", "const [files, setFiles] = useState<File[]>([]);")

old_upload = """  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captionEn || !file || !category) return alert('Category, English caption and image file are required');

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
        fetchCategories();
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
  };"""

new_upload = """  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captionEn || files.length === 0 || !category) return alert('Category, English caption and at least one image file are required');

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('caption_en', captionEn);
    formData.append('caption_hi', captionHi);
    formData.append('category', category);

    // Append multiple files
    files.forEach(file => {
      formData.append('images', file);
    });

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
        alert(`${files.length} image(s) uploaded successfully!`);
        // Reset form
        setCaptionEn(''); setCaptionHi('');
        setEventNameEn(''); setEventNameHi('');
        setEventDate(''); setEventDescriptionEn(''); setEventDescriptionHi('');
        setFiles([]);
        // We can't easily reset the file input visually without a ref, but state is cleared.
        fetchImages();
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to upload images');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading images');
    } finally {
      setUploading(false);
    }
  };"""

content = content.replace(old_upload, new_upload)

old_input = """              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Image File *</label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 block w-full text-sm text-[hsl(var(--muted-foreground))] file:mr-4 file:rounded-md file:border-0 file:bg-[hsl(var(--primary-strong))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary))]"
                />
              </div>"""

new_input = """              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Image Files *</label>
                <input
                  type="file"
                  required
                  multiple
                  accept="image/*"
                  onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])}
                  className="mt-1 block w-full text-sm text-[hsl(var(--muted-foreground))] file:mr-4 file:rounded-md file:border-0 file:bg-[hsl(var(--primary-strong))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary))]"
                />
                {files.length > 0 && (
                  <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                    {files.length} file(s) selected
                  </p>
                )}
              </div>"""

content = content.replace(old_input, new_input)

with open('src/pages/admin/tabs/GalleryTab.tsx', 'w') as f:
    f.write(content)
