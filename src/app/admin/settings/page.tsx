'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    phone: '', email: '', address_uk: '', address_en: '',
    facebook: '', instagram: '', instagram_rehab: '', tiktok: '', telegram: '',
    copyright_uk: '', copyright_en: '',
    foundation_uk: '', foundation_en: '',
    projects_uk: '', projects_en: '',
    socials_uk: '', socials_en: '',
    contacts_uk: '', contacts_en: '',
    legal_uk: '', legal_en: '',
  });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      setForm({
        phone: d.contacts?.phone || '',
        email: d.contacts?.email || '',
        address_uk: d.contacts?.address?.uk || d.footer?.address_foundation?.uk || '',
        address_en: d.contacts?.address?.en || d.footer?.address_foundation?.en || '',
        facebook: d.footer?.social_links?.facebook || '',
        instagram: d.footer?.social_links?.instagram || '',
        instagram_rehab: d.footer?.social_links?.instagram_rehab || '',
        tiktok: d.footer?.social_links?.tiktok || '',
        telegram: d.footer?.social_links?.telegram || '',
        copyright_uk: d.footer?.copyright?.uk || '',
        copyright_en: d.footer?.copyright?.en || '',
        foundation_uk: d.footer?.columns?.foundation?.uk || '',
        foundation_en: d.footer?.columns?.foundation?.en || '',
        projects_uk: d.footer?.columns?.projects?.uk || '',
        projects_en: d.footer?.columns?.projects?.en || '',
        socials_uk: d.footer?.columns?.socials?.uk || '',
        socials_en: d.footer?.columns?.socials?.en || '',
        contacts_uk: d.footer?.columns?.contacts?.uk || '',
        contacts_en: d.footer?.columns?.contacts?.en || '',
        legal_uk: d.footer?.columns?.legal?.uk || '',
        legal_en: d.footer?.columns?.legal?.en || '',
      });
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        contacts: { phone: form.phone, email: form.email, address: { uk: form.address_uk, en: form.address_en } },
        footer: {
          foundation_phone: form.phone,
          foundation_email: form.email,
          address_foundation: { uk: form.address_uk, en: form.address_en },
          social_links: {
            facebook: form.facebook, instagram: form.instagram,
            instagram_rehab: form.instagram_rehab, tiktok: form.tiktok, telegram: form.telegram,
          },
          copyright: { uk: form.copyright_uk, en: form.copyright_en },
          columns: {
            foundation: { uk: form.foundation_uk, en: form.foundation_en },
            projects: { uk: form.projects_uk, en: form.projects_en },
            socials: { uk: form.socials_uk, en: form.socials_en },
            contacts: { uk: form.contacts_uk, en: form.contacts_en },
            legal: { uk: form.legal_uk, en: form.legal_en },
          },
        },
      };
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) alert('Settings saved');
    } finally { setSaving(false); }
  }

  if (!loaded) return <p style={{ color: '#64748b' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Settings</h2>
      <form onSubmit={handleSave}>
        <h3 style={{ margin: '0 0 0.75rem', color: '#475569' }}>Contacts</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
          <div><label className={styles.loginLabel}>Phone</label><input className={styles.loginInput} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className={styles.loginLabel}>Email</label><input className={styles.loginInput} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
          <div><label className={styles.loginLabel}>Address (UK)</label><input className={styles.loginInput} value={form.address_uk} onChange={e => setForm({ ...form, address_uk: e.target.value })} /></div>
          <div><label className={styles.loginLabel}>Address (EN)</label><input className={styles.loginInput} value={form.address_en} onChange={e => setForm({ ...form, address_en: e.target.value })} /></div>
        </div>

        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
        <h3 style={{ margin: '0 0 0.75rem', color: '#475569' }}>Social Links</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
          <div><label className={styles.loginLabel}>Facebook</label><input className={styles.loginInput} value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} /></div>
          <div><label className={styles.loginLabel}>Instagram</label><input className={styles.loginInput} value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} /></div>
          <div><label className={styles.loginLabel}>Instagram Rehab</label><input className={styles.loginInput} value={form.instagram_rehab} onChange={e => setForm({ ...form, instagram_rehab: e.target.value })} /></div>
          <div><label className={styles.loginLabel}>TikTok</label><input className={styles.loginInput} value={form.tiktok} onChange={e => setForm({ ...form, tiktok: e.target.value })} /></div>
          <div><label className={styles.loginLabel}>Telegram</label><input className={styles.loginInput} value={form.telegram} onChange={e => setForm({ ...form, telegram: e.target.value })} /></div>
        </div>

        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
        <h3 style={{ margin: '0 0 0.75rem', color: '#475569' }}>Footer Columns</h3>
        {(['foundation', 'projects', 'socials', 'contacts', 'legal'] as const).map(col => (
          <div key={col} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div><label className={styles.loginLabel}>{col} (UK)</label><input className={styles.loginInput} value={(form as any)[`${col}_uk`]} onChange={e => setForm({ ...form, [`${col}_uk`]: e.target.value })} /></div>
            <div><label className={styles.loginLabel}>{col} (EN)</label><input className={styles.loginInput} value={(form as any)[`${col}_en`]} onChange={e => setForm({ ...form, [`${col}_en`]: e.target.value })} /></div>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem', marginTop: '0.5rem' }}>
          <div><label className={styles.loginLabel}>Copyright (UK)</label><input className={styles.loginInput} value={form.copyright_uk} onChange={e => setForm({ ...form, copyright_uk: e.target.value })} /></div>
          <div><label className={styles.loginLabel}>Copyright (EN)</label><input className={styles.loginInput} value={form.copyright_en} onChange={e => setForm({ ...form, copyright_en: e.target.value })} /></div>
        </div>

        <button type="submit" disabled={saving} className={styles.loginButton} style={{ marginTop: '1.5rem', width: 'auto', padding: '0.6rem 2rem' }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
