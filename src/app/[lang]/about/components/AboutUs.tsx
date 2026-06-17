"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AboutUs.module.css";
import clsx from "clsx";
import type { Dictionary } from "@/types/content";
import AboutHero from "./AboutHero";
import HistoryGallery from "./HistoryGallery";
import WhoWeAreRedesign from "./WhoWeAreRedesign";
import MediaGrid from "@/components/MediaGrid/MediaGrid";

type AboutSectionId = "who_we_are" | "mission" | "media";

interface AboutSection {
  id: AboutSectionId;
  label: string;
}

export default function AboutUs({ dictionary }: { dictionary: Dictionary }) {
  const dict = dictionary;
  const [activeSection, setActiveSection] = useState("who_we_are");

  const sections: AboutSection[] = [
    { id: "who_we_are", label: dict.about.sidebar.who_we_are },
    { id: "mission", label: dict.about.sidebar.mission },
    { id: "media", label: dict.about.sidebar.media },
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={clsx(styles.sidebarBtn, activeSection === sec.id && styles.active)}
          >
            {sec.label}
          </button>
        ))}
      </aside>
      
      <div className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeSection === "who_we_are" && (
              <WhoWeAreRedesign dictionary={dictionary} />
            )}

            {activeSection === "mission" && (
              <div className={styles.sectionBlock}>
                <div className={styles.missionCard}>
                  <h2 className={styles.title}>{dict.about.mission.title}</h2>
                  <p className={styles.text}>{dict.about.mission.content}</p>
                </div>
              </div>
            )}

            {activeSection === "media" && (
              <div className={styles.sectionBlock}>
                <h2 className={styles.title}>{dict.about.media.title}</h2>
                {dict.about.media.content && <p className={styles.text}>{dict.about.media.content}</p>}
                {dict.about.media.links && dict.about.media.links.length > 0 ? (
                  <MediaGrid items={dict.about.media.links} />
                ) : (
                  <div className={styles.mediaPlaceholder}>
                    <p>{dict.news.no_articles}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
