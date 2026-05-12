"use client";

import Image from "next/image";
import { GalleryProvider, GalleryItem } from "@/components/ui/GalleryProvider";
import styles from "./Tabs.module.css";

export default function GalleryTab({ dictionary }: { dictionary: any }) {
  const dict = dictionary as any;
  const { title, description, images = [] } = dict.news.gallery;
  

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDescription}>{description}</p>
      
      <GalleryProvider>
        <div className={styles.galleryGrid}>
          {images.map((img: string, idx: number) => (
            <GalleryItem key={idx} src={img}>
              <div className={styles.galleryItem}>
                <Image
                  src={img}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className={styles.galleryImage}
                />
              </div>
            </GalleryItem>
          ))}
        </div>
      </GalleryProvider>
    </div>
  );
}
