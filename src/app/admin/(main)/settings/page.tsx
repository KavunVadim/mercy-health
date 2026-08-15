'use client';

import { useState, useEffect } from 'react';
import { Phone, Share2, Globe, Navigation, Check } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { useToast } from '@/components/admin/ui/Toast';

type Form = {
  phone: string; email: string; address_uk: string; address_en: string;
  facebook: string; instagram: string; instagram_rehab: string; tiktok: string; telegram: string;
  copyright_uk: string; copyright_en: string;
  foundation_uk: string; foundation_en: string;
  projects_uk: string; projects_en: string;
  socials_uk: string; socials_en: string;
  contacts_uk: string; contacts_en: string;
  legal_uk: string; legal_en: string;
  nav_about_uk: string; nav_about_en: string;
  nav_projects_uk: string; nav_projects_en: string;
  nav_materials_uk: string; nav_materials_en: string;
  nav_reports_uk: string; nav_reports_en: string;
  nav_support_uk: string; nav_support_en: string;
  nav_contacts_uk: string; nav_contacts_en: string;
};

const defaultForm = (): Form => ({
  phone: '', email: '', address_uk: '', address_en: '',
  facebook: '', instagram: '', instagram_rehab: '', tiktok: '', telegram: '',
  copyright_uk: '', copyright_en: '',
  foundation_uk: '', foundation_en: '',
  projects_uk: '', projects_en: '',
  socials_uk: '', socials_en: '',
  contacts_uk: '', contacts_en: '',
  legal_uk: '', legal_en: '',
  nav_about_uk: '', nav_about_en: '',
  nav_projects_uk: '', nav_projects_en: '',
  nav_materials_uk: '', nav_materials_en: '',
  nav_reports_uk: '', nav_reports_en: '',
  nav_support_uk: '', nav_support_en: '',
  nav_contacts_uk: '', nav_contacts_en: '',
});

function BilingualRow({ label, nameUk, nameEn, form, setForm }: {
  label: string; nameUk: keyof Form; nameEn: keyof Form;
  form: Form; setForm: (f: Form) => void;
}) {
  return (
    <div className={styles.formGrid}>
      <div className={styles.formGroup}>
        <label className={styles.label}>{label} (Ukrainian)</label>
        <input className={styles.input} value={form[nameUk]} onChange={e => setForm({ ...form, [nameUk]: e.target.value })} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>{label} (English)</label>
        <input className={styles.input} value={form[nameEn]} onChange={e => setForm({ ...form, [nameEn]: e.target.value })} />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Form>(defaultForm());
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
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
          nav_about_uk: d.navigation?.about?.uk || '',
          nav_about_en: d.navigation?.about?.en || '',
          nav_projects_uk: d.navigation?.projects?.uk || '',
          nav_projects_en: d.navigation?.projects?.en || '',
          nav_materials_uk: d.navigation?.materials?.uk || '',
          nav_materials_en: d.navigation?.materials?.en || '',
          nav_reports_uk: d.navigation?.reports?.uk || '',
          nav_reports_en: d.navigation?.reports?.en || '',
          nav_support_uk: d.navigation?.support?.uk || '',
          nav_support_en: d.navigation?.support?.en || '',
          nav_contacts_uk: d.navigation?.contacts?.uk || '',
          nav_contacts_en: d.navigation?.contacts?.en || '',
        });
        setLoaded(true);
      })
      .catch(() => { setLoaded(true); error('Failed to load settings'); });
  }, [error]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        contacts: { phone: form.phone, email: form.email, address: { uk: form.address_uk, en: form.address_en } },
        footer: {
          foundation_phone: form.phone, foundation_email: form.email,
          address_foundation: { uk: form.address_uk, en: form.address_en },
          social_links: { facebook: form.facebook, instagram: form.instagram, instagram_rehab: form.instagram_rehab, tiktok: form.tiktok, telegram: form.telegram },
          copyright: { uk: form.copyright_uk, en: form.copyright_en },
          columns: {
            foundation: { uk: form.foundation_uk, en: form.foundation_en },
            projects: { uk: form.projects_uk, en: form.projects_en },
            socials: { uk: form.socials_uk, en: form.socials_en },
            contacts: { uk: form.contacts_uk, en: form.contacts_en },
            legal: { uk: form.legal_uk, en: form.legal_en },
          },
        },
        navigation: {
          about: { uk: form.nav_about_uk, en: form.nav_about_en },
          projects: { uk: form.nav_projects_uk, en: form.nav_projects_en },
          materials: { uk: form.nav_materials_uk, en: form.nav_materials_en },
          reports: { uk: form.nav_reports_uk, en: form.nav_reports_en },
          support: { uk: form.nav_support_uk, en: form.nav_support_en },
          contacts: { uk: form.nav_contacts_uk, en: form.nav_contacts_en },
        },
      };
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) success('Settings saved successfully');
      else error('Failed to save settings');
    } catch { error('Network error'); }
    finally { setSaving(false); }
  }

  if (!loaded) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <div className={styles.pageTitleGroup}>
            <h1 className={styles.pageTitle}>Settings</h1>
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className={styles.settingsSection} style={{ marginBottom: '1.25rem' }}>
            <div className={styles.settingsSectionHeader}>
              <div className={`${styles.skeleton}`} style={{ width: 140, height: 14, borderRadius: 4 }} />
            </div>
            <div className={styles.settingsSectionBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2].map(j => (
                <div key={j} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.skeleton} style={{ height: 38, borderRadius: 8 }} />
                  <div className={styles.skeleton} style={{ height: 38, borderRadius: 8 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>Manage site-wide contact info, social links, and navigation labels</p>
        </div>
        <div className={styles.pageActions}>
          <button form="settings-form" type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
            <Check size={15} />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>

      <form id="settings-form" onSubmit={handleSave}>
        {/* Contacts */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <Phone size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
            <h2 className={styles.settingsSectionTitle}>Contact Information</h2>
          </div>
          <div className={styles.settingsSectionBody}>
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <input className={styles.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+380 XX XXX XX XX" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="info@example.com" />
              </div>
            </div>
            <BilingualRow label="Address" nameUk="address_uk" nameEn="address_en" form={form} setForm={setForm} />
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <Share2 size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
            <h2 className={styles.settingsSectionTitle}>Social Media Links</h2>
          </div>
          <div className={styles.settingsSectionBody}>
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}><label className={styles.label}>Facebook</label><input className={styles.input} value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} placeholder="https://facebook.com/..." /></div>
              <div className={styles.formGroup}><label className={styles.label}>Instagram</label><input className={styles.input} value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
            </div>
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}><label className={styles.label}>Instagram Rehab</label><input className={styles.input} value={form.instagram_rehab} onChange={e => setForm({ ...form, instagram_rehab: e.target.value })} /></div>
              <div className={styles.formGroup}><label className={styles.label}>TikTok</label><input className={styles.input} value={form.tiktok} onChange={e => setForm({ ...form, tiktok: e.target.value })} /></div>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}><label className={styles.label}>Telegram</label><input className={styles.input} value={form.telegram} onChange={e => setForm({ ...form, telegram: e.target.value })} placeholder="https://t.me/..." /></div>
              <div />
            </div>
          </div>
        </div>

        {/* Footer Columns */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <Globe size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
            <h2 className={styles.settingsSectionTitle}>Footer Columns</h2>
          </div>
          <div className={styles.settingsSectionBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(['Foundation', 'Projects', 'Socials', 'Contacts', 'Legal'] as const).map(col => (
              <BilingualRow
                key={col}
                label={col}
                nameUk={`${col.toLowerCase()}_uk` as keyof Form}
                nameEn={`${col.toLowerCase()}_en` as keyof Form}
                form={form}
                setForm={setForm}
              />
            ))}
            <hr className={styles.divider} style={{ margin: '0.5rem 0' }} />
            <BilingualRow label="Copyright" nameUk="copyright_uk" nameEn="copyright_en" form={form} setForm={setForm} />
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <Navigation size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
            <h2 className={styles.settingsSectionTitle}>Navigation Labels</h2>
          </div>
          <div className={styles.settingsSectionBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(['About', 'Projects', 'Materials', 'Reports', 'Support', 'Contacts'] as const).map(key => (
              <BilingualRow
                key={key}
                label={key}
                nameUk={`nav_${key.toLowerCase()}_uk` as keyof Form}
                nameEn={`nav_${key.toLowerCase()}_en` as keyof Form}
                form={form}
                setForm={setForm}
              />
            ))}
          </div>
        </div>

        {/* Save button — also shown at bottom */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`} style={{ minWidth: 140 }}>
            <Check size={15} />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
