'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '../admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';
import RichEditor from '@/components/admin/RichEditor';
import { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd, saveReorder } from '@/lib/dnd-reorder';

interface Slide {
  id: string;
  badge_uk: string; badge_en: string;
  title_uk: string; title_en: string;
  description_uk: string; description_en: string;
  image: string; href: string; focus: string;
  cta_uk: string; cta_en: string;
  _id?: string;
  order?: number;
}

export default function AdminHeroSliderPage() {
  const [items, setItems] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    badge_uk: '', badge_en: '', title_uk: '', title_en: '',
    description_uk: '', description_en: '',
    image: '', href: '', focus: '', cta_uk: '', cta_en: '',
  });
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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
    try { const r = await fetch('/api/admin/hero-slider'); if (r.ok) setItems(await r.json()); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/admin/hero-slider/${editing.id}` : '/api/admin/hero-slider';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setShowForm(false); setEditing(null); loadItems(); }
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this slide?')) return;
    try { await fetch(`/api/admin/hero-slider/${id}`, { method: 'DELETE' }); loadItems(); } catch (e) { console.error(e); }
  }

  function openEdit(item: Slide) {
    setEditing(item);
    setForm({
      badge_uk: item.badge_uk, badge_en: item.badge_en,
      title_uk: item.title_uk, title_en: item.title_en,
      description_uk: item.description_uk, description_en: item.description_en,
      image: item.image, href: item.href, focus: item.focus,
      cta_uk: item.cta_uk, cta_en: item.cta_en,
    });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setForm({ badge_uk: '', badge_en: '', title_uk: '', title_en: '', description_uk: '', description_en: '', image: '', href: '', focus: '', cta_uk: '', cta_en: '' });
    setShowForm(true);
  }

  if (loading) return <p style={{ color: '#64748b' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Hero Slider ({items.length})</h2>
        <button onClick={openCreate} className={styles.loginButton} style={{ width: 'auto', padding: '0.6rem 1.2rem', margin: 0 }}>+ Add Slide</button>
      </div>

      {showForm && (
        <div className={styles.loginWrapper} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', padding: 0 }}>
          <div style={{ background: '#f1f5f9', width: '100%', height: '100%', overflow: 'auto', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{editing ? 'Edit Slide' : 'Add Slide'}</h3>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem', color: '#64748b' }}>✕</button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Badge (UK)</label>
                  <input className={styles.loginInput} value={form.badge_uk} onChange={e => setForm({ ...form, badge_uk: e.target.value })} placeholder="Проєкт" />
                </div>
                <div>
                  <label className={styles.loginLabel}>Badge (EN)</label>
                  <input className={styles.loginInput} value={form.badge_en} onChange={e => setForm({ ...form, badge_en: e.target.value })} placeholder="Project" />
                </div>
              </div>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <RichEditor
                    label="Description (UK)"
                    value={form.description_uk}
                    onChange={v => setForm({ ...form, description_uk: v })}
                    height={160}
                  />
                </div>
                <div>
                  <RichEditor
                    label="Description (EN)"
                    value={form.description_en}
                    onChange={v => setForm({ ...form, description_en: v })}
                    height={160}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>CTA Label (UK)</label>
                  <input className={styles.loginInput} value={form.cta_uk} onChange={e => setForm({ ...form, cta_uk: e.target.value })} placeholder="Підтримати" />
                </div>
                <div>
                  <label className={styles.loginLabel}>CTA Label (EN)</label>
                  <input className={styles.loginInput} value={form.cta_en} onChange={e => setForm({ ...form, cta_en: e.target.value })} placeholder="Support" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Background Image</label>
                  <ImageUploader value={form.image} onChange={v => setForm({ ...form, image: v })} />
                </div>
                <div>
                  <label className={styles.loginLabel}>Link URL</label>
                  <input className={styles.loginInput} value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} placeholder="https://..." />
                  <label className={styles.loginLabel} style={{ marginTop: '0.5rem' }}>Image Focus <span style={{ fontWeight: 400, color: '#94a3b8' }}>(CSS object-position)</span></label>
                  <input className={styles.loginInput} value={form.focus} onChange={e => setForm({ ...form, focus: e.target.value })} placeholder="50% 80%" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" disabled={saving} className={styles.loginButton} style={{ flex: 1, padding: '0.8rem 2rem' }}>
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Slide'}
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
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No slides yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={e => { setDragIndex(idx); handleDragStart(e, idx); }}
              onDragOver={e => { handleDragOver(e, idx, dragIndex, reorderItem); }}
              onDragLeave={handleDragLeave}
              onDrop={e => { handleDrop(e, idx, dragIndex, reorderItem); setDragIndex(null); }}
              onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
              style={{ background: 'white', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'grab', userSelect: 'none' }}
            >
              <span style={{ color: '#cbd5e1', fontSize: '1.1rem', cursor: 'grab', flexShrink: 0 }}>⠿</span>
              {item.image && <img src={item.image} alt="" style={{ width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover', background: '#f1f5f9', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.title_uk || item.title_en || item.id}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.badge_uk}{item.badge_en ? ` / ${item.badge_en}` : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                <button onClick={() => openEdit(item)} style={{ padding: '0.35rem 0.75rem', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ padding: '0.35rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
