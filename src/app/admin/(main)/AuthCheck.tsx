'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AuthCheck() {
  const pathname = usePathname();
  const isRefreshing = useRef(false);

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
    async function checkAuth() {
      if (isRefreshing.current) return;

      const res = await fetch('/api/auth/me');
      if (res.ok) return;

      // Токен протух — спробуй refresh
      isRefreshing.current = true;
      try {
        const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
        if (refreshRes.ok) return;
      } finally {
        isRefreshing.current = false;
      }

      window.location.href = '/admin/login';
    }

    checkAuth();
  }, [pathname]);

  return null;
}