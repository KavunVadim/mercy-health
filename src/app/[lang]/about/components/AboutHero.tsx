"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./AboutHero.module.css";
import clsx from "clsx";

interface AboutHeroProps {
  images: string[];
}

export default function AboutHero({ images }: AboutHeroProps) {
  if (!images || images.length === 0) return null;

  const count = Math.min(images.length, 4); // Max 4 images for the bento layout
  const displayImages = images.slice(0, count);

  return (
    <div className={styles.heroContainer}>
      <motion.div
        className={clsx(styles.gallery, styles[`layout-${count}`])}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
      >
        {displayImages.map((src, i) => (
          <motion.div
            key={src + i}
            className={clsx(styles.imageWrapper, i === 0 && styles.primary)}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.4, ease: "easeOut" } }}
          >
            <Image
              src={src}
              alt="About Us Hero"
              fill
              className={styles.image}
              sizes={
                i === 0
                  ? "(max-width: 768px) 100vw, 900px"
                  : "(max-width: 768px) 50vw, 400px"
              }
              priority={i === 0}
            />
            <div className={styles.overlay} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
