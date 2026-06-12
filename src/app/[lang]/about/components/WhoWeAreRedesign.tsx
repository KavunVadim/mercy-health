"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./WhoWeAreRedesign.module.css";
import clsx from "clsx";
import { 
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { Dictionary } from "@/types/content";

interface WhoWeAreRedesignProps {
  dictionary: Dictionary;
}

export default function WhoWeAreRedesign({ dictionary }: WhoWeAreRedesignProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const historyTitle = dictionary.about.history.title || "ПРО НАШУ ІСТОРІЮ";
  const rawHistoryContent = dictionary.about.history.content || "";
  const historyParagraphs = rawHistoryContent.split('\n\n');
  
  const heroImage = dictionary.about.hero_image || "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/18fb78a2301bb8e0.webp";
  const patchesImage = dictionary.about.patches_image || "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/73306f706831d53f.jpeg";
  const galleryImages = (dictionary.about.history.images || []).map((url, idx) => ({
    url,
    caption: idx === 0 ? "Доставка допомоги" : 
             idx === 1 ? "Забезпечення водою" :
             idx === 2 ? "Реанімобіль" :
             idx === 3 ? "Медична евакуація" : "Допомога дітям"
  }));

  // Fallback if gallery is empty
  const displayGallery = galleryImages.length > 0 ? galleryImages : [
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/1ab6c82fcb63943f.webp", caption: "Доставка допомоги" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/e59a9f52636d86e0.webp", caption: "Забезпечення водою" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/d8a6a79d7184b3f9.JPG", caption: "Реанімобіль" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/8ceeb51d684fcd4d.JPG", caption: "Медична евакуація" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/d677557cfe4838b8.webp", caption: "Допомога дітям" }
  ];

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex(prev => (prev + 1) % displayGallery.length);
  }, [displayGallery.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex(prev => (prev - 1 + displayGallery.length) % displayGallery.length);
  }, [displayGallery.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, closeLightbox, goNext, goPrev]);

  return (
    <div className={styles.wrapper}>
      {/* Section 1: Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <span>{dictionary.about.sidebar.who_we_are}</span>
              <div className={styles.dot} />
            </div>
            <h1 className={styles.heroTitle} dangerouslySetInnerHTML={{ 
              __html: historyTitle.replace("ІСТОРІЮ", `<span class="${styles.accentText}">ІСТОРІЮ</span>`) 
            }} />
            <p className={styles.heroLead}>
              {historyParagraphs[0]}
            </p>
          </div>
          <div className={styles.heroImageWrapper}>
            <Image 
              src={heroImage}
              alt={historyTitle}
              fill
              className={styles.heroImage}
              priority
            />
          </div>
        </div>
      </section>

      {/* Section 2: Secondary Content (The Patches & Text) */}
      <section className={styles.honorSection}>
        <div className={styles.honorGrid}>
          <div className={styles.honorImageWrapper}>
            <div className={styles.patchFrame}>
              <Image 
                src={patchesImage}
                alt="Стіна пошани"
                fill
                className={styles.patchImage}
              />
              <div className={styles.frameDecoration} />
            </div>
            <p className={styles.imageCaption}>Стіна подяк від наших захисників</p>
          </div>
          <div className={styles.honorContent}>
            <h2 className={styles.sectionTitle}>Шлях Милосердя</h2>
            <div className={styles.historyColumns}>
              {historyParagraphs.slice(1).map((p, i) => (
                <p key={i} className={styles.historyPara}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Photo Gallery */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryHeader}>
          <h2 className={styles.sectionTitle}>{dictionary.about.history.title} ГАЛЕРЕЯ</h2>
          <div className={styles.titleLine} />
        </div>
        
        <div className={styles.galleryGrid}>
          {displayGallery.map((img, idx) => (
            <div
              key={idx}
              className={clsx(styles.galleryItem, styles[`item${idx + 1}`])}
              onClick={() => openLightbox(idx)}
            >
              <Image 
                src={img.url}
                alt={img.caption}
                fill
                className={styles.galleryImg}
              />
              <div className={styles.galleryInfo}>
                <p>{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className={styles.lightboxClose} onClick={closeLightbox}>
              <X size={28} />
            </button>
            {displayGallery.length > 1 && (
              <>
                <button className={clsx(styles.lightboxNav, styles.lightboxPrev)} onClick={(e) => { e.stopPropagation(); goPrev(); }}>
                  <ChevronLeft size={32} />
                </button>
                <button className={clsx(styles.lightboxNav, styles.lightboxNext)} onClick={(e) => { e.stopPropagation(); goNext(); }}>
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <motion.div
              className={styles.lightboxContent}
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.lightboxImageWrapper}>
                <img
                  src={displayGallery[lightboxIndex].url}
                  alt={displayGallery[lightboxIndex].caption}
                  className={styles.lightboxImage}
                />
              </div>
              <p className={styles.lightboxCaption}>{displayGallery[lightboxIndex].caption}</p>
              <p className={styles.lightboxCounter}>{lightboxIndex + 1} / {displayGallery.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
