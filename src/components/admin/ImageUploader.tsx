'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '@/app/admin/admin.module.css';

interface PhotoRecord {
  _id: string;
  title: string;
  url: string;
  alt?: string;
  hash?: string;
}

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [gallery, setGallery] = useState<PhotoRecord[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewError(false);
  }, [value]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        onChange(data.url);
        if (data.dedup) {
          console.log('Dedup: image already exists');
        }
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
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

  function selectFromGallery(photo: PhotoRecord) {
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
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
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

      {value && !previewError && (
        <div style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <img
            src={value}
            alt=""
            style={{ maxWidth: '240px', maxHeight: '160px', display: 'block', objectFit: 'cover' }}
            onError={() => setPreviewError(true)}
          />
        </div>
      )}

      {showGallery && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
          onClick={() => setShowGallery(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '16px', padding: '1.5rem',
              maxWidth: '800px', width: '100%', maxHeight: '80vh', overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Select Image</h3>
              <button onClick={() => setShowGallery(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem' }}>✕</button>
            </div>
            {loadingGallery ? (
              <p style={{ color: '#64748b' }}>Loading...</p>
            ) : gallery.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No images uploaded yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {gallery.map(photo => (
                  <div
                    key={photo._id}
                    onClick={() => selectFromGallery(photo)}
                    style={{
                      cursor: 'pointer', borderRadius: '8px', overflow: 'hidden',
                      border: value === photo.url ? '3px solid #3b82f6' : '2px solid #e2e8f0',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '0.35rem', fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {photo.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
