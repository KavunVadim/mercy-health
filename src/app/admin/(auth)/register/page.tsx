'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/app/admin/admin.module.css';

export default function AdminRegisterPage() {
  const [step, setStep] = useState<'checking' | 'form' | 'done'>('checking');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch('/api/auth/admin-exists')
      .then(r => r.json())
      .then(data => {
        if (data.exists) {
          window.location.href = '/admin/login';
        } else {
          setStep('form');
        }
      })
      .catch(() => setStep('form'));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value;

    if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setStep('done');
        setTimeout(() => { window.location.href = '/admin'; }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'checking') return null;

  if (step === 'done') {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>✅ Account Created</h1>
          <p className={styles.loginSubtitle}>Redirecting to admin panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>🛠️ Create Admin</h1>
        <p className={styles.loginSubtitle}>Set up the first administrator account</p>

        {error && <div className={styles.loginError}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="email" className={styles.loginLabel}>Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              autoComplete="email"
              className={styles.loginInput}
              placeholder="admin@example.com"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className={styles.loginLabel}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              required
              autoComplete="new-password"
              className={styles.loginInput}
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirm" className={styles.loginLabel}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirm"
                id="confirm"
                required
                autoComplete="new-password"
                className={styles.loginInput}
                placeholder="Repeat password"
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
            {loading ? 'Creating…' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
