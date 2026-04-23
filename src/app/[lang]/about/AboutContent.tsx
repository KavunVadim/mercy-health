"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "@/components/Tabs/Tabs";
import AboutUs from "./components/AboutUs";
import Partners from "./components/Partners";
import Contacts from "./components/Contacts";
import styles from "./page.module.css";

export default function AboutContent({ dictionary }: { dictionary: Record<string, unknown> }) {
  const [activeTab, setActiveTab] = useState("about_us");

  const tabs = [
    { id: "about_us", label: (dictionary as any).about.tabs.about_us },
    { id: "partners", label: (dictionary as any).about.tabs.partners },
    { id: "contacts", label: (dictionary as any).about.tabs.contacts },
  ];

  return (
    <div className={styles.contentWrapper}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={styles.tabContent}
        >
            {activeTab === "about_us" && <AboutUs dictionary={dictionary as any} />}
            {activeTab === "partners" && <Partners dictionary={dictionary as any} />}
            {activeTab === "contacts" && <Contacts dictionary={dictionary as any} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
