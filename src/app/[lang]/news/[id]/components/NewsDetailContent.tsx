"use client";

import Image from "next/image";
import { GalleryProvider, GalleryItem } from "@/components/ui/GalleryProvider";
import { motion } from "framer-motion";
import { FaPlay, FaEye } from "react-icons/fa";
import styles from "../page.module.css";
import galleryStyles from "@/app/[lang]/projects/[id]/components/ProjectGallery.module.css";

interface NewsDetailContentProps {
  newsItem: any;
  dictionary: any;
  locale: string;
}

export default function NewsDetailContent({ newsItem, dictionary, locale }: NewsDetailContentProps) {
  const hasVideo = !!newsItem.video_link;
  const hasExternalLink = !!(newsItem.link || newsItem.external_link);
  const hasSidebar = hasVideo || hasExternalLink;

  return (
    <GalleryProvider>
      <div className={styles.contentWrapper}>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>{newsItem.date}</span>
          <h1 className={styles.title}>{newsItem.title}</h1>
        </div>

        <div className={`${styles.heroSection} ${!hasSidebar ? styles.noSidebar : ""}`}>
          {/* 1. Main Cover Image Wrapper */}
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
                  style={{ objectPosition: newsItem.image_focus || "center" }}
                />
              </div>
            </GalleryItem>
          </div>

          {/* 2. Dynamic Action/Video Sidebar */}
          {hasSidebar && (
            <aside className={styles.heroActionSide}>
              {/* Video Card */}
              {hasVideo && (
                <div className={styles.contentShareWrapper}>
                  <div className={styles.contentShareInner}>
                    <div className={styles.playIconCircle}>
                      <FaPlay className={styles.playIcon} />
                    </div>
                    <h3 className={styles.videoTitle}>
                      {typeof newsItem.video_label === 'string' 
                        ? newsItem.video_label 
                        : newsItem.video_label?.[locale] || dictionary.news.video_story}
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
              )}

              {/* External Link Card */}
              {hasExternalLink && (
                <div className={styles.contentShareWrapper}>
                  <div className={styles.contentShareInner}>
                    <div className={styles.playIconCircle} style={{ background: 'var(--accent)' }}>
                      <FaEye className={styles.playIcon} style={{ marginLeft: 0 }} />
                    </div>
                    <h3 className={styles.videoTitle}>
                      {typeof newsItem.link_label === 'string'
                        ? newsItem.link_label
                        : newsItem.link_label?.[locale] || (locale === "uk" ? "Деталі події" : "Event Details")}
                    </h3>
                    <a
                      href={newsItem.link || newsItem.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.videoLinkButton}
                    >
                      {locale === "uk" ? "Деталі події" : "Event Details"}
                    </a>
                  </div>
                </div>
              )}
            </aside>
          )}

          {/* 3. Narrative Text Section */}
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
