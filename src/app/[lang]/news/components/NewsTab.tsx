"use client";

import Image from "next/image";
import styles from "./Tabs.module.css";

export default function NewsTab({ dictionary }: { dictionary: Record<string, unknown> }) {
  const dict = dictionary as any;
  const items = dict.news.items;

  return (
    <div className={styles.grid}>
      {items.map((item: unknown) => (
        <article key={(item as any).id} className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={(item as any).image}
              alt={(item as any).title}
              fill
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <time className={styles.date}>{(item as any).date}</time>
            <h3 className={styles.title}>{(item as any).title}</h3>
            {/* The user can add a detailed news page link here later */}
            <span className={styles.readMore}>Читати далі &rarr;</span>
          </div>
        </article>
      ))}
    </div>
  );
}
