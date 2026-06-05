'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';
import GalleryEditor from '@/components/admin/GalleryEditor';
import RichEditor from '@/components/admin/RichEditor';
import { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd, saveReorder } from '@/lib/dnd-reorder';

interface LinkEntry {
  url: string;
  type: 'video' | 'external';
  label_uk: string;
  label_en: string;
}

interface ProjectItem {
  _id?: string;
  id: string;
  title?: { uk: string; en: string };
  description?: { uk: string; en: string };
  full_description?: { uk: string; en: string };
  image?: string;
  gallery?: string[];
  status?: string;
  createdAt?: string;
  links?: { url: string; type?: 'video' | 'external'; label?: { uk: string; en: string } }[];
}

function slugify(text: string): string {
  const map: Record<string, string> = {
    а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',
    и:'y',і:'i',ї:'yi',й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',
    р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ю:'yu',я:'ya',
  };
  let s = text.toLowerCase().trim();
  s = s.replace(/[ьъ]/g, '');
  s = s.replace(/[а-яґєіїюя]/g, (ch) => map[ch] || ch);
  s = s.replace(/[^a-z0-9]+/g, '-');
  s = s.replace(/^-+|-+$/g, '');
  return s || 'project';
}

function arrToText(arr: string[] | undefined): string {
  return Array.isArray(arr) ? arr.join('\n') : '';
}

function textToArr(text: string): string[] {
  return text.split('\n').filter(s => s.trim());
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title_uk: '', title_en: '',
    description_uk: '', description_en: '',
    full_description_uk: '', full_description_en: '',
    image: '',
    gallery: '',
    status: 'active',
    links: [] as LinkEntry[],
  });
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function reorderItem(from: number, to: number) {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    saveReorder('projects', updated);
  }

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) setItems(await res.json());
    } catch (e) {
      console.error('Failed to fetch projects', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = slugify(form.title_uk || form.title_en);
      const activeLinks = form.links.filter(l => l.url.trim());
      const body: Record<string, unknown> = {
        id: slug,
        image: form.image,
        title: { uk: form.title_uk, en: form.title_en },
        description: { uk: form.description_uk, en: form.description_en },
        full_description: { uk: form.full_description_uk, en: form.full_description_en },
        gallery: textToArr(form.gallery),
        status: form.status,
        links: activeLinks.length > 0 ? activeLinks.map(l => ({
          url: l.url,
          type: l.type,
          label: { uk: l.label_uk, en: l.label_en },
        })) : undefined,
      };

      const url = editing ? `/api/admin/projects/${editing._id || editing.id}` : '/api/admin/projects';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        setForm({
          title_uk: '', title_en: '',
          description_uk: '', description_en: '',
          full_description_uk: '', full_description_en: '',
          image: '', gallery: '', status: 'active', links: [],
        });
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error('Failed to delete', e);
    }
  }

  function openEdit(item: ProjectItem) {
    setEditing(item);
    const existingLinks: LinkEntry[] = [];
    if (item.links && Array.isArray(item.links) && item.links.length > 0) {
      item.links.forEach((l: any) => {
        existingLinks.push({
          url: l.url || '',
          type: l.type === 'video' ? 'video' : 'external',
          label_uk: l.label?.uk || '',
          label_en: l.label?.en || '',
        });
      });
    }
    setForm({
      title_uk: (item.title as any)?.uk || '',
      title_en: (item.title as any)?.en || '',
      description_uk: (item.description as any)?.uk || '',
      description_en: (item.description as any)?.en || '',
      full_description_uk: (item.full_description as any)?.uk || '',
      full_description_en: (item.full_description as any)?.en || '',
      image: item.image || '',
      gallery: arrToText(item.gallery),
      status: item.status || 'active',
      links: existingLinks,
    });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      title_uk: '', title_en: '',
      description_uk: '', description_en: '',
      full_description_uk: '', full_description_en: '',
      image: '', gallery: '', status: 'active', links: [],
    });
    setShowForm(true);
  }

  if (loading) return <p style={{ color: '#64748b' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Projects ({items.length})</h2>
        <button onClick={openCreate} className={styles.loginButton} style={{ width: 'auto', padding: '0.6rem 1.2rem', margin: 0 }}>
          + Add Project
        </button>
      </div>

      {showForm && (
        <div className={styles.loginWrapper} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', padding: 0 }}>
          <div style={{ background: '#f1f5f9', width: '100%', height: '100%', overflow: 'auto', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{editing ? 'Edit Project' : 'Add Project'}</h3>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Main Image</label>
                  <ImageUploader value={form.image} onChange={v => setForm({ ...form, image: v })} />
                </div>
                <div>
                  <label className={styles.loginLabel}>Status</label>
                  <select className={styles.loginInput} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="planned">Planned</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <RichEditor
                    label="Card Description (UK)"
                    value={form.description_uk}
                    onChange={v => setForm({ ...form, description_uk: v })}
                    height={180}
                  />
                </div>
                <div>
                  <RichEditor
                    label="Card Description (EN)"
                    value={form.description_en}
                    onChange={v => setForm({ ...form, description_en: v })}
                    height={180}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <RichEditor
                    label="Full Description (UK)"
                    value={form.full_description_uk}
                    onChange={v => setForm({ ...form, full_description_uk: v })}
                    height={300}
                  />
                </div>
                <div>
                  <RichEditor
                    label="Full Description (EN)"
                    value={form.full_description_en}
                    onChange={v => setForm({ ...form, full_description_en: v })}
                    height={300}
                  />
                </div>
              </div>

              <label className={styles.loginLabel}>Gallery</label>
              <GalleryEditor value={textToArr(form.gallery)} onChange={urls => setForm({ ...form, gallery: urls.join('\n') })} />

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: 0, color: '#475569' }}>Links (video / article)</h4>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, links: [...form.links, { url: '', type: 'video', label_uk: '', label_en: '' }] })}
                  style={{ padding: '0.35rem 0.75rem', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  + Add Link
                </button>
              </div>

              {form.links.length === 0 && (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.5rem 0' }}>No links added yet. Click "+ Add Link" to add a video or article link.</p>
              )}

              {form.links.map((link, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select
                        value={link.type}
                        onChange={e => {
                          const updated = [...form.links];
                          updated[idx] = { ...updated[idx], type: e.target.value as 'video' | 'external' };
                          setForm({ ...form, links: updated });
                        }}
                        style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: 'white' }}
                      >
                        <option value="video">Video</option>
                        <option value="external">Article</option>
                      </select>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Link #{idx + 1}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = form.links.filter((_, i) => i !== idx);
                        setForm({ ...form, links: updated });
                      }}
                      style={{ padding: '0.3rem 0.6rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      Remove
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>URL</label>
                      <input
                        className={styles.loginInput}
                        value={link.url}
                        onChange={e => {
                          const updated = [...form.links];
                          updated[idx] = { ...updated[idx], url: e.target.value };
                          setForm({ ...form, links: updated });
                        }}
                        placeholder={link.type === 'video' ? 'https://youtube.com/...' : 'https://...'}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Label (UK)</label>
                      <input
                        className={styles.loginInput}
                        value={link.label_uk}
                        onChange={e => {
                          const updated = [...form.links];
                          updated[idx] = { ...updated[idx], label_uk: e.target.value };
                          setForm({ ...form, links: updated });
                        }}
                        placeholder={link.type === 'video' ? 'Дивитись сюжет...' : 'Деталі події'}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Label (EN)</label>
                      <input
                        className={styles.loginInput}
                        value={link.label_en}
                        onChange={e => {
                          const updated = [...form.links];
                          updated[idx] = { ...updated[idx], label_en: e.target.value };
                          setForm({ ...form, links: updated });
                        }}
                        placeholder={link.type === 'video' ? 'Watch story...' : 'Event Details'}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" disabled={saving} className={styles.loginButton} style={{ flex: 1, padding: '0.8rem 2rem' }}>
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Project'}
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
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          No projects yet.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.responsiveTable} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', width: '32px' }}></th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Image</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const id = item._id || item.id;
                const titleObj = item.title as any;
                return (
                  <tr
                    key={id}
                    draggable
                    onDragStart={e => { setDragIndex(items.indexOf(item)); handleDragStart(e, items.indexOf(item)); }}
                    onDragOver={e => { handleDragOver(e, items.indexOf(item), dragIndex, reorderItem); }}
                    onDragLeave={handleDragLeave}
                    onDrop={e => { handleDrop(e, items.indexOf(item), dragIndex, reorderItem); setDragIndex(null); }}
                    onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
                    style={{ borderTop: '1px solid #f1f5f9', cursor: 'grab', userSelect: 'none' }}
                  >
                    <td data-label="" style={{ padding: '0.75rem 0.5rem', color: '#cbd5e1', fontSize: '0.8rem', textAlign: 'center', cursor: 'grab' }}>⠿</td>
                    <td data-label="Image" style={{ padding: '0.75rem 1rem' }}>
                      {item.image ? (
                        <img src={item.image} alt="" style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', background: '#f1f5f9' }} />
                      ) : (
                        <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '0.7rem' }}>No img</div>
                      )}
                    </td>
                    <td data-label="Title" style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                      <div>{titleObj?.uk || item.id}</div>
                      {titleObj?.en && <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{titleObj.en}</div>}
                    </td>
                    <td data-label="Status" style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '999px',
                        fontSize: '0.75rem', fontWeight: 600,
                        background: item.status === 'active' ? '#dcfce7' : item.status === 'completed' ? '#e2e8f0' : '#fef3c7',
                        color: item.status === 'active' ? '#16a34a' : item.status === 'completed' ? '#64748b' : '#d97706',
                      }}>
                        {item.status || 'active'}
                      </span>
                    </td>
                    <td data-label="Actions" style={{ padding: '0.75rem 1rem' }}>
                      <button onClick={() => openEdit(item)} style={{ marginRight: '0.5rem', padding: '0.35rem 0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(id!)} style={{ padding: '0.35rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
