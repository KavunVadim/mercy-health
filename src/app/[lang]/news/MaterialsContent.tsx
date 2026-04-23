"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs/Tabs";
import NewsTab from "./components/NewsTab";
import GalleryTab from "./components/GalleryTab";
import OthersTab from "./components/OthersTab";
import styles from "./page.module.css";

export default function MaterialsContent({ dictionary }: { dictionary: Record<string, unknown> }) {
  const [activeTab, setActiveTab] = useState("news");

  const tabs = [
    { id: "news", label: dictionary.news.tabs.news },
    { id: "gallery", label: dictionary.news.tabs.gallery },
    { id: "others", label: dictionary.news.tabs.others },
  ];

  return (
    <div className={styles.contentWrapper}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      <div className={styles.tabContent}>
        {activeTab === "news" && <NewsTab dictionary={dictionary} />}
        {activeTab === "gallery" && <GalleryTab dictionary={dictionary} />}
        {activeTab === "others" && <OthersTab dictionary={dictionary} />}
      </div>
    </div>
  );
}
