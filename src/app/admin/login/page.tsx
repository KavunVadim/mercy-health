'use client';

import React, { useState } from 'react';
import styles from '../admin.module.css';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>🛠️ Mercy Admin</h1>
        <p className={styles.loginSubtitle}>Sign in to manage your foundation</p>

        {error && <div className={styles.loginError}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="username" className={styles.loginLabel}>
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              autoComplete="username"
              className={styles.loginInput}
              placeholder="admin@example.com"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className={styles.loginLabel}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                required
                autoComplete="current-password"
                className={styles.loginInput}
                placeholder="••••••••"
                style={{ marginBottom: 0 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  padding: '4px 8px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={styles.loginFooter}>
          Mercy &amp; Health Foundation
        </p>
      </div>
    </div>
  );
}
