import { API_URL, resolveMediaUrl } from "@/lib/api";
import { useState, useEffect } from 'react';

export function useImages() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/images`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getSystemImage = (key: string) => {
    const img = images.find(img => img.key === key && img.category === 'system');
    return img ? resolveMediaUrl(img.url) : null;
  };

  const getGalleryImages = () => {
    return images
      .filter(img => img.category === 'gallery')
      .map(img => ({ ...img, url: resolveMediaUrl(img.url) }));
  };

  return { images, getSystemImage, getGalleryImages, loading };
}
