'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function AuthCheck() {
  const pathname = usePathname();
  const isRefreshing = useRef(false);

  const checkAuth = useCallback(async () => {
    if (isRefreshing.current) return;

    const res = await fetch('/api/auth/me');
    if (res.ok) return;

    isRefreshing.current = true;
    try {
      const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
      if (refreshRes.ok) return;
    } finally {
      isRefreshing.current = false;
    }

    window.location.href = '/admin/login';
  }, []);

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
    checkAuth();
  }, [pathname, checkAuth]);

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  return null;
}