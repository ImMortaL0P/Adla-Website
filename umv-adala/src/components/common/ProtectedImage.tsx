import React, { useState, useEffect } from 'react';
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
}

export function ProtectedImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackText,
  ...props
}: ProtectedImageProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    let url: string | null = null;

    if (!src) {
      setIsLoading(false);
      setHasError(true);
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
          // Include credentials if needing to proxy secure images, maybe not needed for public DRM
          credentials: 'omit'
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
  }, [src]);

  // Anti-Screenshot alert (without blackout)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5' || e.key === 'S' || e.key === 's'))
      ) {
        e.preventDefault();
        // Option 1: use alert
        alert("Screenshots not allowed in this website");
        // Option 2: clipboard override
        try {
          navigator.clipboard.writeText("Screenshots not allowed in this website");
        } catch (err) {}
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className={cn("relative flex items-center justify-center overflow-hidden bg-[hsl(var(--muted))]/30", containerClassName, className)}>
        <Loader size="lg" variant="muted" />
      </div>
    );
  }

  if (hasError || !blobUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-[hsl(var(--muted))]", containerClassName, className)}>
        <PlaceholderImage initials="!" size="xl" />
      </div>
    );
  }

  return (
    <div className={cn("relative group select-none", containerClassName)}>
      {/* Invisible overlay to trap clicks/drags strictly */}
      <div
        className="absolute inset-0 z-10 select-none bg-transparent"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ touchAction: 'none' }}
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
