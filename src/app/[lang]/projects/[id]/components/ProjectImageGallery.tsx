"use client";

import Image from "next/image";
import { GalleryProvider, GalleryItem } from "@/components/ui/GalleryProvider";
import { motion } from "framer-motion";
import styles from "../page.module.css";
import galleryStyles from "./ProjectGallery.module.css";
import ShareButtons from "./ShareButtons";

interface ProjectImageGalleryProps {
  mainImage: string;
  title: string;
  gallery?: string[];
  shortDescription: string;
  fullDescription: string;
  supportHref: string;
  dictionary: any;
}

export default function ProjectImageGallery({ 
  mainImage, 
  title, 
  gallery, 
  shortDescription, 
  fullDescription, 
  supportHref,
  dictionary
}: ProjectImageGalleryProps) {
  return (
    <GalleryProvider>
      <div className={styles.contentWrapper}>
        <div className={styles.mainContainer}>

          {/* ── Title ── */}
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{title}</h1>
          </div>

          {/* ── Hero split: Image | Sticky CTA Panel ── */}
          <div className={styles.heroSection}>
            {/* Left: Main image */}
            <div className={styles.heroImageSide}>
              <div className={styles.mainImageWrapper}>
                <GalleryItem src={mainImage}>
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={mainImage}
                      alt={title}
                      fill
                      priority
                      unoptimized
                      className={styles.image}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </GalleryItem>
              </div>
            </div>

            {/* Right: Sticky CTA panel */}
            <div className={styles.heroActionSide}>
              {/* Outer shell */}
              <div className={styles.contentShareWrapper}>
                {/* Inner core */}
                <div className={styles.contentShareInner}>
                  <ShareButtons title={title} dictionary={dictionary} />

                  <div className={styles.supportWrapper}>
                    <a href={supportHref} className={styles.donateBtn}>
                      <span>{dictionary.projects.support_project}</span>
                      <span className={styles.donateBtnIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Narrative content (BACK OUTSIDE hero grid) ── */}
          <div className={styles.narrativeSection}>
            {shortDescription && (
              <motion.div
                className={styles.shortDescription}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p>{shortDescription}</p>
              </motion.div>
            )}

            <hr className={styles.divider} />

            {fullDescription && (
              <motion.div
                className={styles.description}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {fullDescription.split('\n').filter(Boolean).map((paragraph: string, idx: number) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </motion.div>
            )}

            {/* ── Gallery ── */}
            {gallery && gallery.length > 0 && (
              <>
                <hr className={styles.divider} />
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={galleryStyles.galleryContainer}
                >
                  <h2 className={styles.galleryHeader}>{dictionary.projects.gallery_title}</h2>
                  <div className={galleryStyles.galleryGrid}>
                    {gallery.map((img: string, idx: number) => {
                      let bentoClass = galleryStyles.bentoSmall;
                      const patternIndex = idx % 7;
                      if (patternIndex === 0) bentoClass = galleryStyles.bentoLarge;
                      else if (patternIndex === 3) bentoClass = galleryStyles.bentoWide;
                      else if (patternIndex === 4) bentoClass = galleryStyles.bentoTall;

                      return (
                        <GalleryItem key={idx} src={img}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.55, delay: (idx % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className={`${galleryStyles.galleryItem} ${bentoClass}`}
                          >
                            <Image
                              src={img}
                              alt={`${title} — ${dictionary.projects.photo} ${idx + 1}`}
                              fill
                              unoptimized
                              className={galleryStyles.image}
                              style={{ objectFit: 'cover' }}
                            />
                            <div className={galleryStyles.zoomOverlay} />
                            <div className={galleryStyles.zoomIcon}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                              </svg>
                            </div>
                          </motion.div>
                        </GalleryItem>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </div>

        </div>
      </div>
    </GalleryProvider>
  );
}
