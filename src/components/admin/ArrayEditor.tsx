'use client';

import { useState, useCallback } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

interface ArrayEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  fields: { key: string; label: string; placeholder?: string; type?: 'text' | 'textarea' }[];
  label: string;
  itemLabel?: string;
}

export default function ArrayEditor({ value, onChange, fields, label, itemLabel }: ArrayEditorProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  function addItem() {
    const item: Record<string, string> = {};
    fields.forEach(f => item[f.key] = '');
    onChange([...value, item]);
  }

  function updateItem(index: number, key: string, val: string) {
    const updated = value.map((item: any, i: number) => i === index ? { ...item, [key]: val } : item);
    onChange(updated);
  }

  function removeItem(index: number) {
    onChange(value.filter((_: any, i: number) => i !== index));
  }

  const handleDragStart = useCallback((index: number) => {
    setDragIdx(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) return;
    const updated = [...value];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(dropIdx, 0, moved);
    onChange(updated);
    setDragIdx(null);
  }, [dragIdx, value, onChange]);

  const handleDragEnd = useCallback(() => {
    setDragIdx(null);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <label className={styles.label} style={{ margin: 0 }}>{label}</label>
        <button type="button" onClick={addItem} className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>
          <Plus size={13} /> {value.length === 0 ? `Add ${itemLabel || 'item'}` : `Add ${itemLabel || ''}`}
        </button>
      </div>
      {value.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', padding: '1rem 0', textAlign: 'center' }}>
          Ще немає елементів. Натисніть «Додати».
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {value.map((item: any, idx: number) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              style={{
                display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                padding: '0.75rem', background: dragIdx === idx ? 'var(--admin-accent-light)' : 'var(--admin-secondary)',
                borderRadius: 'var(--admin-radius-sm)', border: dragIdx === idx ? '2px dashed var(--admin-accent)' : '1px solid var(--admin-border)',
                position: 'relative', transition: 'background 0.15s, border 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '0.5rem', opacity: 0.4, cursor: 'grab', touchAction: 'none' }}>
                <GripVertical size={14} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {fields.map(f => (
                  <div key={f.key} style={{ flex: 1 }}>
                    {f.type === 'textarea' ? (
                      <textarea
                        className={styles.textarea}
                        rows={2}
                        value={item[f.key] || ''}
                        onChange={e => updateItem(idx, f.key, e.target.value)}
                        placeholder={f.placeholder || f.label}
                        style={{ fontSize: '0.85rem', minHeight: 60 }}
                      />
                    ) : (
                      <input
                        className={styles.input}
                        value={item[f.key] || ''}
                        onChange={e => updateItem(idx, f.key, e.target.value)}
                        placeholder={f.placeholder || f.label}
                        style={{ fontSize: '0.85rem' }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className={styles.btnIcon}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: 24, height: 24, minWidth: 0, minHeight: 0, padding: 0 }}
                title="Remove"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
