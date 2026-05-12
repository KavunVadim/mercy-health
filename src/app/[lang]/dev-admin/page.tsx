'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/dev-admin.module.css';
import { Editor } from '@/components/dev-admin/Editor';
import { MediaLibrary } from '@/components/dev-admin/MediaLibrary';
import { 
  FileText, 
  FloppyDisk, 
  CircleNotch, 
  Globe, 
  Database, 
  ShieldAlert, 
  MagnifyingGlass, 
  Code, 
  Layout, 
  Image as ImageIcon,
  CheckCircle,
  WarningCircle,
  Terminal,
  Gear,
  DownloadSimple,
  Sun,
  Moon,
  X
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@teispace/next-themes';

interface ContentFile {
  name: string;
  path: string;
  type: 'data' | 'dictionary';
}

export default function DevAdminPage() {
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<ContentFile | null>(null);
  const [content, setContent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form');
  const [activeTab, setActiveTab] = useState<'content' | 'media'>('content');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    fetch('/api/dev-admin')
      .then(res => res.json())
      .then(data => {
        if (data.files) setFiles(data.files);
      })
      .catch(() => setError('Failed to load files list'));
  }, []);

  const loadFile = async (file: ContentFile) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setSelectedFile(file);
    setActiveTab('content');
    try {
      const res = await fetch(`/api/dev-admin/${file.path}`);
      const data = await res.json();
      setContent(data);
    } catch (err) {
      setError(`Failed to load ${file.name}`);
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async () => {
    if (!selectedFile || !content) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    console.log('Attempting to save:', selectedFile.path);
    
    try {
      const res = await fetch(`/api/dev-admin/${selectedFile.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      
      const result = await res.json();
      
      if (!res.ok || result.error) {
        throw new Error(result.error || 'Failed to save');
      }
      
      setSuccess('Changes saved successfully!');
      console.log('Save successful');
      
      // Keep success message longer
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const downloadBackup = () => {
    window.location.href = '/api/dev-admin/backup';
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-[#f8fafc] text-[#0f172a]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white rounded-[3rem] border border-black/5 shadow-2xl"
        >
          <ShieldAlert size={80} weight="duotone" className="text-red-500 mx-auto mb-8" />
          <h1 className="text-4xl font-bold font-head tracking-tighter mb-4">Access Denied</h1>
          <p className="text-zinc-500 max-w-md mx-auto">
            The Developer Administration Panel is strictly restricted to local development environments.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.devAdmin}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg">
              <Terminal size={18} weight="bold" />
            </div>
            <span>Mercy <span className="font-light opacity-50">Admin</span></span>
          </div>
          <span className={styles.versionBadge}>CMS Panel v3.0</span>
        </div>
        
        <div className={styles.searchContainer}>
          <MagnifyingGlass size={16} weight="bold" className={styles.searchIcon} />
          <input 
            className={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.fileList}>
          <div 
            className={`${styles.fileItem} ${activeTab === 'media' ? styles.fileItemActive : ''}`}
            onClick={() => {
              setActiveTab('media');
              setSelectedFile(null);
            }}
          >
            <ImageIcon size={18} weight={activeTab === 'media' ? "fill" : "bold"} />
            <span>Media Library</span>
          </div>

          <div className={styles.label}>Structure & Data</div>
          {filteredFiles.filter(f => f.type === 'data').map(file => (
            <div 
              key={file.path}
              className={`${styles.fileItem} ${selectedFile?.path === file.path ? styles.fileItemActive : ''}`}
              onClick={() => loadFile(file)}
            >
              <Database size={18} weight={selectedFile?.path === file.path ? "fill" : "bold"} />
              <span>{file.name}</span>
            </div>
          ))}

          <div className={styles.label}>Localization</div>
          {filteredFiles.filter(f => f.type === 'dictionary').map(file => (
            <div 
              key={file.path}
              className={`${styles.fileItem} ${selectedFile?.path === file.path ? styles.fileItemActive : ''}`}
              onClick={() => loadFile(file)}
            >
              <Globe size={18} weight={selectedFile?.path === file.path ? "fill" : "bold"} />
              <span>{file.name}</span>
            </div>
          ))}
        </div>

        <div className="p-6 mt-auto border-t border-black/5 dark:border-white/5">
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-background hover:bg-accent-soft hover:text-accent transition-all text-sm font-bold text-text-muted"
            onClick={downloadBackup}
          >
            <DownloadSimple size={20} weight="bold" />
            Snap Database
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 20, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-0 left-1/2 z-[1000] bg-red-500 text-white px-6 py-3 rounded-full flex items-center gap-3 font-bold shadow-2xl"
            >
              <WarningCircle size={20} weight="fill" />
              {error}
              <button onClick={() => setError(null)} className="ml-2"><X size={16} weight="bold" /></button>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 20, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-0 left-1/2 z-[1000] bg-emerald-500 text-white px-6 py-3 rounded-full flex items-center gap-3 font-bold shadow-2xl"
            >
              <CheckCircle size={20} weight="fill" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.editorContainer}>
          {activeTab === 'media' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.header}>
                <div>
                  <h1 className={styles.title}>Asset Distribution</h1>
                  <p className={styles.textMuted}>Global media library management</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    className={styles.secondaryBtn} 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {mounted && (theme === 'dark' ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />)}
                  </button>
                </div>
              </div>
              <MediaLibrary />
            </motion.div>
          ) : selectedFile ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={selectedFile.path}
            >
              <div className={styles.header}>
                <div className={styles.titleInfo}>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="px-2 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-black uppercase tracking-widest">
                      {selectedFile.type}
                    </div>
                    <h1 className={styles.title}>{selectedFile.name}</h1>
                  </div>
                  <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">{selectedFile.path}</span>
                </div>
                
                <div className={styles.actions}>
                  <div className={styles.viewToggle}>
                    <button 
                      className={`${styles.toggleBtn} ${viewMode === 'form' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setViewMode('form')}
                    >
                      Interface
                    </button>
                    <button 
                      className={`${styles.toggleBtn} ${viewMode === 'json' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setViewMode('json')}
                    >
                      Raw Schema
                    </button>
                  </div>

                  <div className="w-[1px] h-6 bg-text opacity-10 mx-2" />

                  <button 
                    className={styles.secondaryBtn} 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {mounted && (theme === 'dark' ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />)}
                  </button>
                  
                  <button 
                    className={styles.saveBtn} 
                    onClick={saveFile}
                    disabled={saving}
                  >
                    {saving ? <CircleNotch className="animate-spin" size={18} weight="bold" /> : <FloppyDisk size={18} weight="bold" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col gap-6 justify-center items-center h-[50vh]">
                  <CircleNotch className="animate-spin text-accent" size={48} weight="bold" />
                  <p className="text-sm font-bold tracking-widest opacity-30 uppercase">Indexing Document...</p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {viewMode === 'form' ? (
                    <Editor data={content} onChange={setContent} fileName={selectedFile.name} />
                  ) : (
                    <textarea 
                      className={styles.rawJsonEditor}
                      value={JSON.stringify(content, null, 2)}
                      onChange={(e) => {
                        try {
                          setContent(JSON.parse(e.target.value));
                        } catch (err) {}
                      }}
                    />
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-24 h-24 bg-accent/5 rounded-[2.5rem] flex items-center justify-center text-accent/20 mb-8 border border-accent/5 shadow-inner">
                <Layout size={48} weight="thin" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Control Center</h2>
              <p className="text-zinc-400 max-w-xs mx-auto text-sm leading-relaxed">
                Select a configuration document from the left panel to initiate deep editing.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
