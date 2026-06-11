'use client';

import { useState, useRef } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } from '@/lib/dnd-reorder';
import { uploadFile } from '@/lib/upload';

interface GalleryEditorProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function GalleryEditor({ value, onChange, label }: GalleryEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function openPicker() {
    setShowPicker(true);
    setLoadingPhotos(true);
    try {
      const res = await fetch('/api/admin/photos');
      if (res.ok) {
        setPhotos(await res.json());
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to load photos');
        setShowPicker(false);
      }
    } catch {
      alert('Network error loading gallery');
      setShowPicker(false);
    } finally { setLoadingPhotos(false); }
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 15 * 1024 * 1024) {
        alert(`Файл "${files[i].name}" занадто великий. Максимальний розмір — 15 МБ.`);
        return;
      }
    }
    setUploading(true);
    setProgress(0);
    const accumulated = [...value];
    try {
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('file', files[i]);
        fd.append('title', files[i].name);
        const res = await uploadFile(fd, (p) => {
          const overall = Math.round(((i * 100) + p) / files.length);
          setProgress(overall);
        });
        if (res.ok) {
          const data = await res.json();
          if (!data.dedup) {
            await fetch(`/api/admin/photos/${data._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ inGallery: true }),
            });
          }
          accumulated.push(data.url);
          onChange([...accumulated]);
        }
      }
    } catch (e) { console.error(e); } finally { setUploading(false); setProgress(0); if (fileRef.current) fileRef.current.value = ''; }
  }

  function addFromGallery(url: string) {
    if (!value.includes(url)) onChange([...value, url]);
  }

  function removeFromGallery(url: string) {
    onChange(value.filter(u => u !== url));
  }

  async function deletePhoto(photo: any) {
    if (!window.confirm(`Delete "${photo.title || photo.url.split('/').pop()}" permanently? This cannot be undone.`)) return;
    setDeleting(photo._id);
    try {
      const res = await fetch(`/api/admin/photos/${photo._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: photo.url }),
      });
      if (res.ok) {
        removeFromGallery(photo.url);
        setPhotos(prev => prev.filter(p => p._id !== photo._id));
      }
    } catch { }
    finally { setDeleting(null); }
  }

  function reorder(from: number, to: number) {
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  }

  return (
    <div>
      {label && <label className={styles.label}>{label}</label>}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        <button type="button" onClick={openPicker} className={`${styles.btn} ${styles.btnPrimary}`} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', minHeight: 32 }}>
          <Plus size={13} /> From Gallery
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => handleUpload(e.target.files)} style={{ display: 'none' }} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={`${styles.btn} ${styles.btnSecondary}`} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', minHeight: 32 }}>
          {uploading ? `${progress}%` : '+ Upload New'}
        </button>
        {uploading && (
          <div style={{ flex: '1 1 100%', height: 4, background: 'var(--admin-border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--admin-accent)', borderRadius: 4, transition: 'width 0.3s ease' }} />
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className={styles.photoGrid}>
          {value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              draggable
              onDragStart={e => { setDragIndex(idx); handleDragStart(e, idx); }}
              onDragOver={e => handleDragOver(e, idx, dragIndex, reorder)}
              onDragLeave={handleDragLeave}
              onDrop={e => { handleDrop(e, idx, dragIndex, reorder); setDragIndex(null); }}
              onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
              className={styles.photoCard}
            >
              <div style={{ position: 'relative' }}>
                <img src={url} alt="" className={styles.photoCardImage} />
                <div style={{ position: 'absolute', top: 4, left: 4, color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1, textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>⠿</div>
              </div>
              <div className={styles.photoCardBody}>
                <div className={styles.photoCardName}>{url.split('/').pop()}</div>
                <button type="button" onClick={() => removeFromGallery(url)} className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`} style={{ width: '100%', fontSize: '0.7rem', padding: '0.25rem 0.4rem', minHeight: 26 }}>
                  <X size={11} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPicker && (
        <div
          className={styles.modalBackdrop}
          onClick={e => { if (e.target === e.currentTarget) setShowPicker(false); }}
        >
          <div className={styles.modal} style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>Select Photo</h2>
              <button className={styles.btnIcon} onClick={() => setShowPicker(false)} aria-label="Close"><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              {loadingPhotos ? (
                <p style={{ color: 'var(--admin-text-muted)' }}>Loading...</p>
              ) : photos.length === 0 ? (
                <p style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem' }}>
                  No photos yet. Upload photos in the Photos page first.
                </p>
              ) : (
                <div className={styles.photoGrid}>
                  {photos.map(photo => {
                    const selected = value.includes(photo.url);
                    return (
                      <div
                        key={photo._id}
                        className={styles.photoCard}
                        onClick={() => !selected && addFromGallery(photo.url)}
                        style={{ cursor: selected ? 'default' : 'pointer' }}
                      >
                        <div style={{ position: 'relative' }}>
                          <img src={photo.url} alt={photo.title} className={styles.photoCardImage} />
                          {selected && (
                            <div style={{ position: 'absolute', top: 4, right: 4, background: 'var(--admin-accent)', color: 'white', borderRadius: 6, padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>
                              ✓ Added
                            </div>
                          )}
                        </div>
                        <div className={styles.photoCardBody} style={{ padding: '0.35rem 0.5rem' }}>
                          <div className={styles.photoCardName} style={{ fontSize: '0.75rem' }}>{photo.title}</div>
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); deletePhoto(photo); }}
                            disabled={deleting === photo._id}
                            className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`}
                            style={{ width: '100%', fontSize: '0.7rem', padding: '0.25rem 0.4rem', minHeight: 26 }}
                          >
                            <Trash2 size={11} /> {deleting === photo._id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button type="button" onClick={() => setShowPicker(false)} className={`${styles.btn} ${styles.btnSecondary}`}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
