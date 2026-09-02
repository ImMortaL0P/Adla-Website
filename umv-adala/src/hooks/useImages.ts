import { API_URL } from "@/lib/api";
import { useState, useEffect } from 'react';

export function useImages() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${API_URL}/api/images`;
    console.log('useImages -> fetching from:', url);
    fetch(url, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        console.log('useImages -> fetched data length:', data?.length);
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('useImages fetch error for URL', url, ':', err);
        setLoading(false);
      });
  }, []);

  const getSystemImage = (key: string) => {
    const img = images.find(img => img.key === key && img.category === 'system');
    return img ? img.url : null;
  };

  const getGalleryImages = () => {
    return images.filter(img => img.category === 'gallery');
  };

  return { images, getSystemImage, getGalleryImages, loading };
}
