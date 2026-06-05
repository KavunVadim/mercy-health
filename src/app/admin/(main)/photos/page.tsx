'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../admin.module.css';

interface PhotoRecord {
  _id: string;
  title: string;
  url: string;
  alt?: string;
  hash?: string;
  size?: number;
  visible?: boolean;
  inGallery?: boolean;
}

export default function AdminPhotosPage() {
  const [items, setItems] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'gallery'>('all');
  const [toggling, setToggling] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [editing, setEditing] = useState<PhotoRecord | null>(null);
  const [editForm, setEditForm] = useState({ title: '', alt: '' });
  const [showEdit, setShowEdit] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/photos');
      if (res.ok) setItems(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError('');
    try {
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('file', files[i]);
        fd.append('title', files[i].name);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(err.error || 'Upload failed');
        }
      }
      fetchItems();
    } catch (e: any) {
      setUploadError(e.message || 'Upload failed');
      console.error(e);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function toggleGallery(id: string, current: boolean) {
    setToggling(id);
    try {
      await fetch(`/api/admin/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inGallery: !current }),
      });
      fetchItems();
    } catch (e) { console.error(e); }
    finally { setToggling(null); }
  }

  async function toggleVisibility(id: string, current: boolean) {
    setToggling(id);
    try {
      await fetch(`/api/admin/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !current }),
      });
      fetchItems();
    } catch (e) { console.error(e); }
    finally { setToggling(null); }
  }

  async function handleDelete(id: string, url: string) {
    if (!confirm('Delete this photo?')) return;
    try {
      await fetch(`/api/admin/photos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  }

  function openEdit(item: PhotoRecord) {
    setEditing(item);
    setEditForm({ title: item.title || '', alt: item.alt || '' });
    setShowEdit(true);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    try {
      const res = await fetch(`/api/admin/photos/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editForm.title, alt: editForm.alt }),
      });
      if (res.ok) { setShowEdit(false); setEditing(null); fetchItems(); }
    } catch (e) { console.error(e); }
  }

  function copyUrl(url: string) {
    if (url) navigator.clipboard.writeText(url);
  }

  const filtered = items.filter(i => {
    if (filter === 'gallery' && !i.inGallery) return false;
    if (search && !i.title?.toLowerCase().includes(search.toLowerCase()) && !i.url?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <p style={{ color: '#64748b' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Photos ({items.length})</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text" placeholder="Search..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.5rem 0.8rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', background: 'white', width: '160px' }}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={e => handleUpload(e.target.files)}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={styles.loginButton}
            style={{ width: 'auto', padding: '0.6rem 1.2rem', margin: 0 }}
          >
            {uploading ? 'Uploading...' : '+ Upload'}
          </button>
        </div>
      </div>

      {uploadError && (
        <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>
          Upload error: {uploadError}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{
          padding: '0.35rem 0.75rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
          background: filter === 'all' ? '#1e293b' : '#e2e8f0', color: filter === 'all' ? 'white' : '#475569', fontWeight: 600,
        }}>
          All ({items.length})
        </button>
        <button onClick={() => setFilter('gallery')} style={{
          padding: '0.35rem 0.75rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
          background: filter === 'gallery' ? '#1e293b' : '#e2e8f0', color: filter === 'gallery' ? 'white' : '#475569', fontWeight: 600,
        }}>
          Gallery ({items.filter(i => i.inGallery).length})
        </button>
      </div>

      {showEdit && editing && (
        <div className={styles.loginWrapper} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)' }}>
          <div className={styles.loginCard} style={{ maxWidth: '500px' }}>
            <h3 style={{ marginTop: 0 }}>Edit Photo</h3>
            <form onSubmit={saveEdit}>
              <label className={styles.loginLabel}>Title</label>
              <input className={styles.loginInput} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
              <label className={styles.loginLabel}>Alt Text</label>
              <input className={styles.loginInput} value={editForm.alt} onChange={e => setEditForm({ ...editForm, alt: e.target.value })} />
              {editing.url && (
                <img src={editing.url} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }} />
              )}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className={styles.loginButton} style={{ flex: 1 }}>Save</button>
                <button type="button" onClick={() => setShowEdit(false)} className={styles.loginButton} style={{ flex: 1, background: '#64748b' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
          {search ? 'No photos match your search.' : 'No photos yet. Click "Upload" to add images.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {filtered.map(item => (
            <div key={item._id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '100%', height: '150px', background: '#f1f5f9', overflow: 'hidden' }}>
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => window.open(item.url, '_blank')}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '0.8rem' }}>No image</div>
                )}
              </div>
              <div style={{ padding: '0.65rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item?.url ? item.url.split('/').pop() : '—'}
                  {item.size && ` • ${(item.size / 1024).toFixed(0)}KB`}
                </div>
                <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <button onClick={() => toggleGallery(item._id, !!item.inGallery)} disabled={toggling === item._id} style={{
                    padding: '0.25rem 0.5rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
                    background: item.inGallery ? '#dcfce7' : '#f1f5f9', color: item.inGallery ? '#16a34a' : '#94a3b8',
                  }}>
                    {item.inGallery ? '✓ Gallery' : 'Add to gallery'}
                  </button>
                  <button onClick={() => toggleVisibility(item._id, !!item.visible)} disabled={toggling === item._id} style={{
                    padding: '0.25rem 0.5rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
                    background: item.visible !== false ? '#e2e8f0' : '#fef3c7', color: item.visible !== false ? '#64748b' : '#d97706',
                  }}>
                    {item.visible !== false ? 'Visible' : 'Hidden'}
                  </button>
                  <button onClick={() => openEdit(item)} style={{ padding: '0.25rem 0.5rem', background: '#e2e8f0', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem' }}>Edit</button>
                  <button onClick={() => copyUrl(item.url)} style={{ padding: '0.25rem 0.5rem', background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem' }}>Copy URL</button>
                  <button onClick={() => handleDelete(item._id, item.url)} style={{ padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
