'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AuthCheck() {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/admin-exists')
      .then(r => r.json())
      .then(data => {
        if (!data.exists) {
          window.location.href = '/admin/register';
        }
      });
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (!r.ok) {
          window.location.href = '/admin/login';
        }
      });
  }, [pathname]);

  return null;
}
