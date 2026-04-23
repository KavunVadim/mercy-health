"use client";

import Image from "next/image";
import { GalleryProvider, GalleryItem } from "@/components/ui/GalleryProvider";
import styles from "./ProjectGallery.module.css";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  return (
    <GalleryProvider>
      <div className={styles.gallery}>
        <h3 className={styles.galleryTitle}>Галерея проєкту</h3>
        <div className={styles.galleryGrid}>
          {images.map((img, idx) => (
            <GalleryItem key={idx} src={img}>
              <div className={styles.galleryImageWrapper}>
                <Image
                  src={img}
                  alt={`${title} gallery image ${idx + 1}`}
                  fill
                  className={styles.image}
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.zoomOverlay}>
                  <span className={styles.zoomText}>Збільшити</span>
                </div>
              </div>
            </GalleryItem>
          ))}
        </div>
      </div>
    </GalleryProvider>
  );
}
