'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function AdminContentPage() {
  const [form, setForm] = useState({
    about_history_title_uk: '', about_history_title_en: '',
    about_history_content_uk: '', about_history_content_en: '',
    about_mission_title_uk: '', about_mission_title_en: '',
    about_mission_content_uk: '', about_mission_content_en: '',
    about_media_title_uk: '', about_media_title_en: '',
    about_media_content_uk: '', about_media_content_en: '',
    hero_title_uk: '', hero_title_en: '',
    hero_description_uk: '', hero_description_en: '',
    stats_collected: '', stats_helped: '', stats_donors: '',
    beneficiary_value_uk: '', beneficiary_value_en: '',
    edrpou_value: '', bank_name_value_uk: '', bank_name_value_en: '',
    purpose_value_uk: '', purpose_value_en: '',
  });
  const [supportCards, setSupportCards] = useState<{ id: string; title: string; description: string; bank: string; link: string }[]>([]);
  const [supportCardsEn, setSupportCardsEn] = useState<{ id: string; title: string; description: string; bank: string; link: string }[]>([]);
  const [documents, setDocuments] = useState<{ id: string; title: string; url: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<'about' | 'hero' | 'support' | 'stats' | 'docs'>('about');

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(d => {
      setForm({
        about_history_title_uk: d.about_history_title_uk || '',
        about_history_title_en: d.about_history_title_en || '',
        about_history_content_uk: d.about_history_content_uk || '',
        about_history_content_en: d.about_history_content_en || '',
        about_mission_title_uk: d.about_mission_title_uk || '',
        about_mission_title_en: d.about_mission_title_en || '',
        about_mission_content_uk: d.about_mission_content_uk || '',
        about_mission_content_en: d.about_mission_content_en || '',
        about_media_title_uk: d.about_media_title_uk || '',
        about_media_title_en: d.about_media_title_en || '',
        about_media_content_uk: d.about_media_content_uk || '',
        about_media_content_en: d.about_media_content_en || '',
        hero_title_uk: d.hero_title_uk || '',
        hero_title_en: d.hero_title_en || '',
        hero_description_uk: d.hero_description_uk || '',
        hero_description_en: d.hero_description_en || '',
        stats_collected: d.stats_collected || '',
        stats_helped: d.stats_helped || '',
        stats_donors: d.stats_donors || '',
        beneficiary_value_uk: d.beneficiary_value_uk || '',
        beneficiary_value_en: d.beneficiary_value_en || '',
        edrpou_value: d.edrpou_value || '',
        bank_name_value_uk: d.bank_name_value_uk || '',
        bank_name_value_en: d.bank_name_value_en || '',
        purpose_value_uk: d.purpose_value_uk || '',
        purpose_value_en: d.purpose_value_en || '',
      });
      setSupportCards(d.support_cards || []);
      setSupportCardsEn(d.support_cards_en || []);
      setDocuments(d.documents || []);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, support_cards: supportCards, support_cards_en: supportCardsEn, documents };
      const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) alert('Content saved');
      else alert('Failed to save content');
    } finally { setSaving(false); }
  }

  function addSupportCard() {
    setSupportCards([...supportCards, { id: `card-${Date.now()}`, title: '', description: '', bank: '', link: '' }]);
    setSupportCardsEn([...supportCardsEn, { id: `card-${Date.now()}`, title: '', description: '', bank: '', link: '' }]);
  }

  function updateSupportCard(i: number, field: string, value: string) {
    const updated = [...supportCards];
    updated[i] = { ...updated[i], [field]: value };
    setSupportCards(updated);
  }

  function updateSupportCardEn(i: number, field: string, value: string) {
    const updated = [...supportCardsEn];
    updated[i] = { ...updated[i], [field]: value };
    setSupportCardsEn(updated);
  }

  function removeSupportCard(i: number) {
    setSupportCards(supportCards.filter((_, idx) => idx !== i));
    setSupportCardsEn(supportCardsEn.filter((_, idx) => idx !== i));
  }

  function addDocument() {
    setDocuments([...documents, { id: `doc-${Date.now()}`, title: '', url: '' }]);
  }

  function updateDocument(i: number, field: string, value: string) {
    const d = [...documents];
    d[i] = { ...d[i], [field]: value };
    setDocuments(d);
  }

  function removeDocument(i: number) {
    setDocuments(documents.filter((_, idx) => idx !== i));
  }

  if (!loaded) return <p style={{ color: '#64748b' }}>Loading...</p>;

  const tabs = [
    { key: 'about' as const, label: 'About Page' },
    { key: 'hero' as const, label: 'Hero Text' },
    { key: 'support' as const, label: 'Support Cards' },
    { key: 'stats' as const, label: 'Bank Details' },
    { key: 'docs' as const, label: 'Documents' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Content Pages</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              padding: '0.5rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
              background: tab === t.key ? '#1e293b' : '#e2e8f0',
              color: tab === t.key ? 'white' : '#475569', fontWeight: 600, fontSize: '0.85rem',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} style={{ maxWidth: '800px' }}>
        {tab === 'about' && (
          <>
            <h3 style={{ margin: '0 0 1rem', color: '#475569' }}>History</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div><label className={styles.loginLabel}>Title (UK)</label><input className={styles.loginInput} value={form.about_history_title_uk} onChange={e => setForm({ ...form, about_history_title_uk: e.target.value })} /></div>
              <div><label className={styles.loginLabel}>Title (EN)</label><input className={styles.loginInput} value={form.about_history_title_en} onChange={e => setForm({ ...form, about_history_title_en: e.target.value })} /></div>
            </div>
            <label className={styles.loginLabel}>Content (UK)</label>
            <textarea className={styles.loginInput} rows={10} value={form.about_history_content_uk} onChange={e => setForm({ ...form, about_history_content_uk: e.target.value })} style={{ resize: 'vertical' }} />
            <label className={styles.loginLabel}>Content (EN)</label>
            <textarea className={styles.loginInput} rows={10} value={form.about_history_content_en} onChange={e => setForm({ ...form, about_history_content_en: e.target.value })} style={{ resize: 'vertical' }} />

            <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
            <h3 style={{ margin: '0 0 1rem', color: '#475569' }}>Mission</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div><label className={styles.loginLabel}>Title (UK)</label><input className={styles.loginInput} value={form.about_mission_title_uk} onChange={e => setForm({ ...form, about_mission_title_uk: e.target.value })} /></div>
              <div><label className={styles.loginLabel}>Title (EN)</label><input className={styles.loginInput} value={form.about_mission_title_en} onChange={e => setForm({ ...form, about_mission_title_en: e.target.value })} /></div>
            </div>
            <label className={styles.loginLabel}>Content (UK)</label>
            <textarea className={styles.loginInput} rows={4} value={form.about_mission_content_uk} onChange={e => setForm({ ...form, about_mission_content_uk: e.target.value })} style={{ resize: 'vertical' }} />
            <label className={styles.loginLabel}>Content (EN)</label>
            <textarea className={styles.loginInput} rows={4} value={form.about_mission_content_en} onChange={e => setForm({ ...form, about_mission_content_en: e.target.value })} style={{ resize: 'vertical' }} />

            <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
            <h3 style={{ margin: '0 0 1rem', color: '#475569' }}>Media About Us</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div><label className={styles.loginLabel}>Title (UK)</label><input className={styles.loginInput} value={form.about_media_title_uk} onChange={e => setForm({ ...form, about_media_title_uk: e.target.value })} /></div>
              <div><label className={styles.loginLabel}>Title (EN)</label><input className={styles.loginInput} value={form.about_media_title_en} onChange={e => setForm({ ...form, about_media_title_en: e.target.value })} /></div>
            </div>
            <label className={styles.loginLabel}>Content (UK)</label>
            <textarea className={styles.loginInput} rows={4} value={form.about_media_content_uk} onChange={e => setForm({ ...form, about_media_content_uk: e.target.value })} style={{ resize: 'vertical' }} />
            <label className={styles.loginLabel}>Content (EN)</label>
            <textarea className={styles.loginInput} rows={4} value={form.about_media_content_en} onChange={e => setForm({ ...form, about_media_content_en: e.target.value })} style={{ resize: 'vertical' }} />
          </>
        )}

        {tab === 'hero' && (
          <>
            <h3 style={{ margin: '0 0 1rem', color: '#475569' }}>Hero Section Text</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div><label className={styles.loginLabel}>Title (UK)</label><input className={styles.loginInput} value={form.hero_title_uk} onChange={e => setForm({ ...form, hero_title_uk: e.target.value })} /></div>
              <div><label className={styles.loginLabel}>Title (EN)</label><input className={styles.loginInput} value={form.hero_title_en} onChange={e => setForm({ ...form, hero_title_en: e.target.value })} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div><label className={styles.loginLabel}>Description (UK)</label><textarea className={styles.loginInput} rows={3} value={form.hero_description_uk} onChange={e => setForm({ ...form, hero_description_uk: e.target.value })} style={{ resize: 'vertical' }} /></div>
              <div><label className={styles.loginLabel}>Description (EN)</label><textarea className={styles.loginInput} rows={3} value={form.hero_description_en} onChange={e => setForm({ ...form, hero_description_en: e.target.value })} style={{ resize: 'vertical' }} /></div>
            </div>
          </>
        )}

        {tab === 'support' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#475569' }}>Donation Cards</h3>
              <button type="button" onClick={addSupportCard} className={styles.loginButton} style={{ width: 'auto', padding: '0.4rem 1rem', margin: 0, fontSize: '0.85rem' }}>+ Add Card</button>
            </div>
            {supportCards.map((card, i) => (
              <div key={card.id} style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.85rem' }}>Card {i + 1}</strong>
                  <button type="button" onClick={() => removeSupportCard(i)} style={{ padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>Remove</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div><label className={styles.loginLabel}>Title (UK)</label><input className={styles.loginInput} value={card.title} onChange={e => updateSupportCard(i, 'title', e.target.value)} /></div>
                  <div><label className={styles.loginLabel}>Title (EN)</label><input className={styles.loginInput} value={supportCardsEn[i]?.title || ''} onChange={e => updateSupportCardEn(i, 'title', e.target.value)} /></div>
                  <div><label className={styles.loginLabel}>Description (UK)</label><textarea className={styles.loginInput} rows={2} value={card.description} onChange={e => updateSupportCard(i, 'description', e.target.value)} /></div>
                  <div><label className={styles.loginLabel}>Description (EN)</label><textarea className={styles.loginInput} rows={2} value={supportCardsEn[i]?.description || ''} onChange={e => updateSupportCardEn(i, 'description', e.target.value)} /></div>
                  <div><label className={styles.loginLabel}>Bank</label><input className={styles.loginInput} value={card.bank} onChange={e => updateSupportCard(i, 'bank', e.target.value)} /></div>
                  <div><label className={styles.loginLabel}>Link</label><input className={styles.loginInput} value={card.link} onChange={e => updateSupportCard(i, 'link', e.target.value)} /></div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'stats' && (
          <>
            <h3 style={{ margin: '0 0 1rem', color: '#475569' }}>Bank Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div><label className={styles.loginLabel}>Beneficiary (UK)</label><input className={styles.loginInput} value={form.beneficiary_value_uk} onChange={e => setForm({ ...form, beneficiary_value_uk: e.target.value })} /></div>
              <div><label className={styles.loginLabel}>Beneficiary (EN)</label><input className={styles.loginInput} value={form.beneficiary_value_en} onChange={e => setForm({ ...form, beneficiary_value_en: e.target.value })} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div><label className={styles.loginLabel}>EDRPOU</label><input className={styles.loginInput} value={form.edrpou_value} onChange={e => setForm({ ...form, edrpou_value: e.target.value })} /></div>
              <div><label className={styles.loginLabel}>Bank Name (UK)</label><input className={styles.loginInput} value={form.bank_name_value_uk} onChange={e => setForm({ ...form, bank_name_value_uk: e.target.value })} /></div>
              <div><label className={styles.loginLabel}>Bank Name (EN)</label><input className={styles.loginInput} value={form.bank_name_value_en} onChange={e => setForm({ ...form, bank_name_value_en: e.target.value })} /></div>
              <div><label className={styles.loginLabel}>Purpose (UK)</label><input className={styles.loginInput} value={form.purpose_value_uk} onChange={e => setForm({ ...form, purpose_value_uk: e.target.value })} /></div>
              <div><label className={styles.loginLabel}>Purpose (EN)</label><input className={styles.loginInput} value={form.purpose_value_en} onChange={e => setForm({ ...form, purpose_value_en: e.target.value })} /></div>
            </div>

            <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
            <h3 style={{ margin: '0 0 1rem', color: '#475569' }}>Stats (Homepage)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1rem' }}>
              <div><label className={styles.loginLabel}>Collected</label><input className={styles.loginInput} value={form.stats_collected} onChange={e => setForm({ ...form, stats_collected: e.target.value })} placeholder="45.2K" /></div>
              <div><label className={styles.loginLabel}>Helped</label><input className={styles.loginInput} value={form.stats_helped} onChange={e => setForm({ ...form, stats_helped: e.target.value })} placeholder="8.3K" /></div>
              <div><label className={styles.loginLabel}>Donors</label><input className={styles.loginInput} value={form.stats_donors} onChange={e => setForm({ ...form, stats_donors: e.target.value })} placeholder="8.3K" /></div>
            </div>
          </>
        )}

        {tab === 'docs' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#475569' }}>Reports / Documents</h3>
              <button type="button" onClick={addDocument} className={styles.loginButton} style={{ width: 'auto', padding: '0.4rem 1rem', margin: 0, fontSize: '0.85rem' }}>+ Add Document</button>
            </div>
            {documents.map((doc, i) => (
              <div key={doc.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'end', marginBottom: '0.5rem' }}>
                <div style={{ flex: 2 }}><label className={styles.loginLabel}>Title</label><input className={styles.loginInput} value={doc.title} onChange={e => updateDocument(i, 'title', e.target.value)} /></div>
                <div style={{ flex: 2 }}><label className={styles.loginLabel}>URL</label><input className={styles.loginInput} value={doc.url} onChange={e => updateDocument(i, 'url', e.target.value)} /></div>
                <button type="button" onClick={() => removeDocument(i)} style={{ padding: '0.5rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1px' }}>✕</button>
              </div>
            ))}
          </>
        )}

        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" disabled={saving} className={styles.loginButton} style={{ width: 'auto', padding: '0.6rem 2rem' }}>
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
