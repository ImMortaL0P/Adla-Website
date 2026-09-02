import { API_URL } from "@/lib/api";
import { useState, useEffect } from 'react';
import { staticStaff } from '@/data/staff';

export function useStaff() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/staff`)
      .then(res => res.json())
      .then(data => {
        setStaffList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStaff = () => {
    if (staffList.length > 0) return staffList;
    return staticStaff; // fallback
  };

  return { staffList: getStaff(), loading };
}
