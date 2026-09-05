import { API_URL } from "@/lib/api";
import { useState } from 'react';
import { FileSignature, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';

export default function PressNoticeTab() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [refNo, setRefNo] = useState(`UMV/${new Date().getFullYear()}/`);
  const [salutation, setSalutation] = useState('To Whom It May Concern,');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [undersignName, setUndersignName] = useState('');
  const [undersignDesignation, setUndersignDesignation] = useState('Principal');

  const generateAndUploadPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn) return alert('Notice Title is required');
    if (!body) return alert('Notice body is required');

    setUploading(true);
    setSuccess(false);

    try {
      // 1. Generate PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;

      // Try to load and add logo
      try {
        const res = await fetch('/images/logo/adala-crest.png');
        if (res.ok) {
          const imgBlob = await res.blob();
          const base64data = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(imgBlob);
          });
          // Logo placed on the left, vertically balanced with header text
          doc.addImage(base64data, 'PNG', margin, 15, 27.5, 27.5);
        }
      } catch (err) {
        console.error("Failed to load logo for PDF", err);
      }

      // 2% shift of text is approx 4.2mm (assuming A4 width 210mm)
      const textCenterX = (pageWidth / 2) + 4.2;

      // Header
      yPos += 2;
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text("U.M.V. ADLA", textCenterX, yPos, { align: 'center' });

      yPos += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text("Adla, Naubatpur, Patna District, Bihar", textCenterX, yPos, { align: 'center' });

      yPos += 8;
      doc.text("Pin - 801109", textCenterX, yPos, { align: 'center' });

      yPos += 10;
      doc.text("Email - umvadla@gmail.com contact@umvadla.in", textCenterX, yPos, { align: 'center' });

      yPos += 10;
      doc.setFontSize(10);
      doc.text("Office Hours: Monday - Friday 9:30 AM to 4:00 PM Saturday 9:30 AM to 1:00 PM", textCenterX, yPos, { align: 'center' });

      // Line separator
      yPos += 12;
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);

      // Ref No and Date
      yPos += 12;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      if (refNo) doc.text(`Ref No: ${refNo}`, margin, yPos);
      if (date) doc.text(`Date: ${new Date(date).toLocaleDateString('en-IN')}`, pageWidth - margin, yPos, { align: 'right' });

      // Title - NOTICE
      yPos += 15;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text("NOTICE", pageWidth / 2, yPos, { align: 'center' });

      // Subject
      if (subject) {
        yPos += 15;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Subject: ${subject}`, margin, yPos);
      }

      // Salutation
      yPos += subject ? 12 : 15;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(salutation, margin, yPos);

      // Body text
      yPos += 10;
      doc.setFontSize(12);
      const splitBody = doc.splitTextToSize(body, pageWidth - 2 * margin);
      doc.text(splitBody, margin, yPos);

      // Update yPos based on body length
      yPos += (splitBody.length * 6) + 15;

      // New Page Check if necessary for bottom footer
      if (yPos > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPos = 30;
      }

      // Undersign / Footer section
      doc.setFont('helvetica', 'normal');
      doc.text("Regards,", margin, yPos);
      yPos += 8;

      if (undersignName) {
        doc.setFont('helvetica', 'bold');
        doc.text(undersignName, margin, yPos);
        yPos += 6;
      }
      if (undersignDesignation) {
        doc.setFont('helvetica', 'normal');
        doc.text(undersignDesignation, margin, yPos);
        yPos += 6;
      }

      doc.setFont('helvetica', 'bold');
      doc.text("U.M.V. Adla", margin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.text("Adla, Naubatpur, Patna District, Bihar - 801109", margin, yPos);

      // Convert to File
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], `${titleEn.replace(/\s+/g, '_')}_Notice.pdf`, { type: 'application/pdf' });

      // 2. Upload to server
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('title_en', titleEn);
      formData.append('title_hi', titleHi || titleEn);
      formData.append('type', 'notice'); // Treat as regular notice so it displays properly
      formData.append('file', pdfFile);

      const res = await fetch(`${API_URL}/api/notices`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setSuccess(true);
        // Reset form optionally
        setBody('');
        setSubject('');
        setTitleEn('');
        setTitleHi('');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to upload press notice');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating or uploading press notice. Did you run `npm install jspdf`?');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm sm:p-8">
        <div className="mb-6 border-b border-[hsl(var(--border))] pb-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-[hsl(var(--foreground))]">
            <FileSignature className="text-[hsl(var(--primary-strong))]" />
            Generate Press Notice
          </h2>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            Use this form to automatically generate a formal PDF notice and publish it directly to the website.
          </p>
        </div>

        {success && (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <p className="font-medium">Notice generated and published successfully!</p>
            </div>
            <button onClick={() => setSuccess(false)} className="text-sm underline hover:no-underline">Draw another</button>
          </div>
        )}

        <form onSubmit={generateAndUploadPDF} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Notice Title (English) *</label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={e => setTitleEn(e.target.value)}
                placeholder="e.g. Holiday Announcement"
                className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
              />
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">This appears as the link text on the website.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Notice Title (Hindi)</label>
              <input
                type="text"
                value={titleHi}
                onChange={e => setTitleHi(e.target.value)}
                placeholder="Alternative Hindi title..."
                className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Reference Number</label>
              <input
                type="text"
                value={refNo}
                onChange={e => setRefNo(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Date on Document</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
              />
            </div>
          </div>

          <div className="border-t border-[hsl(var(--border))] pt-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Document Content</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Regarding upcoming summer holidays"
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Salutation</label>
                <input
                  type="text"
                  value={salutation}
                  onChange={e => setSalutation(e.target.value)}
                  placeholder="e.g. Dear Parents,"
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Body Content *</label>
                <textarea
                  required
                  rows={8}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Type the main content of the notice here..."
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))] resize-y"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[hsl(var(--border))] pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Undersign Name</label>
              <input
                type="text"
                value={undersignName}
                onChange={e => setUndersignName(e.target.value)}
                placeholder="e.g. Dr. Jane Doe"
                className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Designation</label>
              <input
                type="text"
                value={undersignDesignation}
                onChange={e => setUndersignDesignation(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))]"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary-strong))] px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-[hsl(var(--primary))] disabled:opacity-50"
            >
              {uploading ? (
                <>Generating & Uploading...</>
              ) : (
                <>
                  <FileSignature size={18} />
                  Generate PDF & Publish
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
