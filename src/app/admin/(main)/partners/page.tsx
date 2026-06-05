'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';
import { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd, saveReorder } from '@/lib/dnd-reorder';

interface Partner {
  _id?: string;
  id: string;
  name?: { uk: string; en: string };
  logo?: string;
  url?: string;
  category?: string;
}

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name_uk: '', name_en: '', logo: '', url: '', category: 'other' });
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function reorderItem(from: number, to: number) {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    saveReorder('partners', updated);
  }

  const loadItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/partners');
      if (res.ok) setItems(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: { uk: form.name_uk, en: form.name_en },
        logo: form.logo, url: form.url, category: form.category,
      };
      const url = editing ? `/api/admin/partners/${editing.id}` : '/api/admin/partners';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditing(null); setForm({ name_uk: '', name_en: '', logo: '', url: '', category: 'other' }); loadItems(); }
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this partner?')) return;
    try { await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' }); loadItems(); } catch (e) { console.error(e); }
  }

  function openEdit(item: Partner) {
    setEditing(item);
    const n = item.name as any;
    setForm({ name_uk: n?.uk || '', name_en: n?.en || '', logo: item.logo || '', url: item.url || '', category: item.category || 'other' });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name_uk: '', name_en: '', logo: '', url: '', category: 'other' });
    setShowForm(true);
  }

  if (loading) return <p style={{ color: '#64748b' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Partners ({items.length})</h2>
        <button onClick={openCreate} className={styles.loginButton} style={{ width: 'auto', padding: '0.6rem 1.2rem', margin: 0 }}>+ Add Partner</button>
      </div>

      {showForm && (
        <div className={styles.loginWrapper} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)' }}>
          <div className={styles.loginCard} style={{ maxWidth: '600px' }}>
            <h3 style={{ marginTop: 0 }}>{editing ? 'Edit Partner' : 'Add Partner'}</h3>
            <form onSubmit={handleSave}>
              <div className={styles.formGrid}>
                <div><label className={styles.loginLabel}>Name (UK)</label><input className={styles.loginInput} value={form.name_uk} onChange={e => setForm({ ...form, name_uk: e.target.value })} required /></div>
                <div><label className={styles.loginLabel}>Name (EN)</label><input className={styles.loginInput} value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
              </div>
              <div className={styles.formGrid}>
                <div><label className={styles.loginLabel}>Logo</label><ImageUploader value={form.logo} onChange={v => setForm({ ...form, logo: v })} /></div>
                <div><label className={styles.loginLabel}>Website URL</label><input className={styles.loginInput} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} /></div>
              </div>
              <label className={styles.loginLabel}>Category</label>
              <select className={styles.loginInput} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="other">Other</option><option value="media">Media</option><option value="medical">Medical</option><option value="charity">Charity</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" disabled={saving} className={styles.loginButton} style={{ flex: 1 }}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className={styles.loginButton} style={{ flex: 1, background: '#64748b' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper} style={{ background: 'white', borderRadius: '12px' }}>
        <table className={styles.responsiveTable} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', width: '32px' }}></th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Logo</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                draggable
                onDragStart={e => { setDragIndex(idx); handleDragStart(e, idx); }}
                onDragOver={e => { handleDragOver(e, idx, dragIndex, reorderItem); }}
                onDragLeave={handleDragLeave}
                onDrop={e => { handleDrop(e, idx, dragIndex, reorderItem); setDragIndex(null); }}
                onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
                style={{ borderTop: '1px solid #f1f5f9', cursor: 'grab', userSelect: 'none' }}
              >
                <td data-label="" style={{ padding: '0.75rem 0.5rem', color: '#cbd5e1', fontSize: '0.8rem', textAlign: 'center', cursor: 'grab' }}>⠿</td>
                <td data-label="Logo" style={{ padding: '0.75rem 1rem' }}>
                  {item.logo ? <img src={item.logo} alt="" style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'contain', background: '#f1f5f9' }} /> : '—'}
                </td>
                <td data-label="Name" style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                  <div>{(item.name as any)?.uk || item.id}</div>
                  {(item.name as any)?.en && <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{(item.name as any).en}</div>}
                </td>
                <td data-label="Category" style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>{item.category || 'other'}</td>
                <td data-label="Actions" style={{ padding: '0.75rem 1rem' }}>
                  <button onClick={() => openEdit(item)} style={{ marginRight: '0.5rem', padding: '0.35rem 0.75rem', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '0.35rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No partners yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
