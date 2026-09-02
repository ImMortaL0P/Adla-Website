import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PdfViewerProps {
  src: string
  title: string
  className?: string
}

export function PdfViewer({ src, title, className }: PdfViewerProps) {
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={cn(
          'flex min-h-[480px] items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-6 text-center text-sm text-[hsl(var(--muted-foreground))]',
          className
        )}
      >
        Could not load the document preview. Use the download button below.
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm',
        className
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[hsl(var(--card))]">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary-strong))]" aria-hidden />
          <span className="sr-only">Loading document</span>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className="h-[min(80vh,900px)] w-full bg-white"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false)
          setFailed(true)
        }}
        allow="autoplay"
      />
    </div>
  )
}
