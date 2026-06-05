'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../admin.module.css';
import ImageUploader from '@/components/admin/ImageUploader';
import GalleryEditor from '@/components/admin/GalleryEditor';
import RichEditor from '@/components/admin/RichEditor';
import { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd, saveReorder } from '@/lib/dnd-reorder';

interface NewsItem {
  _id?: string;
  id: string;
  title?: { uk: string; en: string };
  description?: { uk: string; en: string };
  content?: { uk: string[]; en: string[] };
  date?: string;
  image?: string;
  image_focus?: string;
  slug?: string;
  gallery?: string[];
  video_link?: string;
  video_label?: { uk: string; en: string };
  external_link?: string;
  link?: string;
  link_label?: { uk: string; en: string };
  createdAt?: string;
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
  return s || 'news-item';
}

function arrToText(arr: string[] | undefined): string {
  return Array.isArray(arr) ? arr.join('\n') : '';
}

function textToArr(text: string): string[] {
  return text.split('\n').filter(s => s.trim());
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title_uk: '', title_en: '',
    date: '',
    image: '', image_focus: '',
    description_uk: '', description_en: '',
    content_uk: '', content_en: '',
    gallery: '',
    video_link: '', video_label_uk: '', video_label_en: '',
    external_link: '', link_label_uk: '', link_label_en: '',
  });
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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
    } catch (e) {
      console.error('Failed to fetch news', e);
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
      const body: Record<string, unknown> = {
        id: slug,
        slug,
        date: form.date,
        image: form.image,
        image_focus: form.image_focus || undefined,
        title: { uk: form.title_uk, en: form.title_en },
        description: { uk: form.description_uk, en: form.description_en },
        content: {
          uk: textToArr(form.content_uk),
          en: textToArr(form.content_en),
        },
        gallery: textToArr(form.gallery),
        video_link: form.video_link || undefined,
        video_label: form.video_link ? { uk: form.video_label_uk, en: form.video_label_en } : undefined,
        external_link: form.external_link || undefined,
        link_label: form.external_link ? { uk: form.link_label_uk, en: form.link_label_en } : undefined,
      };

      const url = editing ? `/api/admin/news/${editing._id || editing.id}` : '/api/admin/news';
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
          date: '', image: '', image_focus: '',
          description_uk: '', description_en: '',
          content_uk: '', content_en: '',
          gallery: '', video_link: '', video_label_uk: '', video_label_en: '',
          external_link: '', link_label_uk: '', link_label_en: '',
        });
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this news item?')) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error('Failed to delete', e);
    }
  }

  function openEdit(item: NewsItem) {
    setEditing(item);
    setForm({
      title_uk: (item.title as any)?.uk || '',
      title_en: (item.title as any)?.en || '',
      date: item.date || '',
      image: item.image || '',
      image_focus: item.image_focus || '',
      description_uk: (item.description as any)?.uk || '',
      description_en: (item.description as any)?.en || '',
      content_uk: arrToText((item.content as any)?.uk),
      content_en: arrToText((item.content as any)?.en),
      gallery: arrToText(item.gallery),
      video_link: item.video_link || '',
      video_label_uk: (item.video_label as any)?.uk || '',
      video_label_en: (item.video_label as any)?.en || '',
      external_link: item.external_link || item.link || '',
      link_label_uk: (item.link_label as any)?.uk || '',
      link_label_en: (item.link_label as any)?.en || '',
    });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      title_uk: '', title_en: '', date: new Date().toISOString().split('T')[0],
      image: '', image_focus: '',
      description_uk: '', description_en: '',
      content_uk: '', content_en: '',
      gallery: '', video_link: '', video_label_uk: '', video_label_en: '',
      external_link: '', link_label_uk: '', link_label_en: '',
    });
    setShowForm(true);
  }

  if (loading) return <p style={{ color: '#64748b' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>News ({items.length})</h2>
        <button onClick={openCreate} className={styles.loginButton} style={{ width: 'auto', padding: '0.6rem 1.2rem', margin: 0 }}>
          + Add News
        </button>
      </div>

      {showForm && (
        <div className={styles.loginWrapper} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', padding: 0 }}>
          <div style={{ background: '#f1f5f9', width: '100%', height: '100%', overflow: 'auto', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{editing ? 'Edit News' : 'Add News'}</h3>
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
                  <label className={styles.loginLabel}>Date</label>
                  <input className={styles.loginInput} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div>
                  <label className={styles.loginLabel}>Main Image</label>
                  <ImageUploader value={form.image} onChange={v => setForm({ ...form, image: v })} />
                </div>
              </div>

              <label className={styles.loginLabel}>Image Focus <span style={{ fontWeight: 400, color: '#94a3b8' }}>(CSS object-position)</span></label>
              <input className={styles.loginInput} value={form.image_focus} onChange={e => setForm({ ...form, image_focus: e.target.value })} placeholder="50% 25%" />

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <RichEditor
                    label="Description / Excerpt (UK)"
                    value={form.description_uk}
                    onChange={v => setForm({ ...form, description_uk: v })}
                    height={200}
                  />
                </div>
                <div>
                  <RichEditor
                    label="Description / Excerpt (EN)"
                    value={form.description_en}
                    onChange={v => setForm({ ...form, description_en: v })}
                    height={200}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Content (UK) <span style={{ fontWeight: 400, color: '#94a3b8' }}>(one paragraph per line)</span></label>
                  <textarea className={styles.loginInput} rows={6} value={form.content_uk} onChange={e => setForm({ ...form, content_uk: e.target.value })} style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label className={styles.loginLabel}>Content (EN) <span style={{ fontWeight: 400, color: '#94a3b8' }}>(one paragraph per line)</span></label>
                  <textarea className={styles.loginInput} rows={6} value={form.content_en} onChange={e => setForm({ ...form, content_en: e.target.value })} style={{ resize: 'vertical' }} />
                </div>
              </div>

              <label className={styles.loginLabel}>Gallery</label>
              <GalleryEditor value={textToArr(form.gallery)} onChange={urls => setForm({ ...form, gallery: urls.join('\n') })} />

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <h4 style={{ margin: '0 0 0.5rem', color: '#475569' }}>Video Link (optional)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Video URL</label>
                  <input className={styles.loginInput} value={form.video_link} onChange={e => setForm({ ...form, video_link: e.target.value })} placeholder="https://youtube.com/..." />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Video Label (UK)</label>
                  <input className={styles.loginInput} value={form.video_label_uk} onChange={e => setForm({ ...form, video_label_uk: e.target.value })} placeholder="Дивитись сюжет..." />
                </div>
                <div>
                  <label className={styles.loginLabel}>Video Label (EN)</label>
                  <input className={styles.loginInput} value={form.video_label_en} onChange={e => setForm({ ...form, video_label_en: e.target.value })} placeholder="Watch story..." />
                </div>
              </div>

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <h4 style={{ margin: '0 0 0.5rem', color: '#475569' }}>External Link (optional — partner coverage)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>External URL</label>
                  <input className={styles.loginInput} value={form.external_link} onChange={e => setForm({ ...form, external_link: e.target.value })} placeholder="https://partner-site.com/article..." />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label className={styles.loginLabel}>Link Label (UK)</label>
                  <input className={styles.loginInput} value={form.link_label_uk} onChange={e => setForm({ ...form, link_label_uk: e.target.value })} placeholder="Деталі події" />
                </div>
                <div>
                  <label className={styles.loginLabel}>Link Label (EN)</label>
                  <input className={styles.loginInput} value={form.link_label_en} onChange={e => setForm({ ...form, link_label_en: e.target.value })} placeholder="Event Details" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" disabled={saving} className={styles.loginButton} style={{ flex: 1, padding: '0.8rem 2rem' }}>
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create News'}
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
          No news items yet.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.responsiveTable} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', width: '32px' }}></th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Image</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Date</th>
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
                    <td data-label="Date" style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                      {item.date || '—'}
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
