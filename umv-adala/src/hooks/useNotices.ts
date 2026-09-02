import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';

export function useNotices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/notices`)
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return { notices, loading };
}
