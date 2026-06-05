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
    async function checkAuth() {
      const res = await fetch('/api/auth/me');

      if (res.ok) return; // всe добре

      // Токен протух — спробуй оновити через refreshToken
      const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

      if (refreshRes.ok) return; // оновили успішно

      // refreshToken теж недійсний — логін
      window.location.href = '/admin/login';
    }

    checkAuth();
  }, [pathname]);

  return null;
}