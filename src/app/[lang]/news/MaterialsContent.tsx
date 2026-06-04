"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs/Tabs";
import NewsTab from "./components/NewsTab";
import GalleryTab from "./components/GalleryTab";
import styles from "./page.module.css";
import type { Dictionary } from "@/types/content";

export default function MaterialsContent({ dictionary, lang }: { dictionary: Dictionary, lang: string }) {
  const dict = dictionary;
  const [activeTab, setActiveTab] = useState("news");

  const tabs = [
    { id: "news", label: dict.news.tabs.news },
    { id: "gallery", label: dict.news.tabs.gallery },
  ];

  return (
    <div className={styles.contentWrapper}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      <div className={styles.tabContent}>
        {activeTab === "news" && <NewsTab dictionary={dict} lang={lang} />}
        {activeTab === "gallery" && <GalleryTab dictionary={dict} />}
      </div>
    </div>
  );
}
