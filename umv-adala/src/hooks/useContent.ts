import { API_URL } from "@/lib/api";
import { useState, useEffect } from 'react';

export function useContent() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getValue = (key: string, lang: 'en' | 'hi', fallback: string) => {
    const item = content.find(c => c.key === key);
    if (!item) return fallback;
    return lang === 'en' ? (item.value_en || fallback) : (item.value_hi || fallback);
  };

  return { content, getValue, loading };
}
