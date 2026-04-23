"use client";

import Image from "next/image";
import styles from "./Tabs.module.css";

export default function GalleryTab({ dictionary }: { dictionary: any }) {
  const { title, description } = dictionary.news.gallery;

  // Mock gallery images
  const images = [
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1576091160550-2173dad99978?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1583321500900-82807e458f3c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&h=600&fit=crop&q=80",
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDescription}>{description}</p>
      
      <div className={styles.galleryGrid}>
        {images.map((img, idx) => (
          <div key={idx} className={styles.galleryItem}>
            <Image
              src={img}
              alt={`Gallery image ${idx + 1}`}
              fill
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
