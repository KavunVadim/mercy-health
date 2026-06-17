'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Pencil } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';

interface MediaItemData {
  id: string;
  image: string;
  source: string;
  title: string;
  description: string;
  date: string;
  url: string;
  type?: 'article' | 'video';
}

interface MediaEditorProps {
  items: MediaItemData[];
  itemsEn: MediaItemData[];
  onItemsChange: (items: MediaItemData[]) => void;
  onItemsEnChange: (items: MediaItemData[]) => void;
  onSave?: () => Promise<void>;
}

export default function MediaEditor({ items, itemsEn, onItemsChange, onItemsEnChange, onSave }: MediaEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (editingIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditingIndex(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [editingIndex]);

  function addItem() {
    const id = `media-${Date.now()}`;
    const image = '';
    onItemsChange([...items, { id, image, source: '', title: '', description: '', date: '', url: '', type: 'article' }]);
    onItemsEnChange([...itemsEn, { id: `media-en-${Date.now()}`, image, source: '', title: '', description: '', date: '', url: '', type: 'article' }]);
    setEditingIndex(items.length);
  }

  function removeItem(i: number) {
    if (editingIndex === i) setEditingIndex(null);
    onItemsChange(items.filter((_, idx) => idx !== i));
    onItemsEnChange(itemsEn.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, field: string, value: string) {
    const updated = [...items];
    (updated[i] as any)[field] = value;
    onItemsChange(updated);
    const sharedFields = ['image', 'url', 'date', 'type'];
    if (sharedFields.includes(field)) {
      const updatedEn = [...itemsEn];
      (updatedEn[i] as any)[field] = value;
      onItemsEnChange(updatedEn);
    }
  }

  function updateItemEn(i: number, field: string, value: string) {
    const updated = [...itemsEn];
    (updated[i] as any)[field] = value;
    onItemsEnChange(updated);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button type="button" onClick={addItem} className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>
          <Plus size={14} /> Додати медіа
        </button>
      </div>

      {items.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
          Ще немає медіа-посилань. Натисніть «Додати медіа», щоб створити перше.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
          {items.map((item, i) => (
            <div
              key={item.id}
              style={{
                background: 'var(--admin-card-bg)',
                border: '1px solid var(--admin-border)',
                borderRadius: 10,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onClick={() => setEditingIndex(i)}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--admin-border-hover)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--admin-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '100%', height: 140,
                background: 'var(--admin-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {item.image ? (
                  <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--admin-text-muted)' }}>
                    {item.source?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--admin-text)' }}>
                    {item.source || '—'}
                  </span>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase',
                    padding: '1px 5px', borderRadius: '3px',
                    background: item.type === 'video' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.12)',
                    color: item.type === 'video' ? '#a78bfa' : '#60a5fa',
                  }}>
                    {item.type === 'video' ? 'Відео' : 'Стаття'}
                  </span>
                  {item.date && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', marginLeft: 'auto' }}>
                      {item.date}
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--admin-text)', lineHeight: 1.3 }}>
                  {item.title || <span style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>Без заголовка</span>}
                </div>
                {item.description && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}
                    style={{ fontSize: '0.72rem', padding: '2px 10px', minHeight: 28 }}
                    onClick={e => { e.stopPropagation(); setEditingIndex(i); }}
                  >
                    <Pencil size={11} /> Редагувати
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`}
                    style={{ fontSize: '0.72rem', padding: '2px 10px', minHeight: 28 }}
                    onClick={e => { e.stopPropagation(); removeItem(i); }}
                  >
                    <X size={11} /> Видалити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingIndex !== null && createPortal(
        <div
          className={styles.modalBackdrop}
          onClick={e => { if (e.target === e.currentTarget) setEditingIndex(null); }}
        >
          <div className={styles.modal} style={{ maxWidth: 720, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {items[editingIndex]?.title || `Медіа ${editingIndex + 1}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`}
                style={{ flexShrink: 0 }}
              >
                <X size={16} />
              </button>
            </div>
            <div className={styles.modalBody} style={{ overflow: 'auto', flex: 1 }}>
              {items[editingIndex] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                      <ImageUploader
                        value={items[editingIndex].image || ''}
                        onChange={val => updateItem(editingIndex, 'image', val)}
                        label="Зображення прев'ю"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Назва медіа (UA)</label>
                      <input className={styles.input} value={items[editingIndex].source} onChange={e => updateItem(editingIndex, 'source', e.target.value)} placeholder="Forbes, ТСН, DOU…" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Назва медіа (EN)</label>
                      <input className={styles.input} value={itemsEn[editingIndex]?.source || ''} onChange={e => updateItemEn(editingIndex, 'source', e.target.value)} placeholder="Forbes, TSN, DOU…" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Заголовок статті (UA)</label>
                      <input className={styles.input} value={items[editingIndex].title} onChange={e => updateItem(editingIndex, 'title', e.target.value)} placeholder="Заголовок статті" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Заголовок статті (EN)</label>
                      <input className={styles.input} value={itemsEn[editingIndex]?.title || ''} onChange={e => updateItemEn(editingIndex, 'title', e.target.value)} placeholder="Article title" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Опис / Лід (UA)</label>
                      <textarea className={styles.textarea} rows={2} value={items[editingIndex].description} onChange={e => updateItem(editingIndex, 'description', e.target.value)} placeholder="Короткий опис статті" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Опис / Лід (EN)</label>
                      <textarea className={styles.textarea} rows={2} value={itemsEn[editingIndex]?.description || ''} onChange={e => updateItemEn(editingIndex, 'description', e.target.value)} placeholder="Article lead" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Тип</label>
                      <select className={styles.input} value={items[editingIndex].type || 'article'} onChange={e => updateItem(editingIndex, 'type', e.target.value)}>
                        <option value="article">Стаття</option>
                        <option value="video">Відео</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Дата публікації</label>
                      <input className={styles.input} type="date" value={items[editingIndex].date} onChange={e => updateItem(editingIndex, 'date', e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Посилання (URL)</label>
                      <input className={styles.input} value={items[editingIndex].url} onChange={e => updateItem(editingIndex, 'url', e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={async () => {
                  await onSave?.();
                  setEditingIndex(null);
                }}
              >
                Готово
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
