"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "@/components/Tabs/Tabs";
import AboutUs from "./components/AboutUs";
import Partners from "./components/Partners";
import Memorandums from "./components/Memorandums";
import Contacts from "./components/Contacts";
import styles from "./page.module.css";
import type { Dictionary } from "@/types/content";

export default function AboutContent({ dictionary }: { dictionary: Dictionary }) {
  const tabs = [
    { id: "about_us", label: dictionary.about.tabs.about_us },
    { id: "partners", label: dictionary.about.tabs.partners },
    { id: "contacts", label: dictionary.about.tabs.contacts },
  ];

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (tabs.some(t => t.id === hash)) return hash;
    }
    return "about_us";
  });

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
            {activeTab === "about_us" && <AboutUs dictionary={dictionary} />}
            {activeTab === "partners" && (
              <>
                <Partners dictionary={dictionary} />
                <Memorandums dictionary={dictionary} />
              </>
            )}
            {activeTab === "contacts" && <Contacts dictionary={dictionary} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
