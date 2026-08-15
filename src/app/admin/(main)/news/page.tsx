'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, GripVertical, Pencil, Trash2, Newspaper, ChevronUp, ChevronDown } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';
import GalleryEditor from '@/components/admin/GalleryEditor';
import RichEditor from '@/components/admin/RichEditor';
import { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd, saveReorder } from '@/lib/dnd-reorder';
import { slugify, arrToText, textToArr } from '@/lib/data-utils';
import { useToast } from '@/components/admin/ui/Toast';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { SkeletonRows } from '@/components/admin/ui/Skeleton';
import type { AdminNews } from '@/types/admin';

interface FormLink {
  url: string;
  type: 'video' | 'external';
  label_uk: string;
  label_en: string;
}

const emptyForm = () => ({
  title_uk: '', title_en: '',
  date: new Date().toISOString().split('T')[0],
  image: '', image_focus: '',
  description_uk: '', description_en: '',
  content_uk: '', content_en: '',
  gallery: '', links: [] as FormLink[],
});

export default function AdminNewsPage() {
  const [items, setItems] = useState<AdminNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminNews | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminNews | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { success, error } = useToast();

  function moveItem(from: number, direction: -1 | 1) {
    const to = from + direction;
    if (to < 0 || to >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    saveReorder('news', updated);
  }

  function reorderItem(from: number, to: number) {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    saveReorder('news', updated);
  }

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/news');
      if (res.ok) setItems(await res.json());
      else error('Failed to load news');
    } catch {
      error('Network error');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    const load = async () => { await fetchItems(); };
    void load();
  }, [fetchItems]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = slugify(form.title_uk || form.title_en, 'news-item');
      const activeLinks = form.links.filter(l => l.url.trim());
      const body: Record<string, unknown> = {
        id: slug, slug, date: form.date,
        image: form.image,
        image_focus: form.image_focus || undefined,
        title: { uk: form.title_uk, en: form.title_en },
        description: { uk: form.description_uk, en: form.description_en },
        content: { uk: textToArr(form.content_uk), en: textToArr(form.content_en) },
        gallery: textToArr(form.gallery),
        links: activeLinks.map(l => ({ url: l.url, type: l.type, label: { uk: l.label_uk, en: l.label_en } })),
      };
      const res = await fetch(
        editing ? `/api/admin/news/${editing._id || editing.id}` : '/api/admin/news',
        { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        fetchItems();
        success(editing ? 'News updated' : 'News created');
      } else {
        const data = await res.json().catch(() => ({}));
        error(data.error || `Save failed (${res.status})`);
      }
    } catch {
      error('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/news/${deleteTarget._id || deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { fetchItems(); success('News deleted'); }
      else error('Delete failed');
    } catch {
      error('Network error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  function openEdit(item: AdminNews) {
    setEditing(item);
    setForm({
      title_uk: item.title?.uk || '',
      title_en: item.title?.en || '',
      date: item.date || '',
      image: item.image || '',
      image_focus: item.image_focus || '',
      description_uk: item.description?.uk || '',
      description_en: item.description?.en || '',
      content_uk: arrToText(item.content?.uk),
      content_en: arrToText(item.content?.en),
      gallery: arrToText(item.gallery),
      links: (item.links || []).map(l => ({
        url: l.url || '', type: l.type || 'external',
        label_uk: l.label?.uk || '', label_en: l.label?.en || '',
      })),
    });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  }

  const formModal = showForm && createPortal(
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
      <div className={`${styles.modal} ${styles.modalLarge}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{editing ? 'Edit News Article' : 'New News Article'}</h2>
          <button className={styles.btnIcon} onClick={() => setShowForm(false)} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className={styles.modalBody}>
            {/* Titles */}
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title (Ukrainian)</label>
                <input className={styles.input} value={form.title_uk} onChange={e => setForm({ ...form, title_uk: e.target.value })} required placeholder="Назва новини" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title (English)</label>
                <input className={styles.input} value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} placeholder="News title" />
              </div>
            </div>

            {/* Date + Image */}
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <input className={styles.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Image Focus <span style={{ fontWeight: 400, color: 'var(--admin-text-muted)', textTransform: 'none' }}>(object-position)</span></label>
                <input className={styles.input} value={form.image_focus} onChange={e => setForm({ ...form, image_focus: e.target.value })} placeholder="50% 80%" />
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', lineHeight: 1.4, color: 'var(--admin-text-muted)' }}>
                  Controls which part of the image is visible. First value = horizontal, second = vertical.
                  Examples: <code style={{ background: 'var(--admin-secondary)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.7rem' }}>50% 50%</code> (center),
                  <code style={{ background: 'var(--admin-secondary)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.7rem' }}>50% 0%</code> (top),
                  <code style={{ background: 'var(--admin-secondary)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.7rem' }}>30% 80%</code> (custom).
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>Main Image</label>
              <ImageUploader value={form.image} onChange={v => setForm({ ...form, image: v })} />
            </div>

            <hr className={styles.divider} />

            {/* Descriptions */}
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div>
                <RichEditor label="Excerpt (Ukrainian)" value={form.description_uk} onChange={v => setForm({ ...form, description_uk: v })} height={150} />
              </div>
              <div>
                <RichEditor label="Excerpt (English)" value={form.description_en} onChange={v => setForm({ ...form, description_en: v })} height={150} />
              </div>
            </div>

            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div>
                <RichEditor label="Content (Ukrainian)" value={form.content_uk} onChange={v => setForm({ ...form, content_uk: v })} height={280} />
              </div>
              <div>
                <RichEditor label="Content (English)" value={form.content_en} onChange={v => setForm({ ...form, content_en: v })} height={280} />
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Gallery */}
            <div style={{ marginBottom: '1.5rem' }}>
              <GalleryEditor
                label="Gallery Images"
                value={textToArr(form.gallery)}
                onChange={v => setForm({ ...form, gallery: arrToText(v) })}
              />
            </div>

            {/* Links */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label className={styles.label} style={{ margin: 0 }}>External Links</label>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}
                  onClick={() => setForm({ ...form, links: [...form.links, { url: '', type: 'external', label_uk: '', label_en: '' }] })}
                >
                  <Plus size={13} /> Add Link
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {form.links.map((link, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'var(--admin-secondary)', borderRadius: 'var(--admin-radius-sm)', position: 'relative', border: '1px solid var(--admin-border)' }}>
                    <button type="button" className={`${styles.btnIcon}`} onClick={() => setForm({ ...form, links: form.links.filter((_, idx) => idx !== i) })} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '28px', height: '28px', minWidth: 'auto', minHeight: 'auto', padding: 0 }}>
                      <X size={14} />
                    </button>
                    <div className={styles.formGroup} style={{ paddingRight: '2rem' }}>
                      <label className={styles.label} style={{ fontSize: '0.65rem' }}>URL</label>
                      <input className={styles.input} value={link.url} onChange={e => { const u = [...form.links]; u[i] = { ...u[i], url: e.target.value }; setForm({ ...form, links: u }); }} placeholder="https://..." />
                    </div>
                    <div className={styles.formGrid3}>
                      <div className={styles.formGroup}>
                        <label className={styles.label} style={{ fontSize: '0.65rem' }}>Type</label>
                        <select className={`${styles.input} ${styles.select}`} value={link.type} onChange={e => { const u = [...form.links]; u[i] = { ...u[i], type: e.target.value as 'video' | 'external' }; setForm({ ...form, links: u }); }}>
                          <option value="external">External</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label} style={{ fontSize: '0.65rem' }}>Label (UK)</label>
                        <input className={styles.input} value={link.label_uk} onChange={e => { const u = [...form.links]; u[i] = { ...u[i], label_uk: e.target.value }; setForm({ ...form, links: u }); }} placeholder="Детальніше" />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label} style={{ fontSize: '0.65rem' }}>Label (EN)</label>
                        <input className={styles.input} value={link.label_en} onChange={e => { const u = [...form.links]; u[i] = { ...u[i], label_en: e.target.value }; setForm({ ...form, links: u }); }} placeholder="Read more" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Article'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={`${styles.btn} ${styles.btnSecondary}`}>
              Cancel
            </button>
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
          <h1 className={styles.pageTitle}>News</h1>
          <p className={styles.pageSubtitle}>{items.length} article{items.length !== 1 ? 's' : ''} published</p>
        </div>
        <div className={styles.pageActions}>
          <button onClick={openCreate} className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={15} /> Add News
          </button>
        </div>
      </div>

      {formModal}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete news article?"
        message={`"${deleteTarget?.title?.uk || deleteTarget?.id}" will be permanently removed.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {loading ? (
        <SkeletonRows rows={6} cols={5} />
      ) : items.length === 0 ? (
        <div className={`${styles.card} ${styles.emptyState}`}>
          <div className={styles.emptyStateIcon}><Newspaper size={28} strokeWidth={1.5} /></div>
          <p className={styles.emptyStateTitle}>No news yet</p>
          <p className={styles.emptyStateText}>Create your first news article to get started.</p>
          <button onClick={openCreate} className={`${styles.btn} ${styles.btnPrimary}`}><Plus size={15} /> Add News</button>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {items.map((item, idx) => (
            <div
              key={item._id || item.id}
              className={styles.cardItem}
              draggable
              onDragStart={e => { setDragIndex(idx); handleDragStart(e, idx); }}
              onDragOver={e => handleDragOver(e, idx, dragIndex)}
              onDragLeave={handleDragLeave}
              onDrop={e => { handleDrop(e, idx, dragIndex, reorderItem); setDragIndex(null); }}
              onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
            >
              <div className={styles.cardImageWrapper}>
                {item.image ? (
                  <img src={item.image} alt={item.title?.en || item.title?.uk || ''} loading="lazy" />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <Newspaper size={32} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: '6px', padding: '6px', color: 'rgba(255,255,255,0.9)', cursor: 'grab', display: 'flex' }} title="Drag to reorder">
                  <GripVertical size={16} />
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardStatus} style={{ background: 'var(--admin-secondary)', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                    {item.date || 'No Date'}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{item.title?.uk || item.id}</h3>
                {item.title?.en && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    {item.title.en}
                  </div>
                )}
                <div className={styles.cardActions}>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`} style={{ minWidth: 28, minHeight: 26, padding: 0 }} title="Move up">
                      <ChevronUp size={13} />
                    </button>
                    <button onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`} style={{ minWidth: 28, minHeight: 26, padding: 0 }} title="Move down">
                      <ChevronDown size={13} />
                    </button>
                  </div>
                  <button onClick={() => openEdit(item)} className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`} style={{ flex: 1 }}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`} style={{ flex: 1 }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
