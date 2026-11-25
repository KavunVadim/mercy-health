'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { useToast } from '@/components/admin/ui/Toast';

const MIN_LENGTH = 8;

function requirements(password: string) {
  return [
    { label: `Щонайменше ${MIN_LENGTH} символів`, met: password.length >= MIN_LENGTH },
    { label: 'Літери та хоча б одна цифра', met: /\p{L}/u.test(password) && /\d/.test(password) },
    { label: 'Без пробілів на початку та в кінці', met: password.length > 0 && password === password.trim() },
  ];
}

export default function AdminSecurityPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then((data: { email?: string } | null) => {
        if (data?.email) setEmail(data.email);
      })
      .catch(() => {});
  }, []);

  const goToLogin = useCallback(() => {
    window.location.href = '/admin/login';
  }, []);

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(goToLogin, 3500);
    return () => clearTimeout(timer);
  }, [done, goToLogin]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Введіть поточний пароль');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Новий пароль і підтвердження не збігаються');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Не вдалося змінити пароль');
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setDone(true);
      success('Пароль змінено');
    } catch {
      setError('Мережева помилка. Спробуйте ще раз.');
    } finally {
      setSaving(false);
    }
  }

  const checks = requirements(newPassword);

  return (
    <div className={styles.settingsNarrow}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Безпека</h1>
          <p className={styles.pageSubtitle}>Пароль адміністратора та активні сесії</p>
        </div>
      </div>

      {done ? (
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <ShieldCheck size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
            <h2 className={styles.settingsSectionTitle}>Пароль змінено</h2>
          </div>
          <div className={styles.settingsSectionBody}>
            <div className={styles.alertSuccess} role="status">
              <CheckCircle2 size={16} strokeWidth={2} />
              <span>
                Новий пароль збережено, усі сесії завершено — на цьому пристрої та на інших.
                Увійдіть заново з новим паролем.
              </span>
            </div>
            <div className={styles.formActions}>
              <button type="button" onClick={goToLogin} className={`${styles.btn} ${styles.btnPrimary}`}>
                <LogOut size={15} />
                Перейти до входу
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.settingsSection}>
            <div className={styles.settingsSectionHeader}>
              <KeyRound size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
              <h2 className={styles.settingsSectionTitle}>Зміна пароля</h2>
            </div>
            <div className={styles.settingsSectionBody}>
              {email && (
                <p className={styles.formHint}>
                  Обліковий запис: <strong>{email}</strong>
                </p>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="current-password">Поточний пароль</label>
                <div className={styles.passwordField}>
                  <input
                    id="current-password"
                    name="current-password"
                    className={styles.input}
                    type={reveal ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    disabled={saving}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setReveal(v => !v)}
                    aria-label={reveal ? 'Приховати паролі' : 'Показати паролі'}
                    aria-pressed={reveal}
                  >
                    {reveal ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.stackTop}`}>
                <label className={styles.label} htmlFor="new-password">Новий пароль</label>
                <div className={styles.passwordField}>
                  <input
                    id="new-password"
                    name="new-password"
                    className={styles.input}
                    type={reveal ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    disabled={saving}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setReveal(v => !v)}
                    aria-label={reveal ? 'Приховати паролі' : 'Показати паролі'}
                    aria-pressed={reveal}
                    tabIndex={-1}
                  >
                    {reveal ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                  </button>
                </div>
                <ul className={styles.requirements}>
                  {checks.map(item => (
                    <li
                      key={item.label}
                      className={`${styles.requirement} ${item.met ? styles.requirementOk : ''}`}
                    >
                      {item.met
                        ? <Check size={13} strokeWidth={2.5} />
                        : <Circle size={13} strokeWidth={2} />}
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`${styles.formGroup} ${styles.stackTop}`}>
                <label className={styles.label} htmlFor="confirm-password">Повторіть новий пароль</label>
                <div className={styles.passwordField}>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    className={styles.input}
                    type={reveal ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={saving}
                    required
                  />
                </div>
                {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                  <p className={styles.formHint}>Паролі поки що не збігаються</p>
                )}
              </div>

              {error && (
                <div className={`${styles.alertError} ${styles.stackTop}`} role="alert">
                  <AlertCircle size={16} strokeWidth={2} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="submit"
                  disabled={saving}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  <Check size={15} />
                  {saving ? 'Зберігаємо…' : 'Змінити пароль'}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.settingsSection}>
            <div className={styles.settingsSectionHeader}>
              <ShieldCheck size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
              <h2 className={styles.settingsSectionTitle}>Як це працює</h2>
            </div>
            <div className={styles.settingsSectionBody}>
              <p className={styles.formHint}>
                Для зміни пароля потрібен поточний — так ніхто не змінить його з чужого відкритого браузера.
                Після збереження всі сесії адміністратора завершуються, і вхід виконується заново з новим паролем.
              </p>
              <p className={styles.formHint}>
                Якщо поточний пароль забуто, його можна скинути з сервера (потрібен доступ до проєкту
                та <code>.env.local</code>):
              </p>
              <pre className={styles.codeBlock}>node scripts/reset-admin-password.mjs --email admin@example.com</pre>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
