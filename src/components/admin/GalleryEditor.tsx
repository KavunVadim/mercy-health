'use client';

import { useState, useRef } from 'react';
import styles from '@/app/admin/admin.module.css';
import { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } from '@/lib/dnd-reorder';

interface GalleryEditorProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function GalleryEditor({ value, onChange, label }: GalleryEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function openPicker() {
    setShowPicker(true);
    setLoadingPhotos(true);
    try {
      const res = await fetch('/api/admin/photos?gallery=true');
      if (res.ok) setPhotos(await res.json());
    } catch { } finally { setLoadingPhotos(false); }
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('file', files[i]);
        fd.append('title', files[i].name);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          if (!data.dedup) {
            await fetch(`/api/admin/photos/${data._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ inGallery: true }),
            });
          }
          onChange([...value, data.url]);
        }
      }
    } catch (e) { console.error(e); } finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  }

  function addFromGallery(url: string) {
    if (!value.includes(url)) onChange([...value, url]);
  }

  function removeFromGallery(url: string) {
    onChange(value.filter(u => u !== url));
  }

  function reorder(from: number, to: number) {
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  }

  return (
    <div>
      {label && <label className={styles.loginLabel}>{label}</label>}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        <button type="button" onClick={openPicker} className={styles.loginButton} style={{ width: 'auto', padding: '0.5rem 1rem', margin: 0, fontSize: '0.85rem', background: '#475569' }}>
          + From Gallery
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => handleUpload(e.target.files)} style={{ display: 'none' }} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={styles.loginButton} style={{ width: 'auto', padding: '0.5rem 1rem', margin: 0, fontSize: '0.85rem' }}>
          {uploading ? 'Uploading...' : '+ Upload New'}
        </button>
      </div>

      {value.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              draggable
              onDragStart={e => { setDragIndex(idx); handleDragStart(e, idx); }}
              onDragOver={e => handleDragOver(e, idx, dragIndex, reorder)}
              onDragLeave={handleDragLeave}
              onDrop={e => { handleDrop(e, idx, dragIndex, reorder); setDragIndex(null); }}
              onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', borderRadius: '8px', padding: '0.5rem', cursor: 'grab', userSelect: 'none' }}
            >
              <span style={{ color: '#cbd5e1', cursor: 'grab', flexShrink: 0 }}>⠿</span>
              <img src={url} alt="" style={{ width: '56px', height: '40px', borderRadius: '4px', objectFit: 'cover', background: '#e2e8f0', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.8rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url.split('/').pop()}</span>
              <button type="button" onClick={() => removeFromGallery(url)} style={{ flexShrink: 0, padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.75rem' }}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {showPicker && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowPicker(false)}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', maxWidth: '700px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Gallery Photos</h3>
              <button onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem' }}>✕</button>
            </div>
            {loadingPhotos ? (
              <p style={{ color: '#64748b' }}>Loading...</p>
            ) : photos.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No gallery photos. Mark photos as "Gallery" in the Photos page first.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
                {photos.map(photo => {
                  const selected = value.includes(photo.url);
                  return (
                    <div
                      key={photo._id}
                      onClick={() => !selected && addFromGallery(photo.url)}
                      style={{
                        cursor: selected ? 'default' : 'pointer', borderRadius: '8px', overflow: 'hidden',
                        border: selected ? '3px solid #16a34a' : '2px solid #e2e8f0', opacity: selected ? 0.6 : 1,
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '0.3rem', fontSize: '0.7rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selected ? '✓ Added' : photo.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
