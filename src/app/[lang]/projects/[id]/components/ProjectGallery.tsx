"use client";

import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import styles from "./ProjectGallery.module.css";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  return (
    <div className={styles.gallery}>
      <h3 className={styles.galleryTitle}>Галерея проєкту</h3>
      <div className={styles.galleryGrid}>
        {images.map((img, idx) => (
          <PhotoView key={idx} src={img}>
            <div className={styles.galleryImageWrapper}>
              <Image
                src={img}
                alt={`${title} gallery image ${idx + 1}`}
                fill
                className={styles.image}
              />
              <div className={styles.zoomOverlay}>
                <span className={styles.zoomText}>Збільшити</span>
              </div>
            </div>
          </PhotoView>
        ))}
      </div>
    </div>
  );
}
