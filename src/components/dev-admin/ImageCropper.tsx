'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import styles from '@/styles/dev-admin.module.css';
import { X, Check, Scissors } from '@phosphor-icons/react';

interface ImageCropperProps {
  image: string;
  aspect?: number;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export const ImageCropper = ({ image, aspect = 16 / 9, onCropComplete, onCancel }: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: any) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const imageElement = await createImage(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/webp', 0.9);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onSave = async () => {
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      onCropComplete(croppedBlob);
    }
  };

  return (
    <div className={styles.cropperOverlay}>
      <div className={styles.cropperModal}>
        <div className={styles.cropperHeader}>
          <div className="flex items-center gap-2 font-bold">
            <Scissors size={20} />
            Crop Image
          </div>
          <button onClick={onCancel} className={styles.mediaActionBtn}><X size={20} /></button>
        </div>
        
        <div className={styles.cropperContainer}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className={styles.cropperFooter}>
          <div className="flex-1 flex items-center gap-4">
            <span className="text-xs font-bold uppercase text-zinc-400">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className={styles.secondaryBtn}>Cancel</button>
            <button onClick={onSave} className={styles.saveBtn}>
              <Check size={18} weight="bold" />
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
