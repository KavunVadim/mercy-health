'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from '@/styles/dev-admin.module.css';
import { 
  X, 
  Folder, 
  Image as ImageIcon, 
  MagnifyingGlass, 
  CloudArrowUp, 
  Trash, 
  Copy, 
  Check, 
  ArrowRight,
  SelectionPlus,
  Selection,
  HardDrive,
  FileImage,
  ArrowsClockwise
} from '@phosphor-icons/react';

interface MediaFile {
  name: string;
  url: string;
  path: string;
}

interface MediaLibraryProps {
  onSelect?: (url: string | string[]) => void;
  isSelectMode?: boolean;
  isMultiSelect?: boolean;
  onClose?: () => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  onSelect, 
  isSelectMode = true, 
  isMultiSelect = false,
  onClose 
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<MediaFile | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dev-admin/media');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const folders = useMemo(() => {
    const s = new Set<string>(['all']);
    files.forEach(f => {
      const p = f.path.split('/');
      if (p.length > 1) s.add(p[0]);
    });
    return Array.from(s).sort();
  }, [files]);

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const nameMatch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      const folderMatch = currentFolder === 'all' || f.path.startsWith(currentFolder + '/');
      return nameMatch && folderMatch;
    }).reverse(); // Latest first
  }, [files, searchQuery, currentFolder]);

  const handleFileClick = (file: MediaFile) => {
    setActiveFile(file);
    
    if (isMultiSelect) {
      setSelectedUrls(prev => 
        prev.includes(file.url) 
          ? prev.filter(u => u !== file.url) 
          : [...prev, file.url]
      );
    } else {
      setSelectedUrls([file.url]);
    }
  };

  const handleConfirm = () => {
    if (isMultiSelect) {
      onSelect?.(selectedUrls);
    } else if (activeFile) {
      onSelect?.(activeFile.url);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    // Add files to formData
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append('files', uploadedFiles[i]);
    }
    
    // If we are in a folder, upload to that folder
    if (currentFolder !== 'all') {
      formData.append('collection', currentFolder);
    }

    try {
      const res = await fetch('/api/dev-admin/media', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        await fetchMedia();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) return;

    try {
      const res = await fetch('/api/dev-admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path })
      });

      if (res.ok) {
        setFiles(prev => prev.filter(f => f.path !== file.path));
        if (activeFile?.path === file.path) setActiveFile(null);
        setSelectedUrls(prev => prev.filter(u => u !== file.url));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: add a toast or feedback here
  };

  return (
    <div className={styles.mediaNewContainer}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        multiple 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {/* 1. SIDEBAR - Folder Navigation */}
      <aside className={styles.mediaNewSidebar}>
        <div className={styles.mediaNewSidebarHeader}>Collections</div>
        <div className={styles.mediaNewSidebarContent}>
          {folders.map(folder => (
            <button 
              key={folder}
              onClick={() => setCurrentFolder(folder)}
              className={`${styles.mediaNewFolderBtn} ${currentFolder === folder ? styles.active : ''}`}
            >
              {folder === 'all' ? <HardDrive size={18} weight="bold" /> : <Folder size={18} weight="bold" />}
              <span className="capitalize">{folder}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. MAIN GRID - Asset Browser */}
      <main className={styles.mediaNewMain}>
        <header className={styles.mediaNewHeader}>
          <div className={styles.mediaNewSearch}>
            <MagnifyingGlass size={18} weight="bold" className="opacity-40" />
            <input 
              placeholder="Search by filename..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchMedia()} 
              className="p-2 hover:bg-accent-soft rounded-full transition-colors"
              title="Refresh"
            >
              <ArrowsClockwise size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              className={styles.mediaNewUploadBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <ArrowsClockwise className="animate-spin" /> : <CloudArrowUp size={20} weight="bold" />}
              {isUploading ? 'Uploading...' : 'Upload Asset'}
            </button>
            {onClose && (
              <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                <X size={20} weight="bold" />
              </button>
            )}
          </div>
        </header>

        <section className={styles.mediaNewGridScroll + " customScrollbar"}>
          {loading && files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-40">
              <ArrowsClockwise size={32} className="animate-spin mb-4" />
              <p>Fetching your library...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
              <FileImage size={64} weight="thin" />
              <p className="mt-4 font-medium">No assets found in this collection</p>
              <p className="text-xs">Try searching for something else or upload a new file.</p>
            </div>
          ) : (
            <div className={styles.mediaNewGrid}>
              {filteredFiles.map(file => {
                const isSelected = selectedUrls.includes(file.url);
                const isActive = activeFile?.url === file.url;
                
                return (
                  <div 
                    key={file.url}
                    className={`${styles.mediaNewCard} ${isSelected ? styles.selected : ''} ${isActive ? styles.active : ''}`}
                    onClick={() => handleFileClick(file)}
                  >
                    <div className={styles.mediaNewCardPreview}>
                      <img src={file.url} alt={file.name} loading="lazy" />
                      {isSelected && (
                        <div className={styles.mediaNewCheckBadge}>
                          <Check weight="bold" />
                        </div>
                      )}
                    </div>
                    <div className={styles.mediaNewCardName}>{file.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 3. DETAILS PANEL - Metadata & Actions */}
      <aside className={styles.mediaNewDetails}>
        <div className={styles.mediaNewDetailsHeader}>Asset Details</div>
        <div className={styles.mediaNewDetailsContent + " customScrollbar"}>
          {activeFile ? (
            <div className="flex flex-col gap-8">
              <div className={styles.mediaNewDetailsPreview}>
                <img src={activeFile.url} alt="" />
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-40">Filename</label>
                  <p className="text-xs font-bold leading-relaxed break-all text-balance">{activeFile.name}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-40">Path</label>
                  <p className="text-[11px] font-medium opacity-70 break-all">{activeFile.path}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-40">Direct URL</label>
                  <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-lg group">
                    <code className="text-[9px] font-mono truncate flex-1 opacity-60">{activeFile.url}</code>
                    <button 
                      onClick={() => copyToClipboard(activeFile.url)}
                      className="p-1 hover:bg-accent hover:text-white rounded transition-all"
                    >
                      <Copy size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-glass-border flex flex-col gap-3">
                <button 
                  className={styles.mediaNewActionBtn} 
                  onClick={() => window.open(activeFile.url, '_blank')}
                >
                  <ImageIcon size={18} /> View Full Size
                </button>
                <button 
                  className={styles.mediaNewActionBtn} 
                  style={{ color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.2)' }}
                  onClick={() => handleDelete(activeFile)}
                >
                  <Trash size={18} weight="bold" /> Delete Asset
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-20 text-center p-8">
              <SelectionPlus size={56} weight="thin" />
              <p className="text-sm font-medium mt-4">No Asset Selected</p>
              <p className="text-[11px] mt-2 leading-relaxed">Select any image from the grid to view its properties and perform actions.</p>
            </div>
          )}
        </div>
        
        {/* FOOTER ACTION - Only show if in select mode and something is chosen */}
        {isSelectMode && (selectedUrls.length > 0) && (
          <div className={styles.mediaNewFooter}>
            <button className={styles.mediaNewConfirmBtn} onClick={handleConfirm}>
              <span>
                {isMultiSelect 
                  ? `Choose ${selectedUrls.length} ${selectedUrls.length === 1 ? 'Asset' : 'Assets'}`
                  : 'Select Asset'}
              </span>
              <ArrowRight weight="bold" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default MediaLibrary;
