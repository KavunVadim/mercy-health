'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Pencil, Trash2, BookOpenText, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';
import { useToast } from '@/components/admin/ui/Toast';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { SkeletonRows } from '@/components/admin/ui/Skeleton';
import { saveReorder, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } from '@/lib/dnd-reorder';
import type { AdminPartner } from '@/types/admin';

export default function AdminMemorandumsPage() {
  const [items, setItems] = useState<AdminPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminPartner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name_uk: '', name_en: '', logo: '', url: '' });
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPartner | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { success, error } = useToast();

  const loadItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/memorandums');
      if (res.ok) setItems(await res.json());
      else error('Failed to load memorandums');
    } catch { error('Network error'); }
    finally { setLoading(false); }
  }, [error]);

  useEffect(() => { loadItems(); }, [loadItems]);

  function moveItem(from: number, direction: -1 | 1) {
    const to = from + direction;
    if (to < 0 || to >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    saveReorder('memorandums', updated);
  }

  function reorderItem(from: number, to: number) {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    saveReorder('memorandums', updated);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { name: { uk: form.name_uk, en: form.name_en }, logo: form.logo, url: form.url };
      const res = await fetch(
        editing ? `/api/admin/memorandums/${editing.id}` : '/api/admin/memorandums',
        { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      if (res.ok) { setShowForm(false); setEditing(null); loadItems(); success(editing ? 'Memorandum updated' : 'Memorandum added'); }
      else error('Save failed');
    } catch { error('Network error'); }
    finally { setSaving(false); }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/memorandums/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { loadItems(); success('Memorandum deleted'); }
      else error('Delete failed');
    } catch { error('Network error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  }

  function openEdit(item: AdminPartner) {
    setEditing(item);
    setForm({ name_uk: item.name?.uk || '', name_en: item.name?.en || '', logo: item.logo || '', url: item.url || '' });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name_uk: '', name_en: '', logo: '', url: '' });
    setShowForm(true);
  }

  const formModal = showForm && createPortal(
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
      <div className={styles.modal} style={{ maxWidth: 560 }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{editing ? 'Edit Memorandum' : 'Add Memorandum'}</h2>
          <button className={styles.btnIcon} onClick={() => setShowForm(false)} aria-label="Close"><X size={16} /></button>
        </div>
        <form onSubmit={handleSave}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}><label className={styles.label}>Name (Ukrainian)</label><input className={styles.input} value={form.name_uk} onChange={e => setForm({ ...form, name_uk: e.target.value })} required /></div>
              <div className={styles.formGroup}><label className={styles.label}>Name (English)</label><input className={styles.input} value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
            </div>
            <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
              <label className={styles.label}>Logo</label>
              <ImageUploader value={form.logo} onChange={v => setForm({ ...form, logo: v })} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Website URL</label>
              <input className={styles.input} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Memorandum'}</button>
            <button type="button" onClick={() => setShowForm(false)} className={`${styles.btn} ${styles.btnSecondary}`}>Cancel</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Memorandums</h1>
          <p className={styles.pageSubtitle}>{items.length} memorandum{items.length !== 1 ? 's' : ''} — drag to reorder</p>
        </div>
        <div className={styles.pageActions}>
          <button onClick={openCreate} className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={15} /> Add Memorandum
          </button>
        </div>
      </div>

      {formModal}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete memorandum?"
        message={`"${deleteTarget?.name?.uk || deleteTarget?.id}" will be removed.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {loading ? (
        <SkeletonRows rows={4} cols={4} />
      ) : items.length === 0 ? (
        <div className={`${styles.card} ${styles.emptyState}`}>
          <div className={styles.emptyStateIcon}><BookOpenText size={28} strokeWidth={1.5} /></div>
          <p className={styles.emptyStateTitle}>No memorandums yet</p>
          <p className={styles.emptyStateText}>Add memoranda of cooperation.</p>
          <button onClick={openCreate} className={`${styles.btn} ${styles.btnPrimary}`}><Plus size={15} /> Add Memorandum</button>
        </div>
      ) : (
        <div className={styles.cardGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={styles.cardItem}
              style={{ textAlign: 'center', padding: '1rem', position: 'relative' }}
              draggable
              onDragStart={e => { setDragIndex(idx); handleDragStart(e, idx); }}
              onDragOver={e => { handleDragOver(e, idx, dragIndex, reorderItem); }}
              onDragLeave={handleDragLeave}
              onDrop={e => { handleDrop(e, idx, dragIndex, reorderItem); setDragIndex(null); }}
              onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: '6px', padding: '6px', color: 'rgba(255,255,255,0.9)', cursor: 'grab', display: 'flex' }} title="Drag to reorder">
                <GripVertical size={16} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', marginTop: '0.5rem' }}>
                {item.logo ? (
                  <img src={item.logo} alt={item.name?.uk || ''} style={{ width: '80px', height: '80px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.5rem', border: '1px solid var(--admin-border)' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', background: 'var(--admin-secondary)', borderRadius: '12px', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpenText size={32} color="var(--admin-text-muted)" />
                  </div>
                )}
              </div>
              <h3 className={styles.cardTitle} style={{ fontSize: '1rem' }}>{item.name?.uk}</h3>
              {item.name?.en && (
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>{item.name.en}</div>
              )}
              <div className={styles.cardActions} style={{ paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`} style={{ minWidth: 28, minHeight: 26, padding: 0 }} title="Move up">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`} style={{ minWidth: 28, minHeight: 26, padding: 0 }} title="Move down">
                  <ArrowDown size={14} />
                </button>
                <button onClick={() => openEdit(item)} className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}>
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => setDeleteTarget(item)} className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
