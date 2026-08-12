'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Search, Images, Eye, EyeOff, LayoutGrid, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { useToast } from '@/components/admin/ui/Toast';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { SkeletonPhotoGrid } from '@/components/admin/ui/Skeleton';
import { saveReorder, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } from '@/lib/dnd-reorder';
import { uploadFile } from '@/lib/upload';
import { compressImageBeforeUpload } from '@/lib/client-image';
import type { AdminPhoto } from '@/types/admin';

export default function AdminPhotosPage() {
  const [items, setItems] = useState<AdminPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'gallery' | 'visible'>('all');
  const [toggling, setToggling] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [draggingOver, setDraggingOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPhoto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/photos');
      if (res.ok) setItems(await res.json());
      else error('Failed to load photos');
    } catch { error('Network error'); }
    finally { setLoading(false); }
  }, [error]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 15 * 1024 * 1024) {
        error(`Файл "${files[i].name}" занадто великий. Максимальний розмір — 15 МБ.`);
        return;
      }
    }
    setUploading(true);
    setProgress(0);
    let uploaded = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const processed = await compressImageBeforeUpload(files[i]);
        const fd = new FormData();
        fd.append('file', processed);
        fd.append('title', processed.name);
        const res = await uploadFile(fd, (p) => {
          const overall = Math.round(((i * 100) + p) / files.length);
          setProgress(overall);
        });
        if (!res.ok) {
          if (res.status !== 413) throw new Error('Upload failed');
          error(`Файл "${processed.name}" занадто великий для завантаження.`);
          continue;
        }
        uploaded++;
      }
      fetchItems();
      success(`${uploaded} photo${uploaded !== 1 ? 's' : ''} uploaded`);
    } catch (e: any) {
      error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function toggleStatus(id: string, field: 'inGallery' | 'visible', current: boolean) {
    setToggling(id + field);
    try {
      const res = await fetch(`/api/admin/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !current }),
      });
      if (res.ok) fetchItems();
      else {
        const data = await res.json().catch(() => ({}));
        error(data.error || `Update failed (${res.status})`);
      }
    } catch { error('Network error'); }
    finally { setToggling(null); }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/photos/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: deleteTarget.url }),
      });
      if (res.ok) { fetchItems(); success('Photo deleted'); }
      else error('Delete failed');
    } catch { error('Network error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  }

  function moveItem(fromIdx: number, direction: -1 | 1) {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= filtered.length) return;
    const fromId = filtered[fromIdx]._id;
    const toId = filtered[toIdx]._id;
    setItems(prev => {
      const updated = [...prev];
      const fromPos = updated.findIndex(p => p._id === fromId);
      const toPos = updated.findIndex(p => p._id === toId);
      if (fromPos === -1 || toPos === -1) return prev;
      const [moved] = updated.splice(fromPos, 1);
      updated.splice(toPos, 0, moved);
      saveReorder('photos', updated);
      return updated;
    });
  }

  function reorderItem(fromIdx: number, toIdx: number) {
    const fromId = filtered[fromIdx]._id;
    const toId = filtered[toIdx]._id;
    setItems(prev => {
      const updated = [...prev];
      const fromPos = updated.findIndex(p => p._id === fromId);
      const toPos = updated.findIndex(p => p._id === toId);
      if (fromPos === -1 || toPos === -1) return prev;
      const [moved] = updated.splice(fromPos, 1);
      updated.splice(toPos, 0, moved);
      saveReorder('photos', updated);
      return updated;
    });
  }

  const filtered = items.filter(i => {
    if (filter === 'gallery' && !i.inGallery) return false;
    if (filter === 'visible' && !i.visible) return false;
    if (search && !i.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filterBtns: { key: typeof filter; label: string }[] = [
    { key: 'all', label: `All (${items.length})` },
    { key: 'gallery', label: `Gallery (${items.filter(i => i.inGallery).length})` },
    { key: 'visible', label: `Visible (${items.filter(i => i.visible).length})` },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Photos</h1>
          <p className={styles.pageSubtitle}>{items.length} image{items.length !== 1 ? 's' : ''} in library</p>
        </div>
        <div className={styles.pageActions}>
          <button
            onClick={() => fileRef.current?.click()}
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={uploading}
          >
            <Upload size={15} />
            {uploading ? `${progress}%` : 'Upload Photos'}
          </button>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => handleUpload(e.target.files)} style={{ display: 'none' }} />

      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${draggingOver ? styles.dropZoneActive : ''}`}
        style={{ marginBottom: '1.5rem' }}
        onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={e => { e.preventDefault(); setDraggingOver(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => !uploading && fileRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && !uploading && fileRef.current?.click()}
        aria-label="Drop images here or click to upload"
      >
        {uploading ? (
          <div style={{ width: '100%', maxWidth: 320, margin: '0 auto' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              Uploading… {progress}%
            </div>
            <div style={{ height: 6, background: 'var(--admin-border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--admin-accent)', borderRadius: 4, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        ) : (
          <>
            <Upload size={22} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              {draggingOver ? 'Release to upload' : 'Drag & drop images here'}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>or click to browse files — JPG, PNG, WebP, AVIF</div>
          </>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {filterBtns.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`${styles.btn} ${styles.btnSm} ${filter === f.key ? styles.btnPrimary : styles.btnSecondary}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className={styles.searchWrapper} style={{ marginLeft: 'auto', minWidth: 200 }}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete photo?"
        message={`"${deleteTarget?.title}" will be permanently removed from the library.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {loading ? (
        <SkeletonPhotoGrid count={8} />
      ) : filtered.length === 0 ? (
        <div className={`${styles.card} ${styles.emptyState}`}>
          <div className={styles.emptyStateIcon}><Images size={28} strokeWidth={1.5} /></div>
          <p className={styles.emptyStateTitle}>{search || filter !== 'all' ? 'No matching photos' : 'No photos yet'}</p>
          <p className={styles.emptyStateText}>
            {search ? `No results for "${search}"` : 'Upload your first image to the media library.'}
          </p>
        </div>
      ) : (
        <div className={styles.photoGrid}>
          {filtered.map((item, idx) => (
            <div
              key={item._id}
              draggable
              onDragStart={e => { setDragIndex(idx); handleDragStart(e, idx); }}
              onDragOver={e => { handleDragOver(e, idx, dragIndex, reorderItem); }}
              onDragLeave={handleDragLeave}
              onDrop={e => { handleDrop(e, idx, dragIndex, reorderItem); setDragIndex(null); }}
              onDragEnd={e => { handleDragEnd(e); setDragIndex(null); }}
              className={styles.photoCard}
              style={{ cursor: 'grab', userSelect: 'none' }}
            >
              <div style={{ position: 'relative' }}>
                <img src={item.url} alt={item.alt || item.title} className={styles.photoCardImage} />
                <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.5)', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', backdropFilter: 'blur(4px)' }}>
                  <GripVertical size={13} />
                </div>
              </div>
              <div className={styles.photoCardBody}>
                <div className={styles.photoCardName} title={item.title}>{item.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.5rem' }}>
                  <label className={styles.photoToggleLabel} title="Show in gallery" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem' }}>
                      <LayoutGrid size={10} />
                      Gallery
                    </span>
                    <input
                      type="checkbox"
                      className={styles.toggleInput}
                      checked={!!item.inGallery}
                      disabled={toggling === item._id + 'inGallery'}
                      onChange={() => toggleStatus(item._id, 'inGallery', !!item.inGallery)}
                    />
                    <span className={styles.toggleTrack} />
                  </label>
                  <label className={styles.photoToggleLabel} title="Visible on site" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem' }}>
                      {item.visible ? <Eye size={10} /> : <EyeOff size={10} />}
                      Visible
                    </span>
                    <input
                      type="checkbox"
                      className={styles.toggleInput}
                      checked={!!item.visible}
                      disabled={toggling === item._id + 'visible'}
                      onChange={() => toggleStatus(item._id, 'visible', !!item.visible)}
                    />
                    <span className={styles.toggleTrack} />
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`} style={{ minWidth: 26, minHeight: 24, padding: 0 }} title="Move up">
                      <ChevronUp size={11} />
                    </button>
                    <button onClick={() => moveItem(idx, 1)} disabled={idx === filtered.length - 1} className={`${styles.btn} ${styles.btnSm} ${styles.btnIcon}`} style={{ minWidth: 26, minHeight: 24, padding: 0 }} title="Move down">
                      <ChevronDown size={11} />
                    </button>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`}
                    style={{ flex: 1, fontSize: '0.7rem', padding: '0.25rem 0.4rem', minHeight: 24 }}
                  >
                    <Trash2 size={10} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
