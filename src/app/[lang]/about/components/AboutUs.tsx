"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AboutUs.module.css";
import clsx from "clsx";

export default function AboutUs({ dictionary }: { dictionary: Record<string, unknown> }) {
  const dict = dictionary as any;
  const [activeSection, setActiveSection] = useState("who_we_are");

  const sections = [
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
              <div className={styles.sectionBlock}>
                <h2 className={styles.title}>{dict.about.history.title}</h2>
                <p className={styles.text}>{dict.about.history.content}</p>
                <div className={styles.imageWrapper}>
                  <Image 
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000" 
                    alt="Foundation history" 
                    fill 
                    className={styles.image}
                  />
                </div>
                
                <h3 className={styles.subtitle}>{dict.about.team.title}</h3>
                <div className={styles.teamGrid}>
                  {(dict.about.team.members as unknown[]).map((member: unknown, index: number) => (
                    <div key={index} className={styles.teamMember}>
                      <div className={styles.memberAvatar}>
                        <span className={styles.avatarPlaceholder}>{(member as any).name[0]}</span>
                      </div>
                      <h4 className={styles.memberName}>{(member as any).name}</h4>
                      <p className={styles.memberRole}>{(member as any).role}</p>
                    </div>
                  ))}
                </div>
              </div>
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
                <p className={styles.text}>{dict.about.media.content}</p>
                <div className={styles.mediaPlaceholder}>
                  <p>News articles will be listed here.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
