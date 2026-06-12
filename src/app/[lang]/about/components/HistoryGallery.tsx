"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./HistoryGallery.module.css";

interface HistoryGalleryProps {
  images: string[];
}

export default function HistoryGallery({ images }: HistoryGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <motion.div
      className={styles.grid}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {images.length === 1 && (
        <div className={styles.single}>
          <Image src={images[0]} alt="" fill className={styles.img} sizes="(max-width: 768px) 100vw, 800px" />
        </div>
      )}
      {images.length === 2 && (
        <>
          <div className={styles.dualItem}>
            <Image src={images[0]} alt="" fill className={styles.img} sizes="(max-width: 768px) 100vw, 400px" />
          </div>
          <div className={styles.dualItem}>
            <Image src={images[1]} alt="" fill className={styles.img} sizes="(max-width: 768px) 100vw, 400px" />
          </div>
        </>
      )}
      {images.length >= 3 && (
        <>
          <div className={styles.featured}>
            <Image src={images[0]} alt="" fill className={styles.img} sizes="(max-width: 768px) 100vw, 700px" />
          </div>
          <div className={styles.sideCol}>
            {images.slice(1, 3).map((src, i) => (
              <div key={i} className={styles.sideItem}>
                <Image src={src} alt="" fill className={styles.img} sizes="(max-width: 768px) 100vw, 350px" />
              </div>
            ))}
          </div>
          {images.length > 3 && (
            <div className={styles.bottomRow}>
              {images.slice(3).map((src, i) => (
                <div key={i} className={styles.bottomItem}>
                  <Image src={src} alt="" fill className={styles.img} sizes="(max-width: 768px) 50vw, 250px" />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
