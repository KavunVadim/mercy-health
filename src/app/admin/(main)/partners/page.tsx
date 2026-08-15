'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Pencil, Trash2, Users } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';
import { useToast } from '@/components/admin/ui/Toast';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { SkeletonRows } from '@/components/admin/ui/Skeleton';
import type { AdminPartner } from '@/types/admin';

const CATEGORIES = ['other', 'media', 'medical', 'charity', 'government'];

export default function AdminPartnersPage() {
  const [items, setItems] = useState<AdminPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminPartner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name_uk: '', name_en: '', logo: '', url: '', category: 'other' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminPartner | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { success, error } = useToast();

  const loadItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/partners');
      if (res.ok) setItems(await res.json());
      else error('Failed to load partners');
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
      const body = { name: { uk: form.name_uk, en: form.name_en }, logo: form.logo, url: form.url, category: form.category };
      const res = await fetch(
        editing ? `/api/admin/partners/${editing.id}` : '/api/admin/partners',
        { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      if (res.ok) { setShowForm(false); setEditing(null); loadItems(); success(editing ? 'Partner updated' : 'Partner added'); }
      else error('Save failed');
    } catch { error('Network error'); }
    finally { setSaving(false); }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/partners/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { loadItems(); success('Partner deleted'); }
      else error('Delete failed');
    } catch { error('Network error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  }

  function openEdit(item: AdminPartner) {
    setEditing(item);
    setForm({ name_uk: item.name?.uk || '', name_en: item.name?.en || '', logo: item.logo || '', url: item.url || '', category: item.category || 'other' });
    setShowForm(true);
  }

  const formModal = showForm && createPortal(
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
      <div className={styles.modal} style={{ maxWidth: 560 }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{editing ? 'Edit Partner' : 'Add Partner'}</h2>
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
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Website URL</label>
                <input className={styles.input} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select className={`${styles.input} ${styles.select}`} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Partner'}</button>
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
          <h1 className={styles.pageTitle}>Partners</h1>
          <p className={styles.pageSubtitle}>{items.length} organization partner{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className={styles.pageActions}>
          <button onClick={() => { setEditing(null); setForm({ name_uk: '', name_en: '', logo: '', url: '', category: 'other' }); setShowForm(true); }} className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={15} /> Add Partner
          </button>
        </div>
      </div>

      {formModal}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete partner?"
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
          <div className={styles.emptyStateIcon}><Users size={28} strokeWidth={1.5} /></div>
          <p className={styles.emptyStateTitle}>No partners yet</p>
          <p className={styles.emptyStateText}>Add organizations that partner with Mercy Health.</p>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className={`${styles.btn} ${styles.btnPrimary}`}><Plus size={15} /> Add Partner</button>
        </div>
      ) : (
        <div className={styles.cardGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {items.map(item => (
            <div key={item.id} className={styles.cardItem} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', marginTop: '0.5rem' }}>
                {item.logo ? (
                  <img src={item.logo} alt={item.name?.uk || ''} style={{ width: '80px', height: '80px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.5rem', border: '1px solid var(--admin-border)' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', background: 'var(--admin-secondary)', borderRadius: '12px', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={32} color="var(--admin-text-muted)" />
                  </div>
                )}
              </div>
              <h3 className={styles.cardTitle} style={{ fontSize: '1rem' }}>{item.name?.uk}</h3>
              {item.name?.en && (
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>{item.name.en}</div>
              )}
              <div style={{ margin: '0.75rem 0' }}>
                <span className={`${styles.badge} ${styles.badgeSecondary}`}>{item.category || 'other'}</span>
              </div>
              <div className={styles.cardActions} style={{ paddingTop: '0.75rem' }}>
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
