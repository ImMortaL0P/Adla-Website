import React, { useState, useEffect, useRef } from 'react';
import { PlaceholderImage } from './PlaceholderImage';
import { Loader } from './Loader';
import { cn } from '@/lib/utils';

interface ProtectedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackText?: string;
  onContextMenu?: React.MouseEventHandler<HTMLImageElement>;
  onDragStart?: React.DragEventHandler<HTMLImageElement>;
  priority?: boolean;
}

export function ProtectedImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackText,
  priority = false, // Set to true for images above the fold
  ...props
}: ProtectedImageProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const currentRef = containerRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start fetching a bit before it comes into view
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView]);

  // Fetch image logic
  useEffect(() => {
    let active = true;
    let url: string | null = null;

    if (!src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    if (!isInView) {
      return;
    }

    // If it's a data URI or blob URI already, we can use it directly
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      setBlobUrl(src);
      setIsLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        setIsLoading(true);
        const { API_URL } = await import('@/lib/api');
        const fetchUrl = src.startsWith('/') ? `${API_URL}${src}` : src;

        const response = await fetch(fetchUrl, {
          credentials: 'omit',
          headers: {
            'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8'
          }
        });

        if (!response.ok) throw new Error('Failed to load protected image');

        const blob = await response.blob();
        if (active) {
          url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setHasError(false);
        }
      } catch (err) {
        if (active) setHasError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchImage();

    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [src, isInView]);

  // Anti-Screenshot alert (without blackout)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5' || e.key === 'S' || e.key === 's'))
      ) {
        e.preventDefault();
        try {
          navigator.clipboard.writeText("Screenshots not allowed in this website");
        } catch (err) {}
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isInView || isLoading) {
    return (
      <div ref={containerRef} className={cn("relative flex items-center justify-center overflow-hidden bg-[hsl(var(--muted))]/30", containerClassName, className)}>
        {isInView && <Loader size="lg" variant="muted" />}
      </div>
    );
  }

  if (hasError || !blobUrl) {
    return (
      <div ref={containerRef} className={cn("relative overflow-hidden bg-[hsl(var(--muted))]", containerClassName, className)}>
        <PlaceholderImage initials="!" size="xl" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative group select-none", containerClassName)}>
      {/* Invisible overlay to trap clicks/drags strictly */}
      <div
        className="absolute inset-0 z-10 select-none bg-transparent"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      <img
        src={blobUrl}
        alt={alt}
        className={cn(
          "select-none",
          className
        )}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        {...props}
      />
    </div>
  );
}
