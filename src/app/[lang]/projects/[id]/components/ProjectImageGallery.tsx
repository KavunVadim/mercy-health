"use client";

import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
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
    <PhotoProvider
      maskOpacity={0.8}
      bannerVisible={false}
    >
      <div className={styles.contentCol}>
        <div className={styles.mainImageWrapper}>
          <PhotoView src={mainImage}>
            <div style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}>
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
          </PhotoView>
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
                <PhotoView key={idx} src={img}>
                  <div className={galleryStyles.galleryImageWrapper} style={{ cursor: 'pointer' }}>
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
                </PhotoView>
              ))}
            </div>
          </div>
        )}
      </div>
    </PhotoProvider>
  );
}
