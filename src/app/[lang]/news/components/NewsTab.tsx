"use client";

import NewsCard from "@/components/NewsCard/NewsCard";
import type { Locale } from "@/i18n-config";
import styles from "./Tabs.module.css";

export default function NewsTab({ dictionary, lang }: { dictionary: any, lang: string }) {
  const dict = dictionary as any;
  const items = dict.news.items;

  return (
    <div className={styles.grid}>
      {items.map((item: any) => (
        <NewsCard
          key={item.id}
          id={item.id}
          date={item.date}
          title={item.title}
          description={item.description}
          image={item.image}
          lang={lang as Locale}
        />
      ))}
    </div>
  );
}
