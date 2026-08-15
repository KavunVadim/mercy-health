'use client';

import { useEffect, useState } from 'react';
import styles from '@/app/admin/admin.module.css';

export interface HonorData {
  eyebrow?: string;
  big_number?: string;
  num_label?: string;
  text?: string;
  tags?: Array<{ label: string; href?: string }>;
  caption?: string;
  patch_alt?: string;
}

interface ProjectOption {
  id: string;
  title: string;
}

interface HonorEditorProps {
  value: HonorData;
  onChange: (value: HonorData) => void;
  label: string;
  lang?: 'uk' | 'en';
}

export default function HonorEditor({ value, onChange, label, lang = 'uk' }: HonorEditorProps) {
  const tags = Array.isArray(value.tags) ? value.tags : [];
  const [projects, setProjects] = useState<ProjectOption[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/projects?limit=500')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (!active) return;
        const list = (Array.isArray(data) ? data : [])
          .filter((p: { status?: string }) => p.status !== 'inactive' && p.status !== 'archived')
          .map((p: { id?: string; title?: { uk?: string; en?: string } }) => ({
            id: String(p.id ?? ''),
            title: String((lang === 'en' ? p.title?.en : p.title?.uk) || p.title?.uk || p.id || ''),
          }))
          .filter((p: ProjectOption) => p.id && p.title);
        setProjects(list);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [lang]);

  function setField(key: string, val: string) {
    onChange({ ...value, [key]: val });
  }

  function addTag() {
    onChange({ ...value, tags: [...tags, { label: '', href: projects[0]?.id || '' }] });
  }

  function updateTag(idx: number, field: 'label' | 'href', val: string) {
    const updated = tags.map((t, i) => i === idx ? { ...t, [field]: val } : t);
    onChange({ ...value, tags: updated });
  }

  function removeTag(idx: number) {
    onChange({ ...value, tags: tags.filter((_, i) => i !== idx) });
  }

  const existingHrefs = new Set(tags.map(t => t.href).filter(Boolean));

  return (
    <div>
      <label className={styles.label} style={{ marginBottom: '0.75rem', display: 'block' }}>{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label} style={{ fontSize: '0.75rem' }}>Eyebrow (підпис)</label>
            <input className={styles.input} value={value.eyebrow || ''} onChange={e => setField('eyebrow', e.target.value)} placeholder="Флагманський проєкт" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} style={{ fontSize: '0.75rem' }}>Велика цифра</label>
            <input className={styles.input} value={value.big_number || ''} onChange={e => setField('big_number', e.target.value)} placeholder="130" />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} style={{ fontSize: '0.75rem' }}>Підпис під цифрою</label>
          <textarea className={styles.textarea} rows={2} value={value.num_label || ''} onChange={e => setField('num_label', e.target.value)} placeholder="спеціалізованих авто доставлено на фронт..." />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} style={{ fontSize: '0.75rem' }}>Основний текст (абзац)</label>
          <textarea className={styles.textarea} rows={4} value={value.text || ''} onChange={e => setField('text', e.target.value)} placeholder="Сьогодні ми є одним із найбільших постачальників спеціалізованої техніки..." />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} style={{ fontSize: '0.75rem' }}>Підпис під фото</label>
          <input className={styles.input} value={value.caption || ''} onChange={e => setField('caption', e.target.value)} placeholder="Стіна подяк від наших захисників" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} style={{ fontSize: '0.75rem' }}>Alt текст (для зображення)</label>
          <input className={styles.input} value={value.patch_alt || ''} onChange={e => setField('patch_alt', e.target.value)} placeholder="Стіна пошани" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label className={styles.label} style={{ fontSize: '0.75rem', margin: 0 }}>Теги</label>
            <button type="button" onClick={addTag} className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem' }}>
              + Додати тег
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {tags.map((tag, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-sm)', padding: '0.2rem 0.5rem' }}>
                <input
                  className={styles.input}
                  value={tag.label ?? ''}
                  onChange={e => updateTag(idx, 'label', e.target.value)}
                  placeholder="Тег"
                  style={{ border: 'none', background: 'transparent', padding: '0.25rem', fontSize: '0.85rem', minHeight: 0, width: 120 }}
                />
                <select
                  className={styles.input}
                  value={tag.href ?? ''}
                  onChange={e => updateTag(idx, 'href', e.target.value)}
                  style={{ border: 'none', background: 'transparent', padding: '0.25rem', fontSize: '0.85rem', minHeight: 0, width: 220, cursor: 'pointer' }}
                  title="Посилання на проєкт"
                >
                  <option value="">— без посилання —</option>
                  {projects.length === 0 && (
                    <option disabled>Завантаження проєктів...</option>
                  )}
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                  {Array.from(existingHrefs).filter(href => !projects.some(p => p.id === href)).map(href => (
                    <option key={href} value={href}>{href}</option>
                  ))}
                </select>
                <button type="button" onClick={() => removeTag(idx)} className={styles.btnIcon} style={{ width: 18, height: 18, minWidth: 0, minHeight: 0, padding: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}