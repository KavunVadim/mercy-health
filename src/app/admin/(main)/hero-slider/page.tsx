'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, GripVertical, Pencil, Trash2, SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';
import RichEditor from '@/components/admin/RichEditor';
import { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } from '@/lib/dnd-reorder';
import { useToast } from '@/components/admin/ui/Toast';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { SkeletonRows } from '@/components/admin/ui/Skeleton';
import type { AdminSlide } from '@/types/admin';

const emptyForm = () => ({
  badge_uk: '', badge_en: '', title_uk: '', title_en: '',
  description_uk: '', description_en: '',
  image: '', href: '', focus: '', cta_uk: '', cta_en: '',
});

export default function AdminHeroSliderPage() {
  const [items, setItems] = useState<AdminSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminSlide | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { success, error } = useToast();

  function moveItem(from: number, direction: -1 | 1) {
    const to = from + direction;
    if (to < 0 || to >= items.length) return;
    reorderItem(from, to);
  }

  async function reorderItem(from: number, to: number) {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    try {
      await fetch('/api/admin/hero-slider', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: updated.map(i => i.id) }),
      });
    } catch {}
  }

  const loadItems = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/hero-slider');
      if (r.ok) setItems(await r.json());
      else error('Failed to load slides');
    } catch { error('Network error'); }
    finally { setLoading(false); }
  }, [error]);

  useEffect(() => {
    const load = async () => { await loadItems(); };
    void load();
  }, [loadItems]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/admin/hero-slider/${editing.id}` : '/api/admin/hero-slider';
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        setShowForm(false); setEditing(null); loadItems();
        success(editing ? 'Slide updated' : 'Slide created');
      } else error('Save failed');
    } catch { error('Network error'); }
    finally { setSaving(false); }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/hero-slider/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { loadItems(); success('Slide deleted'); }
      else error('Delete failed');
    } catch { error('Network error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  }

  function openEdit(item: AdminSlide) {
    setEditing(item);
    setForm({ badge_uk: item.badge_uk, badge_en: item.badge_en, title_uk: item.title_uk, title_en: item.title_en, description_uk: item.description_uk, description_en: item.description_en, image: item.image, href: item.href, focus: item.focus, cta_uk: item.cta_uk, cta_en: item.cta_en });
    setShowForm(true);
  }

  const formModal = showForm && createPortal(
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
      <div className={`${styles.modal} ${styles.modalLarge}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{editing ? 'Edit Slide' : 'New Slide'}</h2>
          <button className={styles.btnIcon} onClick={() => setShowForm(false)} aria-label="Close"><X size={16} /></button>
        </div>
        <form onSubmit={handleSave}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}><label className={styles.label}>Badge (Ukrainian)</label><input className={styles.input} value={form.badge_uk} onChange={e => setForm({ ...form, badge_uk: e.target.value })} placeholder="Проєкт" /></div>
              <div className={styles.formGroup}><label className={styles.label}>Badge (English)</label><input className={styles.input} value={form.badge_en} onChange={e => setForm({ ...form, badge_en: e.target.value })} placeholder="Project" /></div>
            </div>
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}><label className={styles.label}>Title (Ukrainian)</label><input className={styles.input} value={form.title_uk} onChange={e => setForm({ ...form, title_uk: e.target.value })} required /></div>
              <div className={styles.formGroup}><label className={styles.label}>Title (English)</label><input className={styles.input} value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} /></div>
            </div>
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div><RichEditor label="Description (Ukrainian)" value={form.description_uk} onChange={v => setForm({ ...form, description_uk: v })} height={150} /></div>
              <div><RichEditor label="Description (English)" value={form.description_en} onChange={v => setForm({ ...form, description_en: v })} height={150} /></div>
            </div>
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}><label className={styles.label}>CTA Button (Ukrainian)</label><input className={styles.input} value={form.cta_uk} onChange={e => setForm({ ...form, cta_uk: e.target.value })} placeholder="Підтримати" /></div>
              <div className={styles.formGroup}><label className={styles.label}>CTA Button (English)</label><input className={styles.input} value={form.cta_en} onChange={e => setForm({ ...form, cta_en: e.target.value })} placeholder="Support" /></div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Background Image</label>
                <ImageUploader value={form.image} onChange={v => setForm({ ...form, image: v })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={styles.formGroup}><label className={styles.label}>Link URL</label><input className={styles.input} value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} placeholder="https://..." /></div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Image Focus <span style={{ fontWeight: 400, textTransform: 'none' }}>(object-position)</span></label>
                  <input className={styles.input} value={form.focus} onChange={e => setForm({ ...form, focus: e.target.value })} placeholder="50% 80%" />
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', lineHeight: 1.4, color: 'var(--admin-text-muted)' }}>
                    Controls which part of the image is visible on different screen sizes.
                    First value = horizontal position (left / center / right), second = vertical (top / center / bottom).
                    Examples: <code style={{ background: 'var(--admin-secondary)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.7rem' }}>50% 50%</code> (center),
                    <code style={{ background: 'var(--admin-secondary)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.7rem' }}>50% 0%</code> (top-center),
                    <code style={{ background: 'var(--admin-secondary)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.7rem' }}>30% 80%</code> (custom).
                    Leave empty for default centering.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Slide'}</button>
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
          <h1 className={styles.pageTitle}>Hero Slider</h1>
          <p className={styles.pageSubtitle}>{items.length} slide{items.length !== 1 ? 's' : ''} — drag to reorder</p>
        </div>
        <div className={styles.pageActions}>
          <button onClick={() => { setEditing(null); setForm(emptyForm()); setShowForm(true); }} className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={15} /> Add Slide
          </button>
        </div>
      </div>

      {formModal}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete slide?"
        message={`"${deleteTarget?.title_uk || deleteTarget?.id}" will be permanently removed.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {loading ? (
        <SkeletonRows rows={4} cols={3} />
      ) : items.length === 0 ? (
        <div className={`${styles.card} ${styles.emptyState}`}>
          <div className={styles.emptyStateIcon}><SlidersHorizontal size={28} strokeWidth={1.5} /></div>
          <p className={styles.emptyStateTitle}>No slides yet</p>
          <p className={styles.emptyStateText}>Add slides to display in the homepage hero section.</p>
          <button onClick={() => { setEditing(null); setForm(emptyForm()); setShowForm(true); }} className={`${styles.btn} ${styles.btnPrimary}`}><Plus size={15} /> Add Slide</button>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={e => { setDragIndex(idx); handleDragStart(e, idx); }}
              onDragOver={e => { handleDragOver(e, idx, dragIndex); }}
              onDragLeave={handleDragLeave}
              onDrop={e => { handleDrop(e, idx, dragIndex, reorderItem); setDragIndex(null); }}
              onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
              className={styles.cardItem}
              style={{ cursor: 'grab', userSelect: 'none' }}
            >
              <div className={styles.cardImageWrapper}>
                {item.image ? (
                  <img src={item.image} alt={item.title_en || item.title_uk || ''} loading="lazy" />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <SlidersHorizontal size={28} strokeWidth={1.5} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', backdropFilter: 'blur(4px)' }}>
                  <GripVertical size={15} />
                </div>
                {item.focus && (
                  <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '0.15rem 0.4rem', fontSize: '0.65rem', color: '#94a3b8', backdropFilter: 'blur(4px)' }}>
                    {item.focus}
                  </div>
                )}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTitle}>{item.title_uk || item.title_en || item.id}</div>
                <div className={styles.cardMeta}>
                  {item.badge_uk && <span className={`${styles.badge} ${styles.badgePrimary}`}>{item.badge_uk}</span>}
                  {item.badge_en && <span className={`${styles.badge} ${styles.badgeSecondary}`}>{item.badge_en}</span>}
                </div>
                <div className={styles.cardActions}>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`} style={{ minWidth: 28, minHeight: 26, padding: 0 }} title="Move up">
                      <ChevronUp size={13} />
                    </button>
                    <button onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`} style={{ minWidth: 28, minHeight: 26, padding: 0 }} title="Move down">
                      <ChevronDown size={13} />
                    </button>
                  </div>
                  <button onClick={() => openEdit(item)} className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`} style={{ flex: 1 }}><Pencil size={13} /> Edit</button>
                  <button onClick={() => setDeleteTarget(item)} className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`} style={{ flex: 1 }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
