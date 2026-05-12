'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/dev-admin.module.css';
import { 
  Plus, 
  Trash, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Folder, 
  MagnifyingGlass,
  CircleNotch,
  CloudArrowUp,
  X,
  FileArrowUp
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaFile {
  name: string;
  url: string;
  path: string;
}

export const MediaLibrary = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dev-admin/media');
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch (err) {
      console.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const results = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      formData.append('file', selectedFiles[i]);
      formData.append('folder', 'uploads');

      try {
        const res = await fetch('/api/dev-admin/upload', {
          method: 'POST',
          body: formData,
        });
        results.push(await res.json());
      } catch (err) {
        console.error('Upload failed for file:', selectedFiles[i].name);
      }
    }

    setUploading(false);
    fetchMedia();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const deleteImage = async (url: string) => {
    if (!confirm('Are you sure? This will delete the file from the disk.')) return;
    try {
      await fetch('/api/dev-admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      fetchMedia();
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.mediaLibrary}>
      <div className={styles.mediaControls}>
        <div className={styles.searchContainer} style={{ maxWidth: '400px', flex: 1, margin: 0 }}>
          <MagnifyingGlass size={18} className={styles.searchIcon} />
          <input 
            className={styles.searchInput}
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
            {filteredFiles.length} Assets
          </div>
          
          <input 
            type="file" 
            multiple 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            className="hidden" 
            accept="image/*"
          />
          
          <button 
            className={styles.addBtn} 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ padding: '0.6rem 1.2rem' }}
          >
            {uploading ? <CircleNotch className="animate-spin" size={20} /> : <CloudArrowUp size={20} weight="bold" />}
            <span>{uploading ? 'Uploading...' : 'Bulk Upload'}</span>
          </button>

          <button className={styles.secondaryBtn} onClick={fetchMedia}>
            <Folder size={18} weight="bold" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <CircleNotch className="animate-spin text-blue-500" size={64} weight="bold" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className={styles.emptyState}>
          <ImageIcon size={64} weight="thin" />
          <h3>No assets found</h3>
          <p>Try searching for something else or refresh the library.</p>
        </div>
      ) : (
        <div className={styles.mediaGrid}>
          <AnimatePresence mode="popLayout">
            {filteredFiles.map((file, i) => (
              <motion.div 
                key={file.url} 
                className={styles.mediaCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <div className={styles.mediaPreview}>
                  <img src={file.url} alt={file.name} loading="lazy" />
                  <div className={styles.mediaOverlay}>
                    <button 
                      className={styles.mediaActionBtn}
                      onClick={() => copyToClipboard(file.url, i)}
                      title="Copy path"
                    >
                      {copiedIndex === i ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    </button>
                    <button 
                      className={`${styles.mediaActionBtn} ${styles.mediaDeleteBtn}`}
                      onClick={() => deleteImage(file.url)}
                      title="Delete file"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
                <div className={styles.mediaInfo}>
                  <div className={styles.mediaName}>{file.name}</div>
                  <div className={styles.mediaPath}>{file.url}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
