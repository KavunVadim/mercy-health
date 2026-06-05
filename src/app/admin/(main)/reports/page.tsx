'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '../admin.module.css';
import RichEditor from '@/components/admin/RichEditor';

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

export default function AdminReportsPage() {
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Report | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title_uk: '', title_en: '', period: '', year: new Date().getFullYear().toString(),
    date: '', url: '', total_collected: '', donations_count: '',
    summary_uk: '', summary_en: '', raised: '', spent: '', projects_count: '',
  });
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    try { const r = await fetch('/api/admin/reports'); if (r.ok) setItems(await r.json()); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

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
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditing(null); loadItems(); resetForm(); }
    } finally { setSaving(false); }
  }

  function resetForm() {
    setForm({ title_uk: '', title_en: '', period: '', year: new Date().getFullYear().toString(), date: '', url: '', total_collected: '', donations_count: '', summary_uk: '', summary_en: '', raised: '', spent: '', projects_count: '' });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this report?')) return;
    try { await fetch(`/api/admin/reports/${id}`, { method: 'DELETE' }); loadItems(); } catch (e) { console.error(e); }
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
      raised: (st?.raised || '').toString(), spent: (st?.spent || '').toString(), projects_count: (st?.projects_count || '').toString(),
    });
    setShowForm(true);
  }

  function openCreate() { setEditing(null); resetForm(); setShowForm(true); }

  if (loading) return <p style={{ color: '#64748b' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Reports ({items.length})</h2>
        <button onClick={openCreate} className={styles.loginButton} style={{ width: 'auto', padding: '0.6rem 1.2rem', margin: 0 }}>+ Add Report</button>
      </div>

      {showForm && (
        <div className={styles.loginWrapper} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', padding: 0 }}>
          <div style={{ background: '#f1f5f9', width: '100%', height: '100%', overflow: 'auto', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{editing ? 'Edit Report' : 'Add Report'}</h3>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem', color: '#64748b' }}>✕</button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Title (UK)</label>
                  <input className={styles.loginInput} value={form.title_uk} onChange={e => setForm({ ...form, title_uk: e.target.value })} required />
                </div>
                <div>
                  <label className={styles.loginLabel}>Title (EN)</label>
                  <input className={styles.loginInput} value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Period</label>
                  <input className={styles.loginInput} value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="2025-Q1" />
                </div>
                <div>
                  <label className={styles.loginLabel}>Year</label>
                  <input className={styles.loginInput} type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
                </div>
                <div>
                  <label className={styles.loginLabel}>Date</label>
                  <input className={styles.loginInput} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>

              <label className={styles.loginLabel}>PDF URL</label>
              <input className={styles.loginInput} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="/reports/q1-2025.pdf" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Total Collected (UAH)</label>
                  <input className={styles.loginInput} type="number" value={form.total_collected} onChange={e => setForm({ ...form, total_collected: e.target.value })} />
                </div>
                <div>
                  <label className={styles.loginLabel}>Donations Count</label>
                  <input className={styles.loginInput} type="number" value={form.donations_count} onChange={e => setForm({ ...form, donations_count: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <RichEditor
                    label="Summary (UK)"
                    value={form.summary_uk}
                    onChange={v => setForm({ ...form, summary_uk: v })}
                    height={180}
                  />
                </div>
                <div>
                  <RichEditor
                    label="Summary (EN)"
                    value={form.summary_en}
                    onChange={v => setForm({ ...form, summary_en: v })}
                    height={180}
                  />
                </div>
              </div>

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <h4 style={{ margin: '0 0 0.75rem', color: '#475569' }}>Stats Breakdown</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Raised (UAH)</label>
                  <input className={styles.loginInput} type="number" value={form.raised} onChange={e => setForm({ ...form, raised: e.target.value })} />
                </div>
                <div>
                  <label className={styles.loginLabel}>Spent (UAH)</label>
                  <input className={styles.loginInput} type="number" value={form.spent} onChange={e => setForm({ ...form, spent: e.target.value })} />
                </div>
                <div>
                  <label className={styles.loginLabel}>Projects Count</label>
                  <input className={styles.loginInput} type="number" value={form.projects_count} onChange={e => setForm({ ...form, projects_count: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" disabled={saving} className={styles.loginButton} style={{ flex: 1, padding: '0.8rem 2rem' }}>
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Report'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className={styles.loginButton} style={{ flex: '0 0 auto', padding: '0.8rem 2rem', background: '#64748b', width: 'auto' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No reports yet.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.responsiveTable} style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Period</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Collected</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td data-label="Title" style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                    <div>{(item.title as any)?.uk || item.id}</div>
                    {(item.title as any)?.en && <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{(item.title as any).en}</div>}
                  </td>
                  <td data-label="Period" style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>{item.period || '—'}</td>
                  <td data-label="Collected" style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>{item.total_collected ? `${(item.total_collected / 1000000).toFixed(1)}M` : '—'}</td>
                  <td data-label="Actions" style={{ padding: '0.75rem 1rem' }}>
                    <button onClick={() => openEdit(item)} style={{ marginRight: '0.5rem', padding: '0.35rem 0.75rem', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ padding: '0.35rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No reports yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
