"use client";

import Image from "next/image";
import { GalleryProvider, GalleryItem } from "@/components/ui/GalleryProvider";
import styles from "./ProjectGallery.module.css";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  dictionary: any;
}

export default function ProjectGallery({ images, title, dictionary }: ProjectGalleryProps) {
  return (
    <GalleryProvider>
      <div className={styles.gallery}>
        <h3 className={styles.galleryTitle}>{dictionary.projects.gallery_title}</h3>
        <div className={styles.galleryGrid}>
          {images.map((img, idx) => (
            <GalleryItem key={idx} src={img}>
              <div className={styles.galleryImageWrapper}>
                  <Image
                    src={img}
                    alt={`${title} — ${dictionary.projects.photo} ${idx + 1}`}
                    fill
                    className={styles.image}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className={styles.zoomOverlay}>
                    <span className={styles.zoomText}>{dictionary.projects.zoom}</span>
                  </div>
              </div>
            </GalleryItem>
          ))}
        </div>
      </div>
    </GalleryProvider>
  );
}
