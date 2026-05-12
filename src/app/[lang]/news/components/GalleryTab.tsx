"use client";

import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import styles from "./Tabs.module.css";

export default function GalleryTab({ dictionary }: { dictionary: any }) {
  const dict = dictionary as any;
  const { title, description, images = [] } = dict.news.gallery;

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDescription}>{description}</p>
      
      <PhotoProvider>
        <div className={styles.galleryGrid}>
          {images.map((img: string, idx: number) => (
            <PhotoView key={idx} src={img}>
              <div className={styles.galleryItem} style={{ cursor: 'pointer' }}>
                <Image
                  src={img}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className={styles.galleryImage}
                />
              </div>
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    </div>
  );
}
