"use client";

import Image from "next/image";
import { GalleryProvider, GalleryItem } from "@/components/ui/GalleryProvider";
import styles from "../page.module.css";
import galleryStyles from "./ProjectGallery.module.css";

interface ProjectImageGalleryProps {
  mainImage: string;
  title: string;
  gallery?: string[];
  description: string;
}

export default function ProjectImageGallery({ mainImage, title, gallery, description }: ProjectImageGalleryProps) {
  return (
    <GalleryProvider>
      <div className={styles.contentCol}>
        <div className={styles.mainImageWrapper}>
          <GalleryItem src={mainImage}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={mainImage}
                alt={title}
                fill
                className={styles.image}
                priority
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.zoomOverlayMain}>
                <span>Переглянути фото</span>
              </div>
            </div>
          </GalleryItem>
        </div>

        <div className={styles.description}>
          {description.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {gallery && gallery.length > 0 && (
          <div className={galleryStyles.gallery}>
            <h3 className={galleryStyles.galleryTitle}>Галерея проєкту</h3>
            <div className={galleryStyles.galleryGrid}>
              {gallery.map((img, idx) => (
                <GalleryItem key={idx} src={img}>
                  <div className={galleryStyles.galleryImageWrapper}>
                    <Image
                      src={img}
                      alt={`${title} gallery image ${idx + 1}`}
                      fill
                      className={galleryStyles.image}
                      style={{ objectFit: 'cover' }}
                    />
                    <div className={galleryStyles.zoomOverlay}>
                      <span className={galleryStyles.zoomText}>Збільшити</span>
                    </div>
                  </div>
                </GalleryItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </GalleryProvider>
  );
}
