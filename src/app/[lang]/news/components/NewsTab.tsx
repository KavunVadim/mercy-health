"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Tabs.module.css";

export default function NewsTab({ dictionary }: { dictionary: any }) {
  const items = dictionary.news.items;

  return (
    <div className={styles.grid}>
      {items.map((item: any) => (
        <article key={item.id} className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={item.image}
              alt={item.title}
              fill
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <time className={styles.date}>{item.date}</time>
            <h3 className={styles.title}>{item.title}</h3>
            {/* The user can add a detailed news page link here later */}
            <span className={styles.readMore}>Читати далі &rarr;</span>
          </div>
        </article>
      ))}
    </div>
  );
}
