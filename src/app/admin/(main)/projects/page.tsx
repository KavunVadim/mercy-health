'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, GripVertical, Pencil, Trash2, FolderOpen, ChevronUp, ChevronDown } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';
import GalleryEditor from '@/components/admin/GalleryEditor';
import RichEditor from '@/components/admin/RichEditor';
import { saveReorder, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } from '@/lib/dnd-reorder';
import { slugify, arrToText, textToArr } from '@/lib/data-utils';
import { useToast } from '@/components/admin/ui/Toast';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { SkeletonRows } from '@/components/admin/ui/Skeleton';
import type { AdminProject } from '@/types/admin';

interface FormLink {
  url: string;
  type: 'video' | 'external';
  label_uk: string;
  label_en: string;
}

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  active:    { label: 'Active',    badge: styles.badgePrimary },
  planned:   { label: 'Planned',   badge: styles.badgeWarning },
  completed: { label: 'Completed', badge: styles.badgeSuccess },
};

const emptyForm = () => ({
  title_uk: '', title_en: '',
  description_uk: '', description_en: '',
  full_description_uk: '', full_description_en: '',
  image: '', image_focus: '', gallery: '', status: 'active',
  links: [] as FormLink[],
});

export default function AdminProjectsPage() {
  const [items, setItems] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProject | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { success, error } = useToast();

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) setItems(await res.json());
      else error('Failed to load projects');
    } catch { error('Network error'); }
    finally { setLoading(false); }
  }, [error]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = slugify(form.title_uk || form.title_en, 'project');
      const activeLinks = form.links.filter(l => l.url.trim());
      const body: Record<string, unknown> = {
        id: slug, image: form.image,
        image_focus: form.image_focus || undefined,
        title: { uk: form.title_uk, en: form.title_en },
        description: { uk: form.description_uk, en: form.description_en },
        full_description: { uk: form.full_description_uk, en: form.full_description_en },
        gallery: textToArr(form.gallery), status: form.status,
        links: activeLinks.map(l => ({ url: l.url, type: l.type, label: { uk: l.label_uk, en: l.label_en } })),
      };
      const url = editing ? `/api/admin/projects/${editing._id || editing.id}` : '/api/admin/projects';
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        setShowForm(false); setEditing(null); fetchItems();
        success(editing ? 'Project updated' : 'Project created');
      } else error('Save failed');
    } catch { error('Network error'); }
    finally { setSaving(false); }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteTarget._id || deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { fetchItems(); success('Project deleted'); }
      else error('Delete failed');
    } catch { error('Network error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  }

  function moveItem(from: number, direction: -1 | 1) {
    const to = from + direction;
    if (to < 0 || to >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    saveReorder('projects', updated);
  }

  async function reorderItem(from: number, to: number) {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    await saveReorder('projects', updated);
  }

  function openEdit(item: AdminProject) {
    setEditing(item);
    setForm({
      title_uk: item.title?.uk || '',
      title_en: item.title?.en || '',
      description_uk: item.description?.uk || '',
      description_en: item.description?.en || '',
      full_description_uk: item.full_description?.uk || '',
      full_description_en: item.full_description?.en || '',
      image: item.image || '',
      image_focus: item.image_focus || '',
      gallery: arrToText(item.gallery),
      status: item.status || 'active',
      links: (item.links || []).map(l => ({ url: l.url || '', type: l.type || 'external', label_uk: l.label?.uk || '', label_en: l.label?.en || '' })),
    });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null); setForm(emptyForm()); setShowForm(true);
  }

  const formModal = showForm && createPortal(
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
      <div className={`${styles.modal} ${styles.modalLarge}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{editing ? 'Edit Project' : 'New Project'}</h2>
          <button className={styles.btnIcon} onClick={() => setShowForm(false)} aria-label="Close"><X size={16} /></button>
        </div>
        <form onSubmit={handleSave}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title (Ukrainian)</label>
                <input className={styles.input} value={form.title_uk} onChange={e => setForm({ ...form, title_uk: e.target.value })} required placeholder="Назва проекту" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title (English)</label>
                <input className={styles.input} value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} placeholder="Project title" />
              </div>
            </div>

            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Main Image</label>
                <ImageUploader value={form.image} onChange={v => setForm({ ...form, image: v })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Status</label>
                  <select className={`${styles.input} ${styles.select}`} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="planned">Planned</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Image Focus <span style={{ fontWeight: 400, textTransform: 'none' }}>(object-position)</span></label>
                  <input className={styles.input} value={form.image_focus} onChange={e => setForm({ ...form, image_focus: e.target.value })} placeholder="50% 80%" />
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', lineHeight: 1.4, color: 'var(--admin-text-muted)' }}>
                    Controls which part of the image is visible. First value = horizontal, second = vertical.
                    Examples: <code style={{ background: 'var(--admin-secondary)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.7rem' }}>50% 50%</code> (center),
                    <code style={{ background: 'var(--admin-secondary)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.7rem' }}>50% 0%</code> (top),
                    <code style={{ background: 'var(--admin-secondary)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.7rem' }}>30% 80%</code> (custom).
                  </p>
                </div>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div><RichEditor label="Card Description (Ukrainian)" value={form.description_uk} onChange={v => setForm({ ...form, description_uk: v })} height={160} /></div>
              <div><RichEditor label="Card Description (English)" value={form.description_en} onChange={v => setForm({ ...form, description_en: v })} height={160} /></div>
            </div>

            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div><RichEditor label="Full Description (Ukrainian)" value={form.full_description_uk} onChange={v => setForm({ ...form, full_description_uk: v })} height={280} /></div>
              <div><RichEditor label="Full Description (English)" value={form.full_description_en} onChange={v => setForm({ ...form, full_description_en: v })} height={280} /></div>
            </div>

            <hr className={styles.divider} />

            <div style={{ marginBottom: '1.5rem' }}>
              <GalleryEditor label="Gallery Images" value={textToArr(form.gallery)} onChange={v => setForm({ ...form, gallery: arrToText(v) })} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label className={styles.label} style={{ margin: 0 }}>External Links</label>
                <button type="button" className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`} onClick={() => setForm({ ...form, links: [...form.links, { url: '', type: 'external', label_uk: '', label_en: '' }] })}>
                  <Plus size={13} /> Add Link
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {form.links.map((link, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 90px 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                    <div className={styles.formGroup}><label className={styles.label} style={{ fontSize: '0.65rem' }}>URL</label><input className={styles.input} value={link.url} onChange={e => { const u=[...form.links]; u[i]={...u[i],url:e.target.value}; setForm({...form,links:u}); }} placeholder="https://..." /></div>
                    <div className={styles.formGroup}><label className={styles.label} style={{ fontSize: '0.65rem' }}>Type</label><select className={`${styles.input} ${styles.select}`} value={link.type} onChange={e => { const u=[...form.links]; u[i]={...u[i],type:e.target.value as 'video'|'external'}; setForm({...form,links:u}); }}><option value="external">External</option><option value="video">Video</option></select></div>
                    <div className={styles.formGroup}><label className={styles.label} style={{ fontSize: '0.65rem' }}>Label (UK)</label><input className={styles.input} value={link.label_uk} onChange={e => { const u=[...form.links]; u[i]={...u[i],label_uk:e.target.value}; setForm({...form,links:u}); }} placeholder="Детальніше" /></div>
                    <div className={styles.formGroup}><label className={styles.label} style={{ fontSize: '0.65rem' }}>Label (EN)</label><input className={styles.input} value={link.label_en} onChange={e => { const u=[...form.links]; u[i]={...u[i],label_en:e.target.value}; setForm({...form,links:u}); }} placeholder="Read more" /></div>
                    <button type="button" className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`} onClick={() => setForm({ ...form, links: form.links.filter((_, idx) => idx !== i) })} style={{ marginBottom: 1 }}><X size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Project'}</button>
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
          <h1 className={styles.pageTitle}>Projects</h1>
          <p className={styles.pageSubtitle}>{items.length} project{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className={styles.pageActions}>
          <button onClick={openCreate} className={`${styles.btn} ${styles.btnPrimary}`}><Plus size={15} /> Add Project</button>
        </div>
      </div>

      {formModal}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project?"
        message={`"${deleteTarget?.title?.uk || deleteTarget?.id}" will be permanently removed.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {loading ? (
        <SkeletonRows rows={5} cols={5} />
      ) : items.length === 0 ? (
        <div className={`${styles.card} ${styles.emptyState}`}>
          <div className={styles.emptyStateIcon}><FolderOpen size={28} strokeWidth={1.5} /></div>
          <p className={styles.emptyStateTitle}>No projects yet</p>
          <p className={styles.emptyStateText}>Add your first project to display on the website.</p>
          <button onClick={openCreate} className={`${styles.btn} ${styles.btnPrimary}`}><Plus size={15} /> Add Project</button>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {items.map((item, idx) => {
            const s = STATUS_LABELS[item.status || ''] || STATUS_LABELS.active;
            return (
              <div
                key={item._id || item.id}
                draggable
                onDragStart={e => { setDragIndex(idx); handleDragStart(e, idx); }}
                onDragOver={e => { handleDragOver(e, idx, dragIndex, reorderItem); }}
                onDragLeave={handleDragLeave}
                onDrop={e => { handleDrop(e, idx, dragIndex, reorderItem); setDragIndex(null); }}
                onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
                className={styles.cardItem}
                style={{ cursor: 'grab', userSelect: 'none' }}
              >
                <div className={styles.cardImageWrapper}>
                  {item.image ? (
                    <img src={item.image} alt={item.title?.en || item.title?.uk || ''} loading="lazy" />
                  ) : (
                    <div className={styles.cardImagePlaceholder}>
                      <FolderOpen size={32} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: '6px', padding: '6px', color: 'rgba(255,255,255,0.9)', cursor: 'grab', display: 'flex' }} title="Drag to reorder">
                    <GripVertical size={16} />
                  </div>
                  <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    <span className={`${styles.badge} ${s.badge}`} style={{ backdropFilter: 'blur(4px)' }}>
                      {s.label}
                    </span>
                  </div>
                </div>
                <div className={styles.cardBody}>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
