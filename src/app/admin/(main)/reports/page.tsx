'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Pencil, Trash2, FileText } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import RichEditor from '@/components/admin/RichEditor';
import { useToast } from '@/components/admin/ui/Toast';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { SkeletonRows } from '@/components/admin/ui/Skeleton';

interface Report {
  id: string;
  title?: { uk: string; en: string };
  period?: string;
  year?: number;
  date?: string;
  url?: string;
  pdf_url?: string;
  total_collected?: number;
  donations_count?: number;
  summary?: { uk: string; en: string };
  stats?: { raised?: number; spent?: number; projects_count?: number };
}

function formatMoney(n?: number) {
  if (!n) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const emptyForm = () => ({
  title_uk: '', title_en: '', period: '', year: new Date().getFullYear().toString(),
  date: '', url: '', total_collected: '', donations_count: '',
  summary_uk: '', summary_en: '', raised: '', spent: '', projects_count: '',
});

export default function AdminReportsPage() {
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Report | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { success, error } = useToast();

  const loadItems = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/reports');
      if (r.ok) setItems(await r.json());
      else error('Failed to load reports');
    } catch { error('Network error'); }
    finally { setLoading(false); }
  }, [error]);

  useEffect(() => { loadItems(); }, [loadItems]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        title: { uk: form.title_uk, en: form.title_en },
        period: form.period, year: parseInt(form.year) || 0, date: form.date, url: form.url, pdf_url: form.url,
        total_collected: parseFloat(form.total_collected) || 0,
        donations_count: parseInt(form.donations_count) || 0,
        summary: { uk: form.summary_uk, en: form.summary_en },
        stats: {
          raised: parseFloat(form.raised) || 0,
          spent: parseFloat(form.spent) || 0,
          projects_count: parseInt(form.projects_count) || 0,
        },
      };
      const url = editing ? `/api/admin/reports/${editing.id}` : '/api/admin/reports';
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        setShowForm(false); setEditing(null); loadItems();
        success(editing ? 'Report updated' : 'Report created');
      } else error('Save failed');
    } catch { error('Network error'); }
    finally { setSaving(false); }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reports/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) { loadItems(); success('Report deleted'); }
      else error('Delete failed');
    } catch { error('Network error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  }

  function openEdit(item: Report) {
    setEditing(item);
    const t = item.title as any, s = item.summary as any, st = item.stats as any;
    setForm({
      title_uk: t?.uk || '', title_en: t?.en || '',
      period: item.period || '', year: (item.year || '').toString(),
      date: item.date || '', url: item.url || '',
      total_collected: (item.total_collected || '').toString(),
      donations_count: (item.donations_count || '').toString(),
      summary_uk: s?.uk || '', summary_en: s?.en || '',
      raised: (st?.raised || '').toString(), spent: (st?.spent || '').toString(),
      projects_count: (st?.projects_count || '').toString(),
    });
    setShowForm(true);
  }

  function openCreate() { setEditing(null); setForm(emptyForm()); setShowForm(true); }

  const formModal = showForm && createPortal(
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{editing ? 'Edit Report' : 'New Report'}</h2>
          <button className={styles.btnIcon} onClick={() => setShowForm(false)} aria-label="Close"><X size={16} /></button>
        </div>
        <form onSubmit={handleSave}>
          <div className={styles.modalBody}>
            {/* Titles */}
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}><label className={styles.label}>Title (Ukrainian)</label><input className={styles.input} value={form.title_uk} onChange={e => setForm({...form, title_uk: e.target.value})} required placeholder="Назва звіту" /></div>
              <div className={styles.formGroup}><label className={styles.label}>Title (English)</label><input className={styles.input} value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} placeholder="Report title" /></div>
            </div>

            {/* Period/Year/Date */}
            <div className={styles.formGrid3} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}><label className={styles.label}>Period</label><input className={styles.input} value={form.period} onChange={e => setForm({...form, period: e.target.value})} placeholder="2025-Q1" /></div>
              <div className={styles.formGroup}><label className={styles.label}>Year</label><input className={styles.input} type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} /></div>
              <div className={styles.formGroup}><label className={styles.label}>Date</label><input className={styles.input} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            </div>

            {/* PDF URL */}
            <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
              <label className={styles.label}>PDF URL</label>
              <input className={styles.input} value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="/reports/q1-2025.pdf" />
            </div>

            {/* Finances */}
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.formGroup}><label className={styles.label}>Total Collected (UAH)</label><input className={styles.input} type="number" value={form.total_collected} onChange={e => setForm({...form, total_collected: e.target.value})} /></div>
              <div className={styles.formGroup}><label className={styles.label}>Donations Count</label><input className={styles.input} type="number" value={form.donations_count} onChange={e => setForm({...form, donations_count: e.target.value})} /></div>
            </div>

            <hr className={styles.divider} />

            {/* Summary */}
            <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
              <div><RichEditor label="Summary (Ukrainian)" value={form.summary_uk} onChange={v => setForm({...form, summary_uk: v})} height={180} /></div>
              <div><RichEditor label="Summary (English)" value={form.summary_en} onChange={v => setForm({...form, summary_en: v})} height={180} /></div>
            </div>

            <hr className={styles.divider} />

            {/* Stats */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div className={styles.sectionTitle}>Stats Breakdown</div>
            </div>
            <div className={styles.formGrid3}>
              <div className={styles.formGroup}><label className={styles.label}>Raised (UAH)</label><input className={styles.input} type="number" value={form.raised} onChange={e => setForm({...form, raised: e.target.value})} /></div>
              <div className={styles.formGroup}><label className={styles.label}>Spent (UAH)</label><input className={styles.input} type="number" value={form.spent} onChange={e => setForm({...form, spent: e.target.value})} /></div>
              <div className={styles.formGroup}><label className={styles.label}>Projects Count</label><input className={styles.input} type="number" value={form.projects_count} onChange={e => setForm({...form, projects_count: e.target.value})} /></div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Report'}</button>
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
          <h1 className={styles.pageTitle}>Reports</h1>
          <p className={styles.pageSubtitle}>{items.length} financial report{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className={styles.pageActions}>
          <button onClick={openCreate} className={`${styles.btn} ${styles.btnPrimary}`}><Plus size={15} /> Add Report</button>
        </div>
      </div>

      {formModal}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete report?"
        message={`"${(deleteTarget?.title as any)?.uk || deleteTarget?.id}" will be permanently removed.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {loading ? (
        <SkeletonRows rows={5} cols={4} />
      ) : items.length === 0 ? (
        <div className={`${styles.card} ${styles.emptyState}`}>
          <div className={styles.emptyStateIcon}><FileText size={28} strokeWidth={1.5} /></div>
          <p className={styles.emptyStateTitle}>No reports yet</p>
          <p className={styles.emptyStateText}>Add financial reports to display transparency to donors.</p>
          <button onClick={openCreate} className={`${styles.btn} ${styles.btnPrimary}`}><Plus size={15} /> Add Report</button>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {items.map(item => (
            <div key={item.id} className={styles.cardItem}>
              <div className={styles.cardImageWrapper} style={{ height: '140px' }}>
                <div className={styles.cardImagePlaceholder}>
                  <FileText size={32} />
                </div>
                {/* Period Badge Over Image */}
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <span className={styles.cardStatus} style={{ background: 'var(--admin-secondary)', color: 'var(--admin-text-secondary)', backdropFilter: 'blur(4px)' }}>
                    {item.period || '—'} {item.year ? ` ${item.year}` : ''}
                  </span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{(item.title as any)?.uk || item.id}</h3>
                {(item.title as any)?.en && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    {(item.title as any).en}
                  </div>
                )}
                
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Collected</div>
                    <div style={{ fontFamily: 'var(--admin-mono)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-success)' }}>
                      {formatMoney(item.total_collected)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Donations</div>
                    <div style={{ fontFamily: 'var(--admin-mono)', fontSize: '0.9rem', color: 'var(--admin-text-secondary)' }}>
                      {item.donations_count ?? '—'}
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button onClick={() => openEdit(item)} className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`}>
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
