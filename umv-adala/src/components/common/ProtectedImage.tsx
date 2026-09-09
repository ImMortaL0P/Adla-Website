import React, { useState, useEffect } from 'react';
import { PlaceholderImage } from './PlaceholderImage';
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
        const backendUrl = import.meta.env.VITE_API_URL || '';
        const fetchUrl = src.startsWith('/') ? `${backendUrl}${src}` : src;

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

  // Anti-Screenshot (Blackout on PrintScreen or Meta+Shift+S/4)
  const [isBlackout, setIsBlackout] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen') {
        setIsBlackout(true);
        setTimeout(() => setIsBlackout(false), 2000);
      }
      // Mac Shift+Command+3, 4, 5
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5' || e.key === 'S' || e.key === 's')) {
        setIsBlackout(true);
        setTimeout(() => setIsBlackout(false), 2000);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlackout(true);
      } else {
        setTimeout(() => setIsBlackout(false), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Also, when the window loses focus, we can black out (optional, can be very aggressive)
    const handleBlur = () => setIsBlackout(true);
    const handleFocus = () => setIsBlackout(false);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={cn("relative overflow-hidden bg-[hsl(var(--muted))]", containerClassName, className)}>
        <PlaceholderImage initials="⌛" size="xl" />
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
      {isBlackout && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center text-white text-sm opacity-100 transition-opacity duration-75">
          Screenshot Disabled
        </div>
      )}
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
