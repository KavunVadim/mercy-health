'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, X, FileText, SlidersHorizontal, HeartHandshake, CreditCard, FileBadge, Image } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { useToast } from '@/components/admin/ui/Toast';
import SupportCardEditor from '@/components/admin/SupportCardEditor';
import GalleryEditor from '@/components/admin/GalleryEditor';

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
    card_label_monobank_uk: '', card_label_monobank_en: '',
    card_label_privatbank_uk: '', card_label_privatbank_en: '',
    card_label_details_uk: '', card_label_details_en: '',
  });
  const [aboutHeroImages, setAboutHeroImages] = useState<string[]>([]);
  const [aboutHistoryImages, setAboutHistoryImages] = useState<string[]>([]);
  const [supportCards, setSupportCards] = useState<{ id: string; title: string; description: string; bank: string; link: string; icon?: string; image?: string }[]>([]);
  const [supportCardsEn, setSupportCardsEn] = useState<{ id: string; title: string; description: string; bank: string; link: string; image?: string }[]>([]);
  const [documents, setDocuments] = useState<{ id: string; title: string; url: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<string>('');
  const [tab, setTab] = useState<'about' | 'hero' | 'support' | 'stats' | 'docs'>('about');
  const { success, error } = useToast();

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
        card_label_monobank_uk: d.card_label_monobank_uk || '',
        card_label_monobank_en: d.card_label_monobank_en || '',
        card_label_privatbank_uk: d.card_label_privatbank_uk || '',
        card_label_privatbank_en: d.card_label_privatbank_en || '',
        card_label_details_uk: d.card_label_details_uk || '',
        card_label_details_en: d.card_label_details_en || '',
      });
      setAboutHeroImages(d.about_hero_images || []);
      setAboutHistoryImages(d.about_history_images || []);
      setSupportCards(d.support_cards || []);
      setSupportCardsEn(d.support_cards_en || []);
      setDocuments(d.documents || []);
      setBankAccounts(d.bank_accounts ? JSON.stringify(d.bank_accounts, null, 2) : '');
      setLoaded(true);
    }).catch(() => { setLoaded(true); error('Failed to load content'); });
  }, [error]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let parsedAccounts = null;
      try { parsedAccounts = bankAccounts ? JSON.parse(bankAccounts) : null; } catch {}
      const body = { ...form, support_cards: supportCards, support_cards_en: supportCardsEn, documents, bank_accounts: parsedAccounts, about_hero_images: aboutHeroImages, about_history_images: aboutHistoryImages };
      const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) success('Content saved successfully');
      else error('Failed to save content');
    } catch { error('Network error'); }
    finally { setSaving(false); }
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

  const tabs = [
    { key: 'about' as const, label: 'About Page', icon: FileText },
    { key: 'hero' as const, label: 'Hero Text', icon: SlidersHorizontal },
    { key: 'support' as const, label: 'Support Cards', icon: HeartHandshake },
    { key: 'stats' as const, label: 'Bank Details', icon: CreditCard },
    { key: 'docs' as const, label: 'Documents', icon: FileBadge },
  ];

  if (!loaded) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <div className={styles.pageTitleGroup}>
            <h1 className={styles.pageTitle}>Content Pages</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`${styles.skeleton}`} style={{ height: 36, width: 100, borderRadius: 8 }} />
          ))}
        </div>
        {[1, 2].map(i => (
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
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Content Pages</h1>
          <p className={styles.pageSubtitle}>Manage about page, hero text, donation cards, bank details and documents</p>
        </div>
        <div className={styles.pageActions}>
          <button form="content-form" type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
            <Check size={15} />
            {saving ? 'Saving…' : 'Save Content'}
          </button>
        </div>
      </div>

      <div className={styles.contentTabsLayout}>
        {/* Tab bar - horizontal on mobile, vertical sidebar on desktop */}
        <div className={styles.contentTabsSidebar}>
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`${styles.contentTabBtn} ${tab === t.key ? styles.contentTabBtnActive : ''}`}
                title={tab !== t.key ? t.label : undefined}>
                <Icon size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span className={styles.contentTabLabel}>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <form id="content-form" onSubmit={handleSave} style={{ flex: 1, minWidth: 0 }}>
          {tab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <Image size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>About Us Hero Images</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <GalleryEditor
                    value={aboutHeroImages}
                    onChange={setAboutHeroImages}
                    label="Hero Gallery"
                  />
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <FileText size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>History</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label className={styles.label}>Title (Ukrainian)</label><input className={styles.input} value={form.about_history_title_uk} onChange={e => setForm({ ...form, about_history_title_uk: e.target.value })} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Title (English)</label><input className={styles.input} value={form.about_history_title_en} onChange={e => setForm({ ...form, about_history_title_en: e.target.value })} /></div>
                  </div>
                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}><label className={styles.label}>Content (Ukrainian)</label><textarea className={styles.textarea} rows={10} value={form.about_history_content_uk} onChange={e => setForm({ ...form, about_history_content_uk: e.target.value })} /></div>
                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}><label className={styles.label}>Content (English)</label><textarea className={styles.textarea} rows={10} value={form.about_history_content_en} onChange={e => setForm({ ...form, about_history_content_en: e.target.value })} /></div>
                  <div style={{ marginTop: '1rem' }}>
                    <GalleryEditor
                      value={aboutHistoryImages}
                      onChange={setAboutHistoryImages}
                      label="History Gallery (appears within the text)"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <FileText size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Mission</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label className={styles.label}>Title (Ukrainian)</label><input className={styles.input} value={form.about_mission_title_uk} onChange={e => setForm({ ...form, about_mission_title_uk: e.target.value })} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Title (English)</label><input className={styles.input} value={form.about_mission_title_en} onChange={e => setForm({ ...form, about_mission_title_en: e.target.value })} /></div>
                  </div>
                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}><label className={styles.label}>Content (Ukrainian)</label><textarea className={styles.textarea} rows={4} value={form.about_mission_content_uk} onChange={e => setForm({ ...form, about_mission_content_uk: e.target.value })} /></div>
                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}><label className={styles.label}>Content (English)</label><textarea className={styles.textarea} rows={4} value={form.about_mission_content_en} onChange={e => setForm({ ...form, about_mission_content_en: e.target.value })} /></div>
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <FileText size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Media About Us</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label className={styles.label}>Title (Ukrainian)</label><input className={styles.input} value={form.about_media_title_uk} onChange={e => setForm({ ...form, about_media_title_uk: e.target.value })} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Title (English)</label><input className={styles.input} value={form.about_media_title_en} onChange={e => setForm({ ...form, about_media_title_en: e.target.value })} /></div>
                  </div>
                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}><label className={styles.label}>Content (Ukrainian)</label><textarea className={styles.textarea} rows={4} value={form.about_media_content_uk} onChange={e => setForm({ ...form, about_media_content_uk: e.target.value })} /></div>
                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}><label className={styles.label}>Content (English)</label><textarea className={styles.textarea} rows={4} value={form.about_media_content_en} onChange={e => setForm({ ...form, about_media_content_en: e.target.value })} /></div>
                </div>
              </div>
            </div>
          )}

          {tab === 'hero' && (
            <div className={styles.settingsSection}>
              <div className={styles.settingsSectionHeader}>
                <SlidersHorizontal size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                <h2 className={styles.settingsSectionTitle}>Hero Section Text</h2>
              </div>
              <div className={styles.settingsSectionBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label className={styles.label}>Title (Ukrainian)</label><input className={styles.input} value={form.hero_title_uk} onChange={e => setForm({ ...form, hero_title_uk: e.target.value })} /></div>
                  <div className={styles.formGroup}><label className={styles.label}>Title (English)</label><input className={styles.input} value={form.hero_title_en} onChange={e => setForm({ ...form, hero_title_en: e.target.value })} /></div>
                </div>
                <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                  <div className={styles.formGroup}><label className={styles.label}>Description (Ukrainian)</label><textarea className={styles.textarea} rows={3} value={form.hero_description_uk} onChange={e => setForm({ ...form, hero_description_uk: e.target.value })} /></div>
                  <div className={styles.formGroup}><label className={styles.label}>Description (English)</label><textarea className={styles.textarea} rows={3} value={form.hero_description_en} onChange={e => setForm({ ...form, hero_description_en: e.target.value })} /></div>
                </div>
              </div>
            </div>
          )}

          {tab === 'support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <HeartHandshake size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Donation Cards</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <SupportCardEditor
                    cards={supportCards}
                    cardsEn={supportCardsEn}
                    onCardsChange={setSupportCards}
                    onCardsEnChange={setSupportCardsEn}
                  />
                </div>
              </div>
              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <HeartHandshake size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Card Button Labels</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Monobank button (UK)</label>
                      <input className={styles.input} value={form.card_label_monobank_uk} onChange={e => setForm({ ...form, card_label_monobank_uk: e.target.value })} placeholder="Підтримати на Monobank" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Monobank button (EN)</label>
                      <input className={styles.input} value={form.card_label_monobank_en} onChange={e => setForm({ ...form, card_label_monobank_en: e.target.value })} placeholder="Support on Monobank" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>PrivatBank button (UK)</label>
                      <input className={styles.input} value={form.card_label_privatbank_uk} onChange={e => setForm({ ...form, card_label_privatbank_uk: e.target.value })} placeholder="Переказати через Приват24" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>PrivatBank button (EN)</label>
                      <input className={styles.input} value={form.card_label_privatbank_en} onChange={e => setForm({ ...form, card_label_privatbank_en: e.target.value })} placeholder="Transfer via Privat24" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Other banks button (UK)</label>
                      <input className={styles.input} value={form.card_label_details_uk} onChange={e => setForm({ ...form, card_label_details_uk: e.target.value })} placeholder="Переглянути деталі" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Other banks button (EN)</label>
                      <input className={styles.input} value={form.card_label_details_en} onChange={e => setForm({ ...form, card_label_details_en: e.target.value })} placeholder="View details" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <CreditCard size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Bank Details</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label className={styles.label}>Beneficiary (UK)</label><input className={styles.input} value={form.beneficiary_value_uk} onChange={e => setForm({ ...form, beneficiary_value_uk: e.target.value })} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Beneficiary (EN)</label><input className={styles.input} value={form.beneficiary_value_en} onChange={e => setForm({ ...form, beneficiary_value_en: e.target.value })} /></div>
                  </div>
                  <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                    <div className={styles.formGroup}><label className={styles.label}>EDRPOU</label><input className={styles.input} value={form.edrpou_value} onChange={e => setForm({ ...form, edrpou_value: e.target.value })} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Bank Name (UK)</label><input className={styles.input} value={form.bank_name_value_uk} onChange={e => setForm({ ...form, bank_name_value_uk: e.target.value })} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Bank Name (EN)</label><input className={styles.input} value={form.bank_name_value_en} onChange={e => setForm({ ...form, bank_name_value_en: e.target.value })} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Purpose (UK)</label><input className={styles.input} value={form.purpose_value_uk} onChange={e => setForm({ ...form, purpose_value_uk: e.target.value })} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Purpose (EN)</label><input className={styles.input} value={form.purpose_value_en} onChange={e => setForm({ ...form, purpose_value_en: e.target.value })} /></div>
                  </div>
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <CreditCard size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Stats (Homepage)</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <div className={styles.formGrid3}>
                    <div className={styles.formGroup}><label className={styles.label}>Collected</label><input className={styles.input} value={form.stats_collected} onChange={e => setForm({ ...form, stats_collected: e.target.value })} placeholder="45.2K" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Helped</label><input className={styles.input} value={form.stats_helped} onChange={e => setForm({ ...form, stats_helped: e.target.value })} placeholder="8.3K" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Donors</label><input className={styles.input} value={form.stats_donors} onChange={e => setForm({ ...form, stats_donors: e.target.value })} placeholder="8.3K" /></div>
                  </div>
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <CreditCard size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Bank Accounts (IBAN / Crypto)</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <p className={styles.pageSubtitle} style={{ marginBottom: '0.75rem' }}>
                    Edit bank account details as JSON. Format: {'{'}"ua": [{'{'}"id": "ua_privat", "label": "PrivatBank", "value": "UA..."{'}'}]{'}'}
                  </p>
                  <textarea
                    className={styles.input}
                    rows={14}
                    value={bankAccounts}
                    onChange={e => setBankAccounts(e.target.value)}
                    style={{ fontFamily: 'var(--admin-mono)', fontSize: '0.8rem', resize: 'vertical', width: '100%' }}
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'docs' && (
            <div className={styles.settingsSection}>
              <div className={styles.settingsSectionHeader}>
                <FileBadge size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                <h2 className={styles.settingsSectionTitle}>Reports / Documents</h2>
              </div>
              <div className={styles.settingsSectionBody}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <button type="button" onClick={addDocument} className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>
                    <Plus size={14} /> Add Document
                  </button>
                </div>
                {documents.length === 0 ? (
                  <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem 0' }}>No documents yet. Click "Add Document" to create one.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {documents.map((doc, i) => (
                      <div key={doc.id} className={styles.card} style={{ background: 'var(--admin-secondary)' }}>
                        <div className={styles.cardContent} style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'end' }}>
                            <div className={styles.formGroup} style={{ flex: 2 }}><label className={styles.label}>Title</label><input className={styles.input} value={doc.title} onChange={e => updateDocument(i, 'title', e.target.value)} /></div>
                            <div className={styles.formGroup} style={{ flex: 2 }}><label className={styles.label}>URL</label><input className={styles.input} value={doc.url} onChange={e => updateDocument(i, 'url', e.target.value)} /></div>
                            <button type="button" onClick={() => removeDocument(i)} className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`} style={{ marginBottom: '1px' }}>
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`} style={{ minWidth: 140 }}>
              <Check size={15} />
              {saving ? 'Saving…' : 'Save Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
