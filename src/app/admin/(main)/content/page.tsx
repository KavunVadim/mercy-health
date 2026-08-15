'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, X, FileText, SlidersHorizontal, HeartHandshake, CreditCard, FileBadge, ChevronRight, Image, ArrowLeft, ChevronDown } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { useToast } from '@/components/admin/ui/Toast';
import SupportCardEditor from '@/components/admin/SupportCardEditor';
import GalleryEditor from '@/components/admin/GalleryEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import ArrayEditor from '@/components/admin/ArrayEditor';
import HonorEditor, { type HonorData } from '@/components/admin/HonorEditor';
import RichEditor from '@/components/admin/RichEditor';
import MediaEditor from '@/components/admin/MediaEditor';

function syncArrayLength(arr: string[], targetLen: number): string[] {
  if (arr.length === targetLen) return arr;
  if (arr.length < targetLen) return [...arr, ...Array(targetLen - arr.length).fill('')];
  return arr.slice(0, targetLen);
}

function SectionCard({ icon: Icon, title, isOpen, onToggle, children }: { icon: React.ElementType; title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className={styles.settingsSection}>
      <div
        className={styles.settingsSectionHeader}
        onClick={onToggle}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <Icon size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
        <h2 className={styles.settingsSectionTitle}>{title}</h2>
        <ChevronDown
          size={16}
          strokeWidth={2}
          style={{
            marginLeft: 'auto',
            color: 'var(--admin-text-muted)',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>
      {isOpen && (
        <div className={styles.settingsSectionBody}>
          {children}
        </div>
      )}
    </div>
  );
}

interface Category {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  desc: string;
  sections?: { key: string; label: string; desc: string }[];
}

const categories: Category[] = [
  { key: 'about', label: 'Про фонд', icon: FileText, desc: 'Історія, місія, медіа, галерея, нагороди', sections: [
    { key: 'hero', label: 'Hero — банер', desc: 'Фонове зображення, бейдж, статистика, цитата' },
    { key: 'story', label: 'Історія + Таймлайн', desc: 'Текст історії, таймлайн подій, фотогалерея' },
    { key: 'honor', label: 'Почесна варта', desc: 'Блок з великою цифрою, фото шевронів' },
    { key: 'mission-media', label: 'Місія + Медіа', desc: 'Бічні вкладки з текстом і картками медіа' },
  ]},
  { key: 'hero', label: 'Головна сторінка', icon: SlidersHorizontal, desc: 'Текст головного банера', sections: [
    { key: 'text', label: 'Текст банера', desc: 'Заголовок та опис на головній' },
  ]},
  { key: 'support', label: 'Підтримка', icon: HeartHandshake, desc: 'Картки донатів та кнопки', sections: [
    { key: 'cards', label: 'Картки донатів', desc: 'Редагування карток збору' },
    { key: 'buttons', label: 'Текст кнопок', desc: 'Підписи кнопок на картках' },
  ]},
  { key: 'stats', label: 'Реквізити', icon: CreditCard, desc: 'Банківські реквізити, статистика, рахунки', sections: [
    { key: 'details', label: 'Банківські реквізити', desc: 'Отримувач, ЄДРПОУ, банк, призначення' },
    { key: 'stats-form', label: 'Статистика', desc: 'Цифри на головній сторінці' },
    { key: 'accounts', label: 'Рахунки (IBAN)', desc: 'JSON-редактор рахунків' },
  ]},
  { key: 'docs', label: 'Документи', icon: FileBadge, desc: 'Звіти та документи', sections: [
    { key: 'list', label: 'Список документів', desc: 'PDF-звіти та посилання' },
  ]},
];

export default function AdminContentPage() {
  const [form, setForm] = useState({
    about_history_title_uk: '', about_history_title_en: '',
    about_history_content_uk: '', about_history_content_en: '',
    about_mission_title_uk: '', about_mission_title_en: '',
    about_mission_content_uk: '', about_mission_content_en: '',
    about_media_title_uk: '', about_media_title_en: '',
    about_media_content_uk: '', about_media_content_en: '',
    about_story_eyebrow_uk: '', about_story_eyebrow_en: '',
    about_hero_year_uk: '', about_hero_year_en: '',
    about_hero_stats_uk: [] as { number: string; label: string }[],
    about_hero_stats_en: [] as { number: string; label: string }[],
    about_pull_quote_uk: '', about_pull_quote_en: '',
    about_timeline_uk: [] as { year: string; label: string; text: string }[],
    about_timeline_en: [] as { year: string; label: string; text: string }[],
    about_honor_uk: {} as HonorData,
    about_honor_en: {} as HonorData,
    about_gallery_eyebrow_uk: '', about_gallery_eyebrow_en: '',
    about_gallery_captions_uk: [] as string[],
    about_gallery_captions_en: [] as string[],
    hero_title_uk: '', hero_title_en: '',
    hero_description_uk: '', hero_description_en: '',
    stats_projects: '', stats_roads: '', stats_aid: '',
    beneficiary_value_uk: '', beneficiary_value_en: '',
    edrpou_value: '', bank_name_value_uk: '', bank_name_value_en: '',
    purpose_value_uk: '', purpose_value_en: '',
    card_label_monobank_uk: '', card_label_monobank_en: '',
    card_label_privatbank_uk: '', card_label_privatbank_en: '',
    card_label_details_uk: '', card_label_details_en: '',
  });
  const [aboutHeroImages, setAboutHeroImages] = useState<string[]>([]);
  const [aboutHeroImage, setAboutHeroImage] = useState<string>('');
  const [aboutPatchesImage, setAboutPatchesImage] = useState<string>('');
  const [aboutHistoryImages, setAboutHistoryImages] = useState<string[]>([]);
  const [supportCards, setSupportCards] = useState<{ id: string; title: string; description: string; bank: string; link: string; icon?: string; image?: string }[]>([]);
  const [supportCardsEn, setSupportCardsEn] = useState<{ id: string; title: string; description: string; bank: string; link: string; image?: string }[]>([]);
  const [documents, setDocuments] = useState<{ id: string; title: string; url: string }[]>([]);
  const [mediaLinks, setMediaLinks] = useState<{ id: string; image: string; source: string; title: string; description: string; date: string; url: string }[]>([]);
  const [mediaLinksEn, setMediaLinksEn] = useState<{ id: string; image: string; source: string; title: string; description: string; date: string; url: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<string>('');
  const [category, setCategory] = useState<string | null>(null);
  const [subSection, setSubSection] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { success, error } = useToast();

  function toggleSection(key: string) {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  }

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
        about_story_eyebrow_uk: d.about_story_eyebrow_uk || '',
        about_story_eyebrow_en: d.about_story_eyebrow_en || '',
        about_hero_year_uk: d.about_hero_year_uk || '',
        about_hero_year_en: d.about_hero_year_en || '',
        about_hero_stats_uk: d.about_hero_stats_uk || [],
        about_hero_stats_en: d.about_hero_stats_en || [],
        about_pull_quote_uk: d.about_pull_quote_uk || '',
        about_pull_quote_en: d.about_pull_quote_en || '',
        about_timeline_uk: d.about_timeline_uk || [],
        about_timeline_en: d.about_timeline_en || [],
        about_honor_uk: d.about_honor_uk || {},
        about_honor_en: d.about_honor_en || {},
        about_gallery_eyebrow_uk: d.about_gallery_eyebrow_uk || '',
        about_gallery_eyebrow_en: d.about_gallery_eyebrow_en || '',
        about_gallery_captions_uk: d.about_gallery_captions_uk || [],
        about_gallery_captions_en: d.about_gallery_captions_en || [],
        hero_title_uk: d.hero_title_uk || '',
        hero_title_en: d.hero_title_en || '',
        hero_description_uk: d.hero_description_uk || '',
        hero_description_en: d.hero_description_en || '',
        stats_projects: d.stats_projects || '',
        stats_roads: d.stats_roads || '',
        stats_aid: d.stats_aid || '',
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
      setAboutHeroImage(d.about_hero_image || '');
      setAboutPatchesImage(d.about_patches_image || '');
      setAboutHistoryImages(d.about_history_images || []);
      setSupportCards(d.support_cards || []);
      setSupportCardsEn(d.support_cards_en || []);
      setDocuments(d.documents || []);
      setMediaLinks(d.about_media_links_uk || []);
      setMediaLinksEn(d.about_media_links_en || []);
      setBankAccounts(d.bank_accounts ? JSON.stringify(d.bank_accounts, null, 2) : '');
      setLoaded(true);
    }).catch(() => { setLoaded(true); error('Не вдалося завантажити контент'); });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const syncCaptions = () => setForm(prev => {
      const ukLen = prev.about_gallery_captions_uk.length;
      const enLen = prev.about_gallery_captions_en.length;
      const targetLen = aboutHistoryImages.length;
      if (ukLen === targetLen && enLen === targetLen) return prev;
      return {
        ...prev,
        about_gallery_captions_uk: syncArrayLength(prev.about_gallery_captions_uk, targetLen),
        about_gallery_captions_en: syncArrayLength(prev.about_gallery_captions_en, targetLen),
      };
    });
    syncCaptions();
  }, [aboutHistoryImages.length, loaded]);

  async function saveContent() {
    setSaving(true);
    try {
      let parsedAccounts = null;
      try { parsedAccounts = bankAccounts ? JSON.parse(bankAccounts) : null; } catch {}
      const body = { 
        ...form, 
        support_cards: supportCards, 
        support_cards_en: supportCardsEn, 
        documents, 
        bank_accounts: parsedAccounts, 
        about_hero_images: aboutHeroImages, 
        about_hero_image: aboutHeroImage,
        about_patches_image: aboutPatchesImage,
        about_history_images: aboutHistoryImages,
        about_media_links_uk: mediaLinks,
        about_media_links_en: mediaLinksEn,
      };
      const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) success('Контент збережено');
      else error('Не вдалося зберегти контент');
    } catch { error('Мережева помилка'); }
    finally { setSaving(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await saveContent();
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

  function getCatLabel(key: string): string {
    return categories.find(c => c.key === key)?.label || key;
  }

  function getSectionLabel(key: string): string | undefined {
    for (const c of categories) {
      const s = c.sections?.find(s => s.key === key);
      if (s) return s.label;
    }
    return undefined;
  }

  function navigateTo(cat: string | null, sec: string | null) {
    setCategory(cat);
    setSubSection(sec);
  }

  const currentCat = category ? categories.find(c => c.key === category) : null;

  if (!loaded) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <div className={styles.pageTitleGroup}>
            <h1 className={styles.pageTitle}>Керування контентом</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`${styles.skeleton}`} style={{ height: 100, width: 200, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          {category ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => navigateTo(null, null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)', padding: 4, display: 'flex', borderRadius: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--admin-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <ArrowLeft size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => navigateTo(null, null)}>Контент</span>
                <ChevronRight size={12} />
                <span style={{ cursor: 'pointer' }} onClick={() => navigateTo(category, null)}>{getCatLabel(category)}</span>
                {subSection && (
                  <>
                    <ChevronRight size={12} />
                    <span style={{ color: 'var(--admin-text)', fontWeight: 500 }}>{getSectionLabel(subSection)}</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <h1 className={styles.pageTitle}>Керування контентом</h1>
              <p className={styles.pageSubtitle}>Виберіть розділ для редагування</p>
            </>
          )}
        </div>
        {category && (
          <div className={styles.pageActions}>
            <button form="content-form" type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
              <Check size={15} />
              {saving ? 'Збереження…' : 'Зберегти'}
            </button>
          </div>
        )}
      </div>

      {/* ── Level 1: Category Grid ── */}
      {!category && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => navigateTo(cat.key, cat.sections?.length === 1 ? cat.sections[0].key : null)}
                style={{
                  background: 'var(--admin-card-bg)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 12,
                  padding: '1.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
                  fontFamily: 'var(--admin-font)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--admin-border-hover)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--admin-border)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--admin-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}>
                  <Icon size={18} strokeWidth={2} style={{ color: 'var(--admin-text-secondary)' }} />
                </div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>{cat.label}</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--admin-text-muted)', lineHeight: 1.4 }}>{cat.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Level 2: Sub-section list ── */}
      {category && !subSection && currentCat?.sections && currentCat.sections.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {currentCat.sections.map(sec => (
            <button
              key={sec.key}
              type="button"
              onClick={() => setSubSection(sec.key)}
              style={{
                background: 'var(--admin-card-bg)',
                border: '1px solid var(--admin-border)',
                borderRadius: 10,
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                fontFamily: 'var(--admin-font)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--admin-border-hover)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--admin-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--admin-text)' }}>{sec.label}</h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--admin-text-muted)', lineHeight: 1.4 }}>{sec.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* ── Level 3: Form ── */}
      {category && subSection && (
        <form id="content-form" onSubmit={handleSave}>
          {/* ─── ABOUT: Hero ─── */}
          {category === 'about' && subSection === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <SectionCard icon={Image} title="Фонове зображення Hero" isOpen={expanded["about-hero-banner"] || false} onToggle={() => toggleSection("about-hero-banner")}>
                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                  Великий банер на всю ширину вгорі сторінки «Про фонд».
                </p>
                <ImageUploader value={aboutHeroImage} onChange={setAboutHeroImage} label="Фоновий банер Hero" />
              </SectionCard>
              <SectionCard icon={SlidersHorizontal} title="Бейдж, статистика та цитата" isOpen={expanded["about-hero-badge"] || false} onToggle={() => toggleSection("about-hero-badge")}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Бейдж «Рік» (UA)</label>
                    <input className={styles.input} value={form.about_hero_year_uk} onChange={e => setForm({ ...form, about_hero_year_uk: e.target.value })} placeholder="З 2016 року" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Бейдж «Рік» (EN)</label>
                    <input className={styles.input} value={form.about_hero_year_en} onChange={e => setForm({ ...form, about_hero_year_en: e.target.value })} placeholder="Since 2016" />
                  </div>
                </div>
                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <label className={styles.label}>Виділена цитата (UA)</label>
                  <textarea className={styles.textarea} rows={2} value={form.about_pull_quote_uk} onChange={e => setForm({ ...form, about_pull_quote_uk: e.target.value })} />
                </div>
                <div className={styles.formGroup} style={{ marginTop: '0.75rem' }}>
                  <label className={styles.label}>Виділена цитата (EN)</label>
                  <textarea className={styles.textarea} rows={2} value={form.about_pull_quote_en} onChange={e => setForm({ ...form, about_pull_quote_en: e.target.value })} />
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <ArrayEditor
                    label="Статистика (UA)"
                    itemLabel="статистику"
                    value={form.about_hero_stats_uk}
                    onChange={v => setForm({ ...form, about_hero_stats_uk: v })}
                    fields={[
                      { key: 'number', label: 'Число', placeholder: '130+' },
                      { key: 'label', label: 'Підпис', placeholder: 'реанімобілів на фронт' },
                    ]}
                  />
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <ArrayEditor
                    label="Статистика (EN)"
                    itemLabel="stat"
                    value={form.about_hero_stats_en}
                    onChange={v => setForm({ ...form, about_hero_stats_en: v })}
                    fields={[
                      { key: 'number', label: 'Число', placeholder: '130+' },
                      { key: 'label', label: 'Підпис', placeholder: 'ambulances to the front' },
                    ]}
                  />
                </div>
              </SectionCard>
            </div>
          )}

          {/* ─── ABOUT: Story + Timeline + Gallery ─── */}
          {category === 'about' && subSection === 'story' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <SectionCard icon={FileText} title="Текст історії" isOpen={expanded["about-story-text"] || false} onToggle={() => toggleSection("about-story-text")}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label className={styles.label}>Заголовок (UA)</label><input className={styles.input} value={form.about_history_title_uk} onChange={e => setForm({ ...form, about_history_title_uk: e.target.value })} /></div>
                  <div className={styles.formGroup}><label className={styles.label}>Заголовок (EN)</label><input className={styles.input} value={form.about_history_title_en} onChange={e => setForm({ ...form, about_history_title_en: e.target.value })} /></div>
                </div>
                <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                  <div className={styles.formGroup}><label className={styles.label}>Eyebrow (UA)</label><input className={styles.input} value={form.about_story_eyebrow_uk} onChange={e => setForm({ ...form, about_story_eyebrow_uk: e.target.value })} placeholder="Наша Місія" /></div>
                  <div className={styles.formGroup}><label className={styles.label}>Eyebrow (EN)</label><input className={styles.input} value={form.about_story_eyebrow_en} onChange={e => setForm({ ...form, about_story_eyebrow_en: e.target.value })} placeholder="Our Mission" /></div>
                </div>
                <div className={styles.formGroup} style={{ marginTop: '1rem' }}><label className={styles.label}>Текст історії (UA)</label><textarea className={styles.textarea} rows={10} value={form.about_history_content_uk} onChange={e => setForm({ ...form, about_history_content_uk: e.target.value })} /></div>
                <div className={styles.formGroup} style={{ marginTop: '0.75rem' }}><label className={styles.label}>Текст історії (EN)</label><textarea className={styles.textarea} rows={10} value={form.about_history_content_en} onChange={e => setForm({ ...form, about_history_content_en: e.target.value })} /></div>
              </SectionCard>
              <SectionCard icon={FileText} title="Таймлайн" isOpen={expanded["about-story-timeline"] || false} onToggle={() => toggleSection("about-story-timeline")}>
                <ArrayEditor
                  label="Таймлайн (UA)"
                  itemLabel="подію"
                  value={form.about_timeline_uk}
                  onChange={v => setForm({ ...form, about_timeline_uk: v })}
                  fields={[
                    { key: 'year', label: 'Рік', placeholder: '2016' },
                    { key: 'label', label: 'Назва', placeholder: 'Старт' },
                    { key: 'text', label: 'Опис', placeholder: 'Опис події...', type: 'textarea' },
                  ]}
                />
                <div style={{ marginTop: '1rem' }}>
                  <ArrayEditor
                    label="Таймлайн (EN)"
                    itemLabel="event"
                    value={form.about_timeline_en}
                    onChange={v => setForm({ ...form, about_timeline_en: v })}
                    fields={[
                      { key: 'year', label: 'Рік', placeholder: '2016' },
                      { key: 'label', label: 'Назва', placeholder: 'Start' },
                      { key: 'text', label: 'Опис', placeholder: 'Event description...', type: 'textarea' },
                    ]}
                  />
                </div>
              </SectionCard>
              <SectionCard icon={Image} title="Фотогалерея" isOpen={expanded["about-story-gallery"] || false} onToggle={() => toggleSection("about-story-gallery")}>
                <GalleryEditor value={aboutHistoryImages} onChange={setAboutHistoryImages} label="Зображення галереї" />
                <div className={styles.formGrid} style={{ marginTop: '1.5rem' }}>
                  <div className={styles.formGroup}><label className={styles.label}>Eyebrow (UA)</label><input className={styles.input} value={form.about_gallery_eyebrow_uk} onChange={e => setForm({ ...form, about_gallery_eyebrow_uk: e.target.value })} placeholder="Хроніка" /></div>
                  <div className={styles.formGroup}><label className={styles.label}>Eyebrow (EN)</label><input className={styles.input} value={form.about_gallery_eyebrow_en} onChange={e => setForm({ ...form, about_gallery_eyebrow_en: e.target.value })} placeholder="Chronicle" /></div>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>Підписи до фото (UA)</label>
                    {aboutHistoryImages.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', padding: '0.5rem 0' }}>Спочатку додайте фото вище.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {aboutHistoryImages.map((_, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 600, minWidth: 28 }}>#{idx + 1}</span>
                            <input className={styles.input} value={form.about_gallery_captions_uk[idx] || ''} onChange={e => { const c = [...form.about_gallery_captions_uk]; c[idx] = e.target.value; setForm({ ...form, about_gallery_captions_uk: c }); }} placeholder={`Підпис до фото ${idx + 1}`} style={{ fontSize: '0.9rem' }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>Підписи до фото (EN)</label>
                    {aboutHistoryImages.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', padding: '0.5rem 0' }}>Спочатку додайте фото вище.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {aboutHistoryImages.map((_, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 600, minWidth: 28 }}>#{idx + 1}</span>
                            <input className={styles.input} value={form.about_gallery_captions_en[idx] || ''} onChange={e => { const c = [...form.about_gallery_captions_en]; c[idx] = e.target.value; setForm({ ...form, about_gallery_captions_en: c }); }} placeholder={`Підпис до фото ${idx + 1}`} style={{ fontSize: '0.9rem' }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ─── ABOUT: Honor ─── */}
          {category === 'about' && subSection === 'honor' && (
            <SectionCard icon={Image} title="Почесна варта" isOpen={expanded["about-honor"] || false} onToggle={() => toggleSection("about-honor")}>
              <ImageUploader value={aboutPatchesImage} onChange={setAboutPatchesImage} label="Фото шевронів" />
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <HonorEditor label="Дані (UA)" lang="uk" value={form.about_honor_uk} onChange={v => setForm({ ...form, about_honor_uk: v })} />
                <HonorEditor label="Дані (EN)" lang="en" value={form.about_honor_en} onChange={v => setForm({ ...form, about_honor_en: v })} />
              </div>
            </SectionCard>
          )}

          {/* ─── ABOUT: Mission + Media ─── */}
          {category === 'about' && subSection === 'mission-media' && (
            <SectionCard icon={FileText} title="Місія + Медіа" isOpen={expanded["about-mission-media"] || false} onToggle={() => toggleSection("about-mission-media")}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label className={styles.label}>Заголовок «Місія» (UA)</label><input className={styles.input} value={form.about_mission_title_uk} onChange={e => setForm({ ...form, about_mission_title_uk: e.target.value })} /></div>
                <div className={styles.formGroup}><label className={styles.label}>Заголовок «Місія» (EN)</label><input className={styles.input} value={form.about_mission_title_en} onChange={e => setForm({ ...form, about_mission_title_en: e.target.value })} /></div>
              </div>
              <RichEditor label="Текст «Місія» (UA)" value={form.about_mission_content_uk} onChange={v => setForm({ ...form, about_mission_content_uk: v })} height={200} />
              <RichEditor label="Текст «Місія» (EN)" value={form.about_mission_content_en} onChange={v => setForm({ ...form, about_mission_content_en: v })} height={200} />
              <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label className={styles.label}>Заголовок «Медіа» (UA)</label><input className={styles.input} value={form.about_media_title_uk} onChange={e => setForm({ ...form, about_media_title_uk: e.target.value })} /></div>
                <div className={styles.formGroup}><label className={styles.label}>Заголовок «Медіа» (EN)</label><input className={styles.input} value={form.about_media_title_en} onChange={e => setForm({ ...form, about_media_title_en: e.target.value })} /></div>
              </div>
              <RichEditor label="Текст «Медіа» (UA)" value={form.about_media_content_uk} onChange={v => setForm({ ...form, about_media_content_uk: v })} height={200} />
              <RichEditor label="Текст «Медіа» (EN)" value={form.about_media_content_en} onChange={v => setForm({ ...form, about_media_content_en: v })} height={200} />
              <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.75rem' }}>
                Картки медіа про нас. Кожна картка містить зображення, назву видання, заголовок, опис, дату та посилання.
              </p>
              <MediaEditor items={mediaLinks} itemsEn={mediaLinksEn} onItemsChange={setMediaLinks} onItemsEnChange={setMediaLinksEn} onSave={saveContent} />
            </SectionCard>
          )}

          {/* ─── HERO ─── */}
          {category === 'hero' && subSection === 'text' && (
            <SectionCard icon={SlidersHorizontal} title="Текст головного банера" isOpen={expanded["hero-text"] || false} onToggle={() => toggleSection("hero-text")}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label className={styles.label}>Заголовок (UA)</label><input className={styles.input} value={form.hero_title_uk} onChange={e => setForm({ ...form, hero_title_uk: e.target.value })} /></div>
                <div className={styles.formGroup}><label className={styles.label}>Заголовок (EN)</label><input className={styles.input} value={form.hero_title_en} onChange={e => setForm({ ...form, hero_title_en: e.target.value })} /></div>
              </div>
              <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                <div className={styles.formGroup}><label className={styles.label}>Опис (UA)</label><textarea className={styles.textarea} rows={3} value={form.hero_description_uk} onChange={e => setForm({ ...form, hero_description_uk: e.target.value })} /></div>
                <div className={styles.formGroup}><label className={styles.label}>Опис (EN)</label><textarea className={styles.textarea} rows={3} value={form.hero_description_en} onChange={e => setForm({ ...form, hero_description_en: e.target.value })} /></div>
              </div>
            </SectionCard>
          )}

          {/* ─── SUPPORT: Cards ─── */}
          {category === 'support' && subSection === 'cards' && (
            <SectionCard icon={HeartHandshake} title="Картки донатів" isOpen={expanded["support-cards"] || false} onToggle={() => toggleSection("support-cards")}>
              <SupportCardEditor cards={supportCards} cardsEn={supportCardsEn} onCardsChange={setSupportCards} onCardsEnChange={setSupportCardsEn} />
            </SectionCard>
          )}

          {/* ─── SUPPORT: Buttons ─── */}
          {category === 'support' && subSection === 'buttons' && (
            <SectionCard icon={HeartHandshake} title="Текст кнопок на картках" isOpen={expanded["support-buttons"] || false} onToggle={() => toggleSection("support-buttons")}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label className={styles.label}>Monobank (UA)</label><input className={styles.input} value={form.card_label_monobank_uk} onChange={e => setForm({ ...form, card_label_monobank_uk: e.target.value })} placeholder="Підтримати на Monobank" /></div>
                <div className={styles.formGroup}><label className={styles.label}>Monobank (EN)</label><input className={styles.input} value={form.card_label_monobank_en} onChange={e => setForm({ ...form, card_label_monobank_en: e.target.value })} placeholder="Support on Monobank" /></div>
                <div className={styles.formGroup}><label className={styles.label}>PrivatBank (UA)</label><input className={styles.input} value={form.card_label_privatbank_uk} onChange={e => setForm({ ...form, card_label_privatbank_uk: e.target.value })} placeholder="Переказати через Приват24" /></div>
                <div className={styles.formGroup}><label className={styles.label}>PrivatBank (EN)</label><input className={styles.input} value={form.card_label_privatbank_en} onChange={e => setForm({ ...form, card_label_privatbank_en: e.target.value })} placeholder="Transfer via Privat24" /></div>
                <div className={styles.formGroup}><label className={styles.label}>«Інші банки» (UA)</label><input className={styles.input} value={form.card_label_details_uk} onChange={e => setForm({ ...form, card_label_details_uk: e.target.value })} placeholder="Переглянути деталі" /></div>
                <div className={styles.formGroup}><label className={styles.label}>«Інші банки» (EN)</label><input className={styles.input} value={form.card_label_details_en} onChange={e => setForm({ ...form, card_label_details_en: e.target.value })} placeholder="View details" /></div>
              </div>
            </SectionCard>
          )}

          {/* ─── STATS: Bank details ─── */}
          {category === 'stats' && subSection === 'details' && (
            <SectionCard icon={CreditCard} title="Банківські реквізити" isOpen={expanded["stats-details"] || false} onToggle={() => toggleSection("stats-details")}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label className={styles.label}>Отримувач (UA)</label><input className={styles.input} value={form.beneficiary_value_uk} onChange={e => setForm({ ...form, beneficiary_value_uk: e.target.value })} /></div>
                <div className={styles.formGroup}><label className={styles.label}>Отримувач (EN)</label><input className={styles.input} value={form.beneficiary_value_en} onChange={e => setForm({ ...form, beneficiary_value_en: e.target.value })} /></div>
              </div>
              <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                <div className={styles.formGroup}><label className={styles.label}>ЄДРПОУ</label><input className={styles.input} value={form.edrpou_value} onChange={e => setForm({ ...form, edrpou_value: e.target.value })} /></div>
                <div className={styles.formGroup}><label className={styles.label}>Назва банку (UA)</label><input className={styles.input} value={form.bank_name_value_uk} onChange={e => setForm({ ...form, bank_name_value_uk: e.target.value })} /></div>
                <div className={styles.formGroup}><label className={styles.label}>Назва банку (EN)</label><input className={styles.input} value={form.bank_name_value_en} onChange={e => setForm({ ...form, bank_name_value_en: e.target.value })} /></div>
                <div className={styles.formGroup}><label className={styles.label}>Призначення (UA)</label><input className={styles.input} value={form.purpose_value_uk} onChange={e => setForm({ ...form, purpose_value_uk: e.target.value })} /></div>
                <div className={styles.formGroup}><label className={styles.label}>Призначення (EN)</label><input className={styles.input} value={form.purpose_value_en} onChange={e => setForm({ ...form, purpose_value_en: e.target.value })} /></div>
              </div>
            </SectionCard>
          )}

          {/* ─── STATS: Stats form ─── */}
          {category === 'stats' && subSection === 'stats-form' && (
            <SectionCard icon={CreditCard} title="Статистика (головна сторінка)" isOpen={expanded["stats-form"] || false} onToggle={() => toggleSection("stats-form")}>
              <div className={styles.formGrid3}>
                <div className={styles.formGroup}><label className={styles.label}>Проєкти</label><input className={styles.input} value={form.stats_projects} onChange={e => setForm({ ...form, stats_projects: e.target.value })} placeholder="12" /></div>
                <div className={styles.formGroup}><label className={styles.label}>Дороги (км)</label><input className={styles.input} value={form.stats_roads} onChange={e => setForm({ ...form, stats_roads: e.target.value })} placeholder="550 000+" /></div>
                <div className={styles.formGroup}><label className={styles.label}>Допомога (тонн)</label><input className={styles.input} value={form.stats_aid} onChange={e => setForm({ ...form, stats_aid: e.target.value })} placeholder="370+" /></div>
              </div>
            </SectionCard>
          )}

          {/* ─── STATS: Accounts ─── */}
          {category === 'stats' && subSection === 'accounts' && (
            <SectionCard icon={CreditCard} title="Рахунки (IBAN / Crypto)" isOpen={expanded["stats-accounts"] || false} onToggle={() => toggleSection("stats-accounts")}>
              <p className={styles.pageSubtitle} style={{ marginBottom: '0.75rem' }}>
                {String.raw`Редагуйте банківські рахунки у форматі JSON. Формат: {"ua": [{"id": "ua_privat", "label": "PrivatBank", "value": "UA..."}]}`}
              </p>
              <textarea
                className={styles.input}
                rows={14}
                value={bankAccounts}
                onChange={e => setBankAccounts(e.target.value)}
                style={{ fontFamily: 'var(--admin-mono)', fontSize: '0.8rem', resize: 'vertical', width: '100%' }}
              />
            </SectionCard>
          )}

          {/* ─── DOCS ─── */}
          {category === 'docs' && subSection === 'list' && (
            <SectionCard icon={FileBadge} title="Звіти / Документи" isOpen={expanded["docs-list"] || false} onToggle={() => toggleSection("docs-list")}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button type="button" onClick={addDocument} className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>
                  <Plus size={14} /> Додати документ
                </button>
              </div>
              {documents.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem 0' }}>Ще немає документів.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {documents.map((doc, i) => (
                    <div key={doc.id} className={styles.card} style={{ background: 'var(--admin-secondary)' }}>
                      <div className={styles.cardContent} style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'end' }}>
                          <div className={styles.formGroup} style={{ flex: 2 }}><label className={styles.label}>Назва</label><input className={styles.input} value={doc.title} onChange={e => updateDocument(i, 'title', e.target.value)} /></div>
                          <div className={styles.formGroup} style={{ flex: 2 }}><label className={styles.label}>Посилання</label><input className={styles.input} value={doc.url} onChange={e => updateDocument(i, 'url', e.target.value)} /></div>
                          <button type="button" onClick={() => removeDocument(i)} className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`} style={{ marginBottom: '1px' }}>
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`} style={{ minWidth: 140 }}>
              <Check size={15} />
            {saving ? 'Збереження…' : 'Зберегти контент'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
