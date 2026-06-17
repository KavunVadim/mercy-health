'use client';

import { useState } from 'react';
import { Plus, X, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import ExpandableCard from '@/components/admin/ui/ExpandableCard';
import ImageUploader from '@/components/admin/ImageUploader';
import { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } from '@/lib/dnd-reorder';

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
}

export default function MediaEditor({ items, itemsEn, onItemsChange, onItemsEnChange }: MediaEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function addItem() {
    const id = `media-${Date.now()}`;
    const image = '';
    onItemsChange([...items, { id, image, source: '', title: '', description: '', date: '', url: '', type: 'article' }]);
    onItemsEnChange([...itemsEn, { id: `media-en-${Date.now()}`, image, source: '', title: '', description: '', date: '', url: '', type: 'article' }]);
  }

  function removeItem(i: number) {
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

  function reorderItem(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onItemsChange(updated);

    const updatedEn = [...itemsEn];
    const [movedEn] = updatedEn.splice(from, 1);
    updatedEn.splice(to, 0, movedEn);
    onItemsEnChange(updatedEn);
  }

  function moveItem(from: number, direction: -1 | 1) {
    reorderItem(from, from + direction);
  }

  function collapsedView(item: MediaItemData, i: number) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ color: 'var(--admin-text-muted)', display: 'flex', cursor: 'grab', flexShrink: 0 }}>
          <GripVertical size={16} />
        </div>
        <div style={{
          width: 52, height: 52, borderRadius: '8px',
          overflow: 'hidden', flexShrink: 0, background: 'var(--admin-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {item.image ? (
            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-text-muted)' }}>
              {item.source?.charAt(0) || '?'}
            </span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--admin-text)' }}>
            {item.title || `Медіа ${i + 1}`}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            {item.source || 'No source set'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); moveItem(i, -1); }}
            disabled={i === 0}
            className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`}
            style={{ minWidth: 28, minHeight: 26, padding: 0 }}
            title="Move up"
          >
            <ChevronUp size={13} />
          </button>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); moveItem(i, 1); }}
            disabled={i === items.length - 1}
            className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`}
            style={{ minWidth: 28, minHeight: 26, padding: 0 }}
            title="Move down"
          >
            <ChevronDown size={13} />
          </button>
        </div>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); removeItem(i); }}
          className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`}
          style={{ flexShrink: 0 }}
          title="Remove item"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  function expandedView(item: MediaItemData, i: number) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <ImageUploader
              value={item.image || ''}
              onChange={val => updateItem(i, 'image', val)}
              label="Зображення прев'ю"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Назва медіа (UA)</label>
            <input
              className={styles.input}
              value={item.source}
              onChange={e => updateItem(i, 'source', e.target.value)}
              placeholder="Forbes, ТСН, DOU…"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Назва медіа (EN)</label>
            <input
              className={styles.input}
              value={itemsEn[i]?.source || ''}
              onChange={e => updateItemEn(i, 'source', e.target.value)}
              placeholder="Forbes, TSN, DOU…"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Заголовок статті (UA)</label>
            <input
              className={styles.input}
              value={item.title}
              onChange={e => updateItem(i, 'title', e.target.value)}
              placeholder="Заголовок статті"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Заголовок статті (EN)</label>
            <input
              className={styles.input}
              value={itemsEn[i]?.title || ''}
              onChange={e => updateItemEn(i, 'title', e.target.value)}
              placeholder="Article title"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Опис / Лід (UA)</label>
            <textarea
              className={styles.textarea}
              rows={2}
              value={item.description}
              onChange={e => updateItem(i, 'description', e.target.value)}
              placeholder="Короткий опис статті"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Опис / Лід (EN)</label>
            <textarea
              className={styles.textarea}
              rows={2}
              value={itemsEn[i]?.description || ''}
              onChange={e => updateItemEn(i, 'description', e.target.value)}
              placeholder="Article lead"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Тип</label>
            <select
              className={styles.input}
              value={item.type || 'article'}
              onChange={e => updateItem(i, 'type', e.target.value)}
            >
              <option value="article">Стаття</option>
              <option value="video">Відео</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Дата публікації</label>
            <input
              className={styles.input}
              type="date"
              value={item.date}
              onChange={e => updateItem(i, 'date', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Посилання (URL)</label>
            <input
              className={styles.input}
              value={item.url}
              onChange={e => updateItem(i, 'url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    );
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item, i) => (
            <div
              key={item.id}
              draggable
              onDragStart={e => { setDragIndex(i); handleDragStart(e, i); }}
              onDragOver={e => { handleDragOver(e, i, dragIndex, reorderItem); }}
              onDragLeave={handleDragLeave}
              onDrop={e => { handleDrop(e, i, dragIndex, reorderItem); setDragIndex(null); }}
              onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
              style={{ cursor: 'grab', userSelect: 'none' }}
            >
              <ExpandableCard
                collapsedContent={collapsedView(item, i)}
                expandedContent={expandedView(item, i)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
