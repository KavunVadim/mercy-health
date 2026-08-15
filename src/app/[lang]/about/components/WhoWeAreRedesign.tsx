"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./WhoWeAreRedesign.module.css";
import clsx from "clsx";
import { GalleryProvider, GalleryItem } from "@/components/ui/GalleryProvider";
import type { Dictionary } from "@/types/content";

interface WhoWeAreRedesignProps {
  dictionary: Dictionary;
}

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease },
};

const staggerFadeUp = (idx: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, delay: idx * 0.08, ease },
});

export default function WhoWeAreRedesign({ dictionary }: WhoWeAreRedesignProps) {
  const params = useParams();
  const locale = typeof params.lang === "string" ? params.lang : "uk";
  const { about } = dictionary;
  const historyTitle = about.history.title || "НАША ІСТОРІЯ";
  const pathOfMercyTitle = about.sidebar.path_of_mercy || "ШЛЯХ МИЛОСЕРДЯ";
  const rawHistoryContent = about.history.content || "";
  const historyParagraphs = rawHistoryContent.split("\n\n");

  const heroImage = about.hero_image || null;
  const patchesImage = about.patches_image || null;

  const galleryCaptions = about.gallery_captions || [];
  const displayGallery = (about.history.images || [])
    .filter(Boolean)
    .map((url, idx) => ({
      url,
      caption: galleryCaptions[idx] || "",
    }));

  const heroStats = about.hero_stats || [];
  const timelineData = about.timeline || [];
  const honorTags = about.honor?.tags || [];

  return (
    <GalleryProvider>
      <div className={styles.wrapper}>

        {/* ───── Section 1: Hero ───── */}
        {heroImage && (
        <section className={styles.heroSection}>
          <div className={styles.heroImageWrapper}>
            <div className={styles.clickableWrapper}>
              <Image
                src={heroImage}
                alt={pathOfMercyTitle}
                fill
                priority
                sizes="100vw"
                className={styles.heroImage}
              />
              <div className={styles.heroOverlay} />

              {/* Top bar */}
              <div className={styles.heroTopBar}>
                <div className={styles.heroPill}>
                  <span className={styles.heroPillDot} />
                  {dictionary.about.sidebar.who_we_are}
                </div>
                <div className={styles.heroYear}>{about.hero_year}</div>
              </div>

              {/* Bottom content */}
              <div className={styles.heroContent}>
                <h2
                  className={styles.heroTitle}
                  dangerouslySetInnerHTML={{
                    __html: pathOfMercyTitle
                      .toUpperCase()
                      .replace("МИЛОСЕРДЯ", `<span class="${styles.accentText}">МИЛОСЕРДЯ</span>`)
                      .replace("MERCY", `<span class="${styles.accentText}">MERCY</span>`),
                  }}
                />
                <div className={styles.heroStats}>
                  {heroStats.map((stat, si) => (
                    <React.Fragment key={si}>
                      {si > 0 && <div className={styles.heroStatDivider} />}
                      <div className={styles.heroStat}>
                        <span className={styles.heroStatNum}>{stat.number}</span>
                        <span className={styles.heroStatLabel}>{stat.label}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ───── Section 2: Story — pull-quote + timeline layout ───── */}
        <section className={styles.storySection}>
          <div className={styles.storyHeader}>
            <motion.div {...fadeUp}>
              <p className={styles.storyEyebrow}>{about.story_eyebrow}</p>
              <h2 className={styles.storyTitle}>{historyTitle.toUpperCase()}</h2>
            </motion.div>
            <motion.blockquote
              className={styles.pullQuote}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >              
              {about.pull_quote}
            </motion.blockquote>
          </div>

          <div className={styles.storyGrid}>
            {/* Timeline column */}
            <div className={styles.timelineCol}>
              {timelineData.map((item, i) => (
                <motion.div key={item.year} className={styles.tlItem} {...staggerFadeUp(i)}>
                  <div className={styles.tlYearWrap}>
                    <span className={styles.tlYear}>{item.year}</span>
                    <span className={styles.tlLabel}>{item.label}</span>
                  </div>
                  <div className={styles.tlConnector}>
                    <div className={styles.tlDot} />
                    {i < 2 && <div className={styles.tlLine} />}
                  </div>
                  <p className={styles.tlText}>{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Text column */}
            <div className={styles.storyTextCol}>
              {historyParagraphs.map((p, i) => (
                <motion.p
                  key={i}
                  {...staggerFadeUp(i)}
                  className={i === 0 ? styles.storyParaFirst : styles.storyPara}
                >
                  {i === 0 && <span className={styles.dropCap}>{p.charAt(0)}</span>}
                  {i === 0 ? p.slice(1) : p}
                </motion.p>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Section 3: Dark — 130+ dominant number + patches image ───── */}
        <section className={styles.honorSection}>
          {/* Background glow blobs */}
          <div className={styles.honorGlow1} />
          <div className={styles.honorGlow2} />

          <div className={styles.honorInner}>
            <motion.div
              className={styles.honorTextCol}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
            >
              <p className={styles.honorEyebrow}>{about.honor.eyebrow}</p>
              <div className={styles.honorBigNum}>{about.honor.big_number}<span className={styles.honorPlus}>+</span></div>
              <p className={styles.honorNumLabel}>{about.honor.num_label}</p>
              <p className={styles.honorText}>{about.honor.text || historyParagraphs[3] || historyParagraphs[0]}</p>
              <div className={styles.honorTags}>
                {honorTags.map((tag, ti) => {
                  const href = tag.href
                    ? `/${locale}/projects/${tag.href}`
                    : null;
                  const inner = <span key={ti} className={styles.honorTag}>{tag.label}</span>;
                  return href ? <Link key={ti} href={href} className={styles.honorTagLink}>{inner}</Link> : inner;
                })}
              </div>
            </motion.div>

            {patchesImage && (
            <motion.div
              className={styles.honorImageCol}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              <div className={styles.patchFrame}>
                <GalleryItem src={patchesImage}>
                  <div className={styles.clickableWrapper}>
                    <Image
                      src={patchesImage}
                      alt={about.honor.patch_alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.patchImage}
                    />
                    <div className={styles.patchFrameInner} />
                    <div className={styles.patchZoomBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </div>
                  </div>
                </GalleryItem>
              </div>
              <p className={styles.honorCaption}>{about.honor.caption}</p>
            </motion.div>
            )}
          </div>
        </section>

        {/* ───── Section 4: Gallery ───── */}
        <section className={styles.gallerySection}>
          <div className={styles.galleryHeader}>
            <motion.div {...fadeUp}>
              <p className={styles.galleryEyebrow}>{about.gallery_eyebrow}</p>
              <h2 className={styles.galleryTitle}>{dictionary.about.gallery_title}</h2>
            </motion.div>
            <div className={styles.titleLine} />
          </div>

          {displayGallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease }}
          >
            <div className={styles.galleryGrid}>
              {displayGallery.map((img, idx) => {
                let bentoClass = styles.bentoSmall;
                const patternIndex = idx % 7;
                if (patternIndex === 0) bentoClass = styles.bentoLarge;
                else if (patternIndex === 3) bentoClass = styles.bentoWide;
                else if (patternIndex === 4) bentoClass = styles.bentoTall;

                return (
                  <GalleryItem key={idx} src={img.url}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.55, delay: (idx % 4) * 0.08, ease }}
                      className={clsx(styles.galleryItem, bentoClass)}
                    >
                      <Image
                        src={img.url}
                        alt={img.caption}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={styles.galleryImg}
                      />
                      <div className={styles.zoomOverlay} />
                      <div className={styles.galleryCaption}>{img.caption}</div>
                      <div className={styles.zoomIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                      </div>
                    </motion.div>
                  </GalleryItem>
                );
              })}
            </div>
          </motion.div>
          )}
        </section>

      </div>
    </GalleryProvider>
  );
}