'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { uploadFile } from '@/lib/upload';
import { compressImageBeforeUpload } from '@/lib/client-image';
import type { AdminPhoto } from '@/types/admin';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [gallery, setGallery] = useState<AdminPhoto[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [previewErrorUrl, setPreviewErrorUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Файл занадто великий. Максимальний розмір — 15 МБ.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const processed = await compressImageBeforeUpload(file);
      const formData = new FormData();
      formData.append('file', processed);
      formData.append('title', processed.name);

      const res = await uploadFile(formData, setProgress);
      const data = await res.json();
      if (res.ok) {
        onChange(data.url);
        if (data.dedup) {
        }
      } else if (res.status === 413) {
        alert('Файл занадто великий. Спробуйте обрати зображення меншого розміру.');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function openGallery() {
    setShowGallery(true);
    setLoadingGallery(true);
    try {
      const res = await fetch('/api/admin/photos');
      if (res.ok) setGallery(await res.json());
    } catch { } finally {
      setLoadingGallery(false);
    }
  }

  function selectFromGallery(photo: AdminPhoto) {
    onChange(photo.url);
    setShowGallery(false);
  }

  function handleRemove() {
    onChange('');
  }

  return (
    <div>
      {label && <label className={styles.loginLabel}>{label}</label>}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={styles.loginButton}
          style={{ width: 'auto', padding: '0.5rem 1rem', margin: 0, fontSize: '0.85rem' }}
        >
          {uploading ? `${progress}%` : 'Upload'}
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
          max 15 MB
        </span>
        {uploading && (
          <div style={{ flex: '1 1 100%', height: 4, background: 'var(--admin-border)', borderRadius: 4, overflow: 'hidden', marginTop: '-0.25rem' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--admin-accent)', borderRadius: 4, transition: 'width 0.2s ease' }} />
          </div>
        )}
        <button
          type="button"
          onClick={openGallery}
          className={styles.loginButton}
          style={{ width: 'auto', padding: '0.5rem 1rem', margin: 0, fontSize: '0.85rem', background: '#475569' }}
        >
          Browse Gallery
        </button>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            style={{ padding: '0.5rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Remove
          </button>
        )}
      </div>

      {value && previewErrorUrl !== value && (
        <div style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <img
            src={value}
            alt=""
            style={{ maxWidth: '240px', maxHeight: '160px', display: 'block', objectFit: 'cover' }}
            onError={() => setPreviewErrorUrl(value)}
          />
        </div>
      )}

      {showGallery && typeof window !== 'undefined' && createPortal(
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowGallery(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={styles.modal}
            style={{ maxWidth: '700px' }}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Select Image</h3>
              <button className={styles.btnIcon} onClick={() => setShowGallery(false)} aria-label="Close"><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              {loadingGallery ? (
                <p style={{ color: 'var(--admin-text-muted)' }}>Loading...</p>
              ) : gallery.length === 0 ? (
                <p style={{ color: 'var(--admin-text-muted)' }}>No images uploaded yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  {gallery.map(photo => (
                    <div
                      key={photo._id}
                      onClick={() => selectFromGallery(photo)}
                      style={{
                        cursor: 'pointer', borderRadius: '8px', overflow: 'hidden',
                        border: value === photo.url ? '3px solid var(--admin-accent)' : '2px solid var(--admin-border)',
                        transition: 'border-color 0.15s',
                        background: 'var(--admin-secondary)'
                      }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ padding: '0.35rem', fontSize: '0.75rem', color: 'var(--admin-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {photo.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button type="button" onClick={() => setShowGallery(false)} className={`${styles.btn} ${styles.btnSecondary}`}>Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
