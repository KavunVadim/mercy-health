"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs/Tabs";
import NewsTab from "./components/NewsTab";
import GalleryTab from "./components/GalleryTab";
import OthersTab from "./components/OthersTab";
import styles from "./page.module.css";

export default function MaterialsContent({ dictionary, lang }: { dictionary: any, lang: string }) {
  const dict = dictionary as any;
  const [activeTab, setActiveTab] = useState("news");

  const tabs = [
    { id: "news", label: dict.news.tabs.news },
    { id: "gallery", label: dict.news.tabs.gallery },
    { id: "others", label: dict.news.tabs.others },
  ];

  return (
    <div className={styles.contentWrapper}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      <div className={styles.tabContent}>
        {activeTab === "news" && <NewsTab dictionary={dict} lang={lang} />}
        {activeTab === "gallery" && <GalleryTab dictionary={dict} />}
        {activeTab === "others" && <OthersTab dictionary={dict} />}
      </div>
    </div>
  );
}
