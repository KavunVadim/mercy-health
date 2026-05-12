'use client';

import React, { useState, useMemo } from 'react';
import styles from '@/styles/dev-admin.module.css';
import { 
  Trash, 
  Plus, 
  CaretRight, 
  CaretDown, 
  CloudArrowUp, 
  Image as ImageIcon, 
  CircleNotch,
  CheckCircle,
  WarningCircle,
  X,
  DotsSixVertical,
  MagnifyingGlass,
  ArrowsClockwise,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
  TelegramLogo,
  TwitterLogo,
  TiktokLogo
} from '@phosphor-icons/react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { RichTextEditor } from './RichTextEditor';
import { SEOPreview } from './SEOPreview';
import { ImageCropper } from './ImageCropper';

interface EditorProps {
  data: any;
  onChange: (newData: any) => void;
  fileName?: string;
}

const RICH_TEXT_FIELDS = ['description', 'content', 'text', 'biography', 'summary', 'body'];
const IMAGE_FIELDS = ['image', 'photo', 'logo', 'icon'];

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

export const Editor: React.FC<EditorProps> = ({ data, onChange, fileName }) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{ path: string[], index: number } | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [currentLang, setCurrentLang] = useState<'uk' | 'en'>('uk');

  const toggleCollapse = (path: string) => {
    setCollapsed(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const getUploadFolder = () => {
    if (fileName?.includes('projects')) return 'projects';
    if (fileName?.includes('content')) return 'hero';
    if (fileName?.includes('partners')) return 'partners';
    if (fileName?.includes('news')) return 'news';
    return 'uploads';
  };

  const syncTranslations = (obj: any) => {
    if (obj && typeof obj === 'object' && 'uk' in obj && 'en' in obj) {
      return { ...obj, en: obj.uk };
    }
    return obj;
  };

  const updateNestedData = (path: string[], key: string, newValue: any) => {
    const updatedData = deepClone(data);
    let current = updatedData;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }

    // Auto-slug logic: only if the parent already has a 'slug' field
    const valueToSlug = typeof newValue === 'object' ? newValue.uk : newValue;
    if ((key === 'title' || key === 'name') && 'slug' in current) {
      if (!current.slug || current.slug === "") {
        current.slug = slugify(valueToSlug);
      }
    }

    current[key] = newValue;
    onChange(updatedData);
  };

  const getDisplayValue = (val: any): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      if (val[currentLang]) return String(val[currentLang]);
      if (val.uk) return String(val.uk);
      if (val.en) return String(val.en);
      const keys = Object.keys(val);
      if (keys.length > 0 && typeof val[keys[0]] !== 'object') return String(val[keys[0]]);
      return "Object";
    }
    return String(val);
  };

  const renderField = (key: string, value: any, path: string[]) => {
    const fullPath = [...path, key];
    const pathKey = fullPath.join('.');
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    const isCollapsed = collapsed[pathKey];

    const handleChange = (newValue: any) => {
      updateNestedData(path, key, newValue);
    };

    // Array Handling with Reorder and Search
    if (Array.isArray(value)) {
      const searchTerm = searchTerms[pathKey] || '';
      
      const filteredIndices = value.map((item, index) => ({ item, index }))
        .filter(({ item }) => {
          if (!searchTerm) return true;
          const str = JSON.stringify(item).toLowerCase();
          return str.includes(searchTerm.toLowerCase());
        });

      return (
        <div key={pathKey} className={styles.formGroup}>
          <div className="flex items-center justify-between mb-6">
            <div className={styles.collapsibleHeader} onClick={() => toggleCollapse(pathKey)}>
              <div className="flex items-center gap-3">
                <div className={`transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}>
                  <CaretRight size={20} weight="bold" className="text-accent" />
                </div>
                <div className={styles.formLabel}>
                  {label} 
                  <span className="ml-2 px-2 py-0.5 bg-accent-soft text-accent text-[10px] font-black rounded-full uppercase tracking-wider">
                    {value.length} items
                  </span>
                </div>
              </div>
            </div>
            
            {!isCollapsed && (
              <div className={styles.miniSearch}>
                <MagnifyingGlass size={14} weight="bold" className="opacity-40" />
                <input 
                  placeholder={`Filter ${label}...`} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerms(prev => ({ ...prev, [pathKey]: e.target.value }))}
                />
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col gap-6">
              <Reorder.Group 
                axis="y" 
                values={value} 
                onReorder={(newOrder) => handleChange(newOrder)}
                className="flex flex-col gap-3"
              >
                {filteredIndices.map(({ item, index }) => {
                  const itemPathKey = `${pathKey}.${index}`;
                  const isItemCollapsed = collapsed[itemPathKey] !== false;
                  
                  return (
                    <Reorder.Item 
                      key={index}
                      value={item}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${styles.arrayItem} ${isItemCollapsed ? styles.collapsed : ''}`}
                    >
                      <div className={styles.arrayItemHeader} onClick={() => toggleCollapse(itemPathKey)} style={{ cursor: 'pointer' }}>
                        <div className="flex items-center gap-4">
                          <div className="cursor-grab active:cursor-grabbing text-accent opacity-20 hover:opacity-100 transition-opacity p-1" onClick={(e) => e.stopPropagation()}>
                            <DotsSixVertical size={20} weight="bold" />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={styles.itemBadge}>#{index + 1}</span>
                            <span className="font-bold text-sm tracking-tight text-zinc-700 dark:text-zinc-200">
                              {typeof item === 'object' && item !== null 
                                ? getDisplayValue(item.title || item.name || item.label || item.id || `Item ${index + 1}`) 
                                : String(item).substring(0, 40)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            className={styles.deleteBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm({ path: fullPath, index });
                            }}
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                          <div className={`transition-transform duration-200 ${isItemCollapsed ? '' : 'rotate-90'}`}>
                            <CaretRight size={18} weight="bold" className="opacity-30" />
                          </div>
                        </div>
                      </div>
                      
                      {!isItemCollapsed && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="p-8 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20"
                        >
                          {typeof item === 'object' && item !== null ? (
                            <div className="flex flex-col gap-6">
                              {Object.entries(item).map(([k, v]) => renderField(k, v, [...fullPath, index.toString()]))}
                            </div>
                          ) : (
                            <input 
                              className={styles.input}
                              value={item ?? ""}
                              onChange={(e) => {
                                const newArr = [...value];
                                newArr[index] = e.target.value;
                                handleChange(newArr);
                              }}
                            />
                          )}
                        </motion.div>
                      )}
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              <button 
                className={styles.addBtn}
                onClick={() => {
                  const clearValues = (obj: any): any => {
                    if (Array.isArray(obj)) return [];
                    if (typeof obj === 'object' && obj !== null) {
                      const newObj: any = {};
                      Object.keys(obj).forEach(k => {
                        newObj[k] = clearValues(obj[k]);
                      });
                      return newObj;
                    }
                    if (typeof obj === 'string') return "";
                    if (typeof obj === 'number') return 0;
                    if (typeof obj === 'boolean') return false;
                    return obj;
                  };

                  const newItem = value.length > 0 
                    ? clearValues(value[0])
                    : "";
                  
                  handleChange([...value, newItem]);
                  const newItemPath = `${pathKey}.${value.length}`;
                  setCollapsed(prev => ({ ...prev, [newItemPath]: false }));
                }}
              >
                <Plus size={18} weight="bold" />
                Add New {label.replace(/s$/, '')}
              </button>
            </div>
          )}
        </div>
      );
    }

    // Object Handling with Translation Sync
    if (typeof value === 'object' && value !== null) {
      const isTranslation = 'uk' in value && 'en' in value;

      if (isTranslation) {
        const langValue = value[currentLang];
        const isRichText = RICH_TEXT_FIELDS.includes(key.toLowerCase());

        return (
          <div key={pathKey} className={styles.formGroup}>
            <div className="flex items-center justify-between mb-2">
              <label className={styles.formLabel}>{label}</label>
              <div className="flex items-center gap-2">
                <div className={styles.langBadge}>{currentLang}</div>
                <button 
                  className={styles.syncBtn}
                  onClick={() => handleChange(syncTranslations(value))}
                  title="Copy UK to EN"
                >
                  <ArrowsClockwise size={14} weight="bold" />
                </button>
              </div>
            </div>
            {isRichText ? (
              <RichTextEditor 
                value={langValue} 
                onChange={(v) => handleChange({ ...value, [currentLang]: v })} 
              />
            ) : typeof langValue === 'string' && langValue.length > 80 ? (
              <textarea 
                className={styles.textarea}
                value={langValue ?? ""}
                onChange={(e) => handleChange({ ...value, [currentLang]: e.target.value })}
              />
            ) : (
              <input 
                className={styles.input}
                value={langValue ?? ""}
                onChange={(e) => handleChange({ ...value, [currentLang]: e.target.value })}
              />
            )}
          </div>
        );
      }

      return (
        <div key={pathKey} className={styles.formGroup}>
          <div className="flex items-center justify-between">
            <div className={styles.collapsibleHeader} onClick={() => toggleCollapse(pathKey)}>
              <div className="flex items-center gap-3">
                {isCollapsed ? <CaretRight size={20} weight="bold" className="text-accent" /> : <CaretDown size={20} weight="bold" className="text-accent" />}
                <div className={styles.formLabel}>{label}</div>
              </div>
            </div>
          </div>
          
          {!isCollapsed && (
            <div className={styles.nested}>
              {Object.entries(value).map(([k, v]) => renderField(k, v, fullPath))}
            </div>
          )}
        </div>
      );
    }

    // Simple Field Handling (Boolean, Image, Text)
    if (typeof value === 'boolean') {
      return (
        <div key={pathKey} className={path.length === 0 ? styles.formGroup : styles.fieldRow}>
          <label className={styles.formLabel}>{label}</label>
          <div 
            className={`${styles.toggle} ${value ? styles.toggleActive : ''}`}
            onClick={() => handleChange(!value)}
          >
            <motion.div 
              className={styles.toggleThumb}
              animate={{ x: value ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>
      );
    }

    const isImageField = IMAGE_FIELDS.some(f => key.toLowerCase().includes(f));

    if (isImageField && typeof value === 'string') {
      return (
        <div key={pathKey} className={path.length === 0 ? styles.formGroup : styles.fieldRow}>
          <label className={styles.formLabel}>{label}</label>
          <div className={styles.imageFieldRow}>
            <div className={styles.imagePreview}>
              {value ? (
                <img src={value} alt="Preview" />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.2 }}>
                  <ImageIcon size={48} />
                </div>
              )}
            </div>
            <div className={styles.imageInputs}>
              <input 
                className={styles.input}
                value={value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="/images/..."
              />
              <ImageUploadButton 
                folder={getUploadFolder()} 
                onUpload={(url) => handleChange(url)} 
              />
            </div>
          </div>
        </div>
      );
    }

    const isRichText = RICH_TEXT_FIELDS.includes(key.toLowerCase());

    // Social Media Icon Detection
    const socialIcons: Record<string, any> = {
      facebook: FacebookLogo,
      instagram: InstagramLogo,
      linkedin: LinkedinLogo,
      youtube: YoutubeLogo,
      telegram: TelegramLogo,
      twitter: TwitterLogo,
      x: X,
      tiktok: TiktokLogo
    };

    const SocialIconComponent = socialIcons[key.toLowerCase()];

    return (
      <div key={pathKey} className={path.length === 0 ? styles.formGroup : styles.fieldRow}>
        <label className={styles.formLabel}>{label}</label>
        {isRichText && typeof value === 'string' ? (
          <RichTextEditor 
            value={value} 
            onChange={handleChange} 
          />
        ) : typeof value === 'string' && value.length > 80 ? (
          <textarea 
            className={styles.textarea}
            value={value ?? ""}
            onChange={(e) => handleChange(e.target.value)}
          />
        ) : (
          <div className={styles.inputWrapper}>
            {SocialIconComponent && (
              <div className={styles.socialIcon}>
                <SocialIconComponent size={20} weight="duotone" />
              </div>
            )}
            <input 
              className={styles.input}
              type={typeof value === 'number' ? 'number' : 'text'}
              value={value ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleChange(typeof value === 'number' ? (val === "" ? 0 : parseFloat(val)) : val);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const { path, index } = deleteConfirm;
    
    const updatedData = deepClone(data);
    let current = updatedData;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    
    if (Array.isArray(current)) {
      current.splice(index, 1);
      onChange(updatedData);
    }
    
    setDeleteConfirm(null);
  };

  if (!data) return (
    <div className={styles.emptyState}>
      <CircleNotch size={48} className="animate-spin" />
      <h2>Select a file to edit</h2>
    </div>
  );

  return (
    <div className={styles.editor}>
      <div className={styles.editorToolbar}>
        <div className={styles.langSwitcher}>
          <button 
            className={`${styles.langBtn} ${currentLang === 'uk' ? styles.langBtnActive : ''}`}
            onClick={() => setCurrentLang('uk')}
          >
            Ukrainian
          </button>
          <button 
            className={`${styles.langBtn} ${currentLang === 'en' ? styles.langBtnActive : ''}`}
            onClick={() => setCurrentLang('en')}
          >
            English
          </button>
        </div>
        <div className="text-[10px] opacity-20 uppercase font-black tracking-[0.2em]">Editing Mode: {currentLang}</div>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full"
        >
          {Object.entries(data).map(([k, v]) => renderField(k, v, []))}
          
          {fileName?.includes('json') && !fileName.includes('dictionary') && (
            <SEOPreview 
              title={getDisplayValue(data.title || data.name || "")} 
              description={getDisplayValue(data.description || data.summary || "")} 
              image={data.image || data.photo || data.items?.[0]?.image || ""}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <div className={styles.modalOverlay}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={styles.modalContent}
            >
              <div className={styles.modalTitle}>
                <WarningCircle size={28} weight="fill" />
                <span>Confirm Deletion</span>
              </div>
              <p className={styles.modalText}>
                Are you sure you want to remove this item? You will need to click "Save Changes" to apply this deletion to the database.
              </p>
              <div className={styles.modalActions}>
                <button 
                  className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className={`${styles.modalBtn} ${styles.modalBtnDelete}`}
                  onClick={confirmDelete}
                >
                  Delete Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageUploadButton = ({ folder, onUpload }: { folder: string, onUpload: (url: string) => void }) => {
  const [uploading, setUploading] = React.useState(false);
  const [cropImage, setCropImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropImage(null);
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', croppedBlob, 'image.webp');
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/dev-admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onUpload(data.url);
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileSelect}
        accept="image/*"
      />
      <button 
        className={styles.secondaryBtn} 
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? <CircleNotch className="animate-spin" size={18} /> : <CloudArrowUp size={18} weight="bold" />}
        <span>{uploading ? 'Processing...' : 'Upload & Crop'}</span>
      </button>

      {cropImage && (
        <ImageCropper 
          image={cropImage} 
          aspect={folder === 'hero' ? 16 / 7 : 16 / 9}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />
      )}
    </div>
  );
};
