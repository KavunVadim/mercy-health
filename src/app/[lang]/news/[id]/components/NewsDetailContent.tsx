"use client";

import Image from "next/image";
import { GalleryProvider, GalleryItem } from "@/components/ui/GalleryProvider";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import styles from "../page.module.css";
import galleryStyles from "@/app/[lang]/projects/[id]/components/ProjectGallery.module.css";

interface NewsDetailContentProps {
  newsItem: any;
  dictionary: any;
  locale: string;
}

export default function NewsDetailContent({ newsItem, dictionary, locale }: NewsDetailContentProps) {
  return (
    <GalleryProvider>
      <div className={styles.contentWrapper}>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>{newsItem.date}</span>
          <h1 className={styles.title}>{newsItem.title}</h1>
        </div>

        <div className={styles.heroSection}>
          <div className={styles.heroImageSide}>
            <div className={styles.mainImageWrapper}>
              <GalleryItem src={newsItem.image}>
                <div style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}>
                  <Image
                    src={newsItem.image}
                    alt={newsItem.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    className={styles.image}
                  />
                </div>
              </GalleryItem>
            </div>
            
            <div className={styles.narrativeSection}>
              <div className={styles.description}>
                {newsItem.content && Array.isArray(newsItem.content) ? (
                  newsItem.content.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{newsItem.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action/Video sidebar */}
          {newsItem.video_link && (
            <aside className={styles.heroActionSide}>
              <div className={styles.contentShareWrapper}>
                <div className={styles.contentShareInner}>
                  <div className={styles.playIconCircle}>
                    <FaPlay className={styles.playIcon} />
                  </div>
                  <h3 className={styles.videoTitle}>
                    {newsItem.video_label || dictionary.news.video_story}
                  </h3>
                  <a
                    href={newsItem.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.videoLinkButton}
                  >
                    {locale === "uk" ? "Дивитись сюжет" : "Watch Story"}
                  </a>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Gallery section */}
        {newsItem.gallery && newsItem.gallery.length > 0 && (
          <div className={galleryStyles.galleryContainer}>
            <h2 className={styles.galleryHeader}>{dictionary.news.gallery_title}</h2>
            <div className={galleryStyles.galleryGrid}>
              {newsItem.gallery.map((img: string, idx: number) => {
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
                        alt={`${newsItem.title} — ${dictionary.projects.photo} ${idx + 1}`}
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
          </div>
        )}
      </div>
    </GalleryProvider>
  );
}
