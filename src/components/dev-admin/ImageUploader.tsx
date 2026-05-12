'use client';

import React, { useState, useCallback } from 'react';
import styles from '@/styles/dev-admin.module.css';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { ImageCropper } from './ImageCropper';

interface ImageUploaderProps {
  folder?: string;
  onUpload?: (url: string) => void;
  aspect?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ folder = 'uploads', onUpload, aspect = 16 / 9 }) => {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [tempImage, setTempImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCropComplete = async (croppedBlob: Blob) => {
    setTempImage(null);
    setUploading(true);
    setStatus('idle');

    const formData = new FormData();
    formData.append('file', croppedBlob, 'cropped_image.webp');
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/dev-admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setStatus('success');
        if (onUpload) onUpload(data.url);
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <>
      <div 
        {...getRootProps()} 
        className={`${styles.dropZone} ${isDragActive ? styles.dropZoneActive : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <>
            <Loader2 className="animate-spin" size={32} color="var(--accent)" />
            <p>Processing...</p>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 size={32} color="#10b981" />
            <p style={{ color: '#10b981' }}>Success!</p>
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle size={32} color="#ef4444" />
            <p style={{ color: '#ef4444' }}>Failed</p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-zinc-400" />
            <p className="text-sm font-medium">Click or drag to upload</p>
            <p className="text-xs text-zinc-400">Cropping available after selection</p>
          </div>
        )}
      </div>

      {tempImage && (
        <ImageCropper 
          image={tempImage}
          aspect={aspect}
          onCropComplete={handleCropComplete}
          onCancel={() => setTempImage(null)}
        />
      )}
    </>
  );
};
