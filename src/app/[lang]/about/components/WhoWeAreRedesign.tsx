"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
  const historyTitle = dictionary.about.history.title || "НАША ІСТОРІЯ";
  const pathOfMercyTitle = dictionary.about.sidebar.path_of_mercy || "ШЛЯХ МИЛОСЕРДЯ";
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

  const displayGallery = galleryImages.length > 0 ? galleryImages : [
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/1ab6c82fcb63943f.webp", caption: "Доставка допомоги" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/e59a9f52636d86e0.webp", caption: "Забезпечення водою" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/d8a6a79d7184b3f9.JPG", caption: "Реанімобіль" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/8ceeb51d684fcd4d.JPG", caption: "Медична евакуація" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/d677557cfe4838b8.webp", caption: "Допомога дітям" }
  ];

  return (
    <GalleryProvider>
      <div className={styles.wrapper}>
        {/* ───── Section 1: Hero Image ───── */}
        <section className={styles.heroSection}>
          <div className={styles.heroImageWrapper}>
            <GalleryItem src={heroImage}>
              <div className={styles.clickableWrapper}>
                <Image
                  src={heroImage}
                  alt={pathOfMercyTitle}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className={styles.heroImage}
                />
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                  <div className={styles.heroEyebrow}>
                    <span>{dictionary.about.sidebar.who_we_are}</span>
                    <div className={styles.heroDot} />
                  </div>
                  <h1
                    className={styles.heroTitle}
                    dangerouslySetInnerHTML={{
                      __html: pathOfMercyTitle
                        .toUpperCase()
                        .replace("МИЛОСЕРДЯ", `<span class="${styles.accentText}">МИЛОСЕРДЯ</span>`)
                        .replace("MERCY", `<span class="${styles.accentText}">MERCY</span>`),
                    }}
                  />
                </div>
                <div className={styles.heroZoomBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </div>
              </div>
            </GalleryItem>
          </div>
        </section>

        {/* ───── Section 2: Our Story ───── */}
        <section className={styles.storySection}>
          <motion.div {...fadeUp}>
            <h2 className={styles.storyTitle}>{historyTitle.toUpperCase()}</h2>
          </motion.div>
          <div className={styles.storyGrid}>
            <div className={styles.storyTextCol}>
              {historyParagraphs.slice(0, Math.ceil(historyParagraphs.length / 2)).map((p, i) => (
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
            <div className={styles.storyTextCol}>
              {historyParagraphs.slice(Math.ceil(historyParagraphs.length / 2)).map((p, i) => (
                <motion.p
                  key={i + Math.ceil(historyParagraphs.length / 2)}
                  {...staggerFadeUp(i + Math.ceil(historyParagraphs.length / 2))}
                  className={styles.storyPara}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Section 3: Patches of Honor ───── */}
        <section className={styles.honorSection}>
          <div className={styles.honorInner}>
            <motion.div
              className={styles.honorImageCol}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.patchFrame}>
                <GalleryItem src={patchesImage}>
                  <div className={styles.clickableWrapper}>
                    <Image
                      src={patchesImage}
                      alt="Стіна пошани"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.patchImage}
                    />
                    <div className={styles.patchFrameInner} />
                    <div className={styles.patchZoomBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                    </div>
                  </div>
                </GalleryItem>
              </div>
              <p className={styles.honorCaption}>Стіна подяк від наших захисників</p>
            </motion.div>

            <motion.div
              className={styles.honorTextCol}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <h2 className={styles.sectionTitle}>{historyTitle.toUpperCase()}</h2>
              <p className={styles.honorText}>{historyParagraphs[0]}</p>
            </motion.div>
          </div>
        </section>

        {/* ───── Section 4: Photo Gallery ───── */}
        <section className={styles.gallerySection}>
          <div className={styles.galleryHeader}>
            <h2 className={styles.galleryTitle}>{dictionary.about.gallery_title}</h2>
            <div className={styles.titleLine} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
                      transition={{ duration: 0.55, delay: (idx % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
                      <div className={styles.zoomIcon}>
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
        </section>
      </div>
    </GalleryProvider>
  );
}
