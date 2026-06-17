'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, X, FileText, SlidersHorizontal, HeartHandshake, CreditCard, FileBadge, Image } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { useToast } from '@/components/admin/ui/Toast';
import SupportCardEditor from '@/components/admin/SupportCardEditor';
import GalleryEditor from '@/components/admin/GalleryEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import ArrayEditor from '@/components/admin/ArrayEditor';
import HonorEditor from '@/components/admin/HonorEditor';
import RichEditor from '@/components/admin/RichEditor';
import MediaEditor from '@/components/admin/MediaEditor';

function syncArrayLength(arr: string[], targetLen: number): string[] {
  if (arr.length === targetLen) return arr;
  if (arr.length < targetLen) return [...arr, ...Array(targetLen - arr.length).fill('')];
  return arr.slice(0, targetLen);
}

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
    about_honor_uk: {} as any,
    about_honor_en: {} as any,
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

  // Sync caption arrays to match gallery image count
  useEffect(() => {
    if (!loaded) return;
    setForm(prev => {
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
  }, [aboutHistoryImages.length, loaded]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
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
    { key: 'about' as const, label: 'Сторінка «Про фонд»', icon: FileText },
    { key: 'hero' as const, label: 'Герой (текст)', icon: SlidersHorizontal },
    { key: 'support' as const, label: 'Картки донатів', icon: HeartHandshake },
    { key: 'stats' as const, label: 'Банківські реквізити', icon: CreditCard },
    { key: 'docs' as const, label: 'Документи', icon: FileBadge },
  ];

  if (!loaded) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <div className={styles.pageTitleGroup}>
            <h1 className={styles.pageTitle}>Керування контентом</h1>
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
            <h1 className={styles.pageTitle}>Керування контентом</h1>
            <p className={styles.pageSubtitle}>Редагуйте сторінки: «Про фонд», герой, картки донатів, реквізити та документи</p>
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

              {/* ─── 1. Hero Section ─── */}
              <div id="sec-1" className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <Image size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>1. Hero — повноекранний банер</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                    Це зображення показується як великий банер на всю ширину вгорі сторінки «Про фонд».
                  </p>
                  <ImageUploader
                    value={aboutHeroImage}
                    onChange={setAboutHeroImage}
                    label="Фоновий банер Hero"
                  />
                </div>
              </div>

              {/* ─── 2. Hero Stats + Year Badge + Pull Quote ─── */}
              <div id="sec-2" className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <SlidersHorizontal size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>2. Hero — бейдж, статистика, цитата</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                    Ці тексти з'являються поверх банера: бейдж з роком (вгорі справа), ряд статистики (внизу) та виділена цитата.
                  </p>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Бейдж «Рік» (UA) — зверху справа</label>
                      <input className={styles.input} value={form.about_hero_year_uk} onChange={e => setForm({ ...form, about_hero_year_uk: e.target.value })} placeholder="З 2016 року" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Бейдж «Рік» (EN)</label>
                      <input className={styles.input} value={form.about_hero_year_en} onChange={e => setForm({ ...form, about_hero_year_en: e.target.value })} placeholder="Since 2016" />
                    </div>
                  </div>
                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                    <label className={styles.label}>Виділена цитата (UA) — в розділі історії</label>
                    <textarea className={styles.textarea} rows={2} value={form.about_pull_quote_uk} onChange={e => setForm({ ...form, about_pull_quote_uk: e.target.value })} />
                  </div>
                  <div className={styles.formGroup} style={{ marginTop: '0.75rem' }}>
                    <label className={styles.label}>Виділена цитата (EN)</label>
                    <textarea className={styles.textarea} rows={2} value={form.about_pull_quote_en} onChange={e => setForm({ ...form, about_pull_quote_en: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* ─── 3. Hero Stats ─── */}
              <div id="sec-3" className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <FileText size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>3. Статистика на банері</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                    Додавайте статистику, яка з'являється внизу банера на сторінці &laquo;Про фонд&raquo;.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                </div>
              </div>

              {/* ─── 4. Story Section — History Text + Timeline ─── */}
              <div id="sec-4" className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <FileText size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>4. Історія — текст + таймлайн</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label className={styles.label}>Заголовок секції (UA)</label><input className={styles.input} value={form.about_history_title_uk} onChange={e => setForm({ ...form, about_history_title_uk: e.target.value })} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Заголовок секції (EN)</label><input className={styles.input} value={form.about_history_title_en} onChange={e => setForm({ ...form, about_history_title_en: e.target.value })} /></div>
                  </div>
                  <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                    <div className={styles.formGroup}><label className={styles.label}>Малий підпис (UA) — над заголовком</label><input className={styles.input} value={form.about_story_eyebrow_uk} onChange={e => setForm({ ...form, about_story_eyebrow_uk: e.target.value })} placeholder="Наша Місія" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Малий підпис (EN)</label><input className={styles.input} value={form.about_story_eyebrow_en} onChange={e => setForm({ ...form, about_story_eyebrow_en: e.target.value })} placeholder="Our Mission" /></div>
                  </div>
                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}><label className={styles.label}>Текст історії (UA) — абзаци через пустий рядок</label><textarea className={styles.textarea} rows={10} value={form.about_history_content_uk} onChange={e => setForm({ ...form, about_history_content_uk: e.target.value })} /></div>
                  <div className={styles.formGroup} style={{ marginTop: '0.75rem' }}><label className={styles.label}>Текст історії (EN)</label><textarea className={styles.textarea} rows={10} value={form.about_history_content_en} onChange={e => setForm({ ...form, about_history_content_en: e.target.value })} /></div>
                </div>
              </div>

              {/* ─── 5. Timeline ─── */}
              <div id="sec-5" className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <FileText size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>5. Таймлайн — хронологія подій</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                    Ключові дати з історії фонду. Відображаються в лівій колонці розділу історії.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                </div>
              </div>

              {/* ─── 6. Honor Section ─── */}
              <div id="sec-6" className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <Image size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>6. Блок «Почесна варта» — темний блок з великою цифрою</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                    Блок із флагманським проєктом: велика цифра, опис, теги та фото шевронів.
                  </p>
                  <ImageUploader
                    value={aboutPatchesImage}
                    onChange={setAboutPatchesImage}
                    label="Фото шевронів / Wall of Honor"
                  />
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <HonorEditor
                      label="Дані (UA)"
                      value={form.about_honor_uk}
                      onChange={v => setForm({ ...form, about_honor_uk: v })}
                    />
                    <HonorEditor
                      label="Дані (EN)"
                      value={form.about_honor_en}
                      onChange={v => setForm({ ...form, about_honor_en: v })}
                    />
                  </div>
                </div>
              </div>

              {/* ─── 7. Photo Gallery ─── */}
              <div id="sec-7" className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <Image size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>7. Фотогалерея — сітка світлин</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.75rem' }}>
                    Завантажте зображення для галереї. Порядок визначає розташування в сітці.
                  </p>
                  <GalleryEditor
                    value={aboutHistoryImages}
                    onChange={setAboutHistoryImages}
                    label="Зображення галереї"
                  />
                  <div className={styles.formGrid} style={{ marginTop: '1.5rem' }}>
                    <div className={styles.formGroup}><label className={styles.label}>Малий підпис (UA)</label><input className={styles.input} value={form.about_gallery_eyebrow_uk} onChange={e => setForm({ ...form, about_gallery_eyebrow_uk: e.target.value })} placeholder="Хроніка" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Малий підпис (EN)</label><input className={styles.input} value={form.about_gallery_eyebrow_en} onChange={e => setForm({ ...form, about_gallery_eyebrow_en: e.target.value })} placeholder="Chronicle" /></div>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>
                        Підписи до фото (UA)
                      </label>
                      {aboutHistoryImages.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', padding: '0.5rem 0' }}>
                          Спочатку додайте фото вище, потім з&apos;являться поля для підписів.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {aboutHistoryImages.map((_, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 600, minWidth: 28 }}>#{idx + 1}</span>
                              <input
                                className={styles.input}
                                value={form.about_gallery_captions_uk[idx] || ''}
                                onChange={e => {
                                  const c = [...form.about_gallery_captions_uk];
                                  c[idx] = e.target.value;
                                  setForm({ ...form, about_gallery_captions_uk: c });
                                }}
                                placeholder={`Підпис до фото ${idx + 1}`}
                                style={{ fontSize: '0.9rem' }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>
                        Підписи до фото (EN)
                      </label>
                      {aboutHistoryImages.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', padding: '0.5rem 0' }}>
                          Спочатку додайте фото вище.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {aboutHistoryImages.map((_, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 600, minWidth: 28 }}>#{idx + 1}</span>
                              <input
                                className={styles.input}
                                value={form.about_gallery_captions_en[idx] || ''}
                                onChange={e => {
                                  const c = [...form.about_gallery_captions_en];
                                  c[idx] = e.target.value;
                                  setForm({ ...form, about_gallery_captions_en: c });
                                }}
                                placeholder={`Підпис до фото ${idx + 1}`}
                                style={{ fontSize: '0.9rem' }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── 8. Mission + Media (sidebar tabs) ─── */}
              <div id="sec-8" className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <FileText size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>8. Місія + Медіа — бічні вкладки</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.75rem' }}>
                    Ці секції відображаються при перемиканні бічних вкладок (Місія / Медіа про нас).
                  </p>
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
                  <MediaEditor
                    items={mediaLinks}
                    itemsEn={mediaLinksEn}
                    onItemsChange={setMediaLinks}
                    onItemsEnChange={setMediaLinksEn}
                  />
                </div>
              </div>

            </div>
          )}

          {tab === 'hero' && (
            <div className={styles.settingsSection}>
              <div className={styles.settingsSectionHeader}>
                <SlidersHorizontal size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                <h2 className={styles.settingsSectionTitle}>Текст головного банера</h2>
              </div>
              <div className={styles.settingsSectionBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label className={styles.label}>Заголовок (UA)</label><input className={styles.input} value={form.hero_title_uk} onChange={e => setForm({ ...form, hero_title_uk: e.target.value })} /></div>
                  <div className={styles.formGroup}><label className={styles.label}>Заголовок (EN)</label><input className={styles.input} value={form.hero_title_en} onChange={e => setForm({ ...form, hero_title_en: e.target.value })} /></div>
                </div>
                <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                  <div className={styles.formGroup}><label className={styles.label}>Опис (UA)</label><textarea className={styles.textarea} rows={3} value={form.hero_description_uk} onChange={e => setForm({ ...form, hero_description_uk: e.target.value })} /></div>
                  <div className={styles.formGroup}><label className={styles.label}>Опис (EN)</label><textarea className={styles.textarea} rows={3} value={form.hero_description_en} onChange={e => setForm({ ...form, hero_description_en: e.target.value })} /></div>
                </div>
              </div>
            </div>
          )}

          {tab === 'support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <HeartHandshake size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Картки для донатів</h2>
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
                  <h2 className={styles.settingsSectionTitle}>Текст кнопок на картках</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Кнопка Monobank (UA)</label>
                      <input className={styles.input} value={form.card_label_monobank_uk} onChange={e => setForm({ ...form, card_label_monobank_uk: e.target.value })} placeholder="Підтримати на Monobank" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Кнопка Monobank (EN)</label>
                      <input className={styles.input} value={form.card_label_monobank_en} onChange={e => setForm({ ...form, card_label_monobank_en: e.target.value })} placeholder="Support on Monobank" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Кнопка PrivatBank (UA)</label>
                      <input className={styles.input} value={form.card_label_privatbank_uk} onChange={e => setForm({ ...form, card_label_privatbank_uk: e.target.value })} placeholder="Переказати через Приват24" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Кнопка PrivatBank (EN)</label>
                      <input className={styles.input} value={form.card_label_privatbank_en} onChange={e => setForm({ ...form, card_label_privatbank_en: e.target.value })} placeholder="Transfer via Privat24" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Кнопка «Інші банки» (UA)</label>
                      <input className={styles.input} value={form.card_label_details_uk} onChange={e => setForm({ ...form, card_label_details_uk: e.target.value })} placeholder="Переглянути деталі" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Кнопка «Інші банки» (EN)</label>
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
                  <h2 className={styles.settingsSectionTitle}>Банківські реквізити</h2>
                </div>
                <div className={styles.settingsSectionBody}>
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
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <CreditCard size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Статистика (головна сторінка)</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <div className={styles.formGrid3}>
                    <div className={styles.formGroup}><label className={styles.label}>Проєкти</label><input className={styles.input} value={form.stats_projects} onChange={e => setForm({ ...form, stats_projects: e.target.value })} placeholder="12" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Дороги (км)</label><input className={styles.input} value={form.stats_roads} onChange={e => setForm({ ...form, stats_roads: e.target.value })} placeholder="550 000+" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Допомога (тонн)</label><input className={styles.input} value={form.stats_aid} onChange={e => setForm({ ...form, stats_aid: e.target.value })} placeholder="370+" /></div>
                  </div>
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <CreditCard size={16} className={styles.settingsSectionIcon} strokeWidth={2} />
                  <h2 className={styles.settingsSectionTitle}>Рахунки (IBAN / Crypto)</h2>
                </div>
                <div className={styles.settingsSectionBody}>
                  <p className={styles.pageSubtitle} style={{ marginBottom: '0.75rem' }}>
                    Редагуйте банківські рахунки у форматі JSON. Формат: {'{'}"ua": [{'{'}"id": "ua_privat", "label": "PrivatBank", "value": "UA..."{'}'}]{'}'}
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
                <h2 className={styles.settingsSectionTitle}>Звіти / Документи</h2>
              </div>
              <div className={styles.settingsSectionBody}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <button type="button" onClick={addDocument} className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>
                    <Plus size={14} /> Додати документ
                  </button>
                </div>
                {documents.length === 0 ? (
                  <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem 0' }}>Ще немає документів. Натисніть «Додати документ».</p>
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
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`} style={{ minWidth: 140 }}>
              <Check size={15} />
            {saving ? 'Збереження…' : 'Зберегти контент'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
