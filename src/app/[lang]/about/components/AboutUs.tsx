"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AboutUs.module.css";
import clsx from "clsx";

export default function AboutUs({ dictionary }: { dictionary: any }) {
  const [activeSection, setActiveSection] = useState("who_we_are");

  const sections = [
    { id: "who_we_are", label: dictionary.about.sidebar.who_we_are },
    { id: "mission", label: dictionary.about.sidebar.mission },
    { id: "media", label: dictionary.about.sidebar.media },
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
                <h2 className={styles.title}>{dictionary.about.history.title}</h2>
                <p className={styles.text}>{dictionary.about.history.content}</p>
                <div className={styles.imageWrapper}>
                  <Image 
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000" 
                    alt="Foundation history" 
                    fill 
                    className={styles.image}
                  />
                </div>
                
                <h3 className={styles.subtitle}>{dictionary.about.team.title}</h3>
                <div className={styles.teamGrid}>
                  {dictionary.about.team.members.map((member: any, index: number) => (
                    <div key={index} className={styles.teamMember}>
                      <div className={styles.memberAvatar}>
                        <span className={styles.avatarPlaceholder}>{member.name[0]}</span>
                      </div>
                      <h4 className={styles.memberName}>{member.name}</h4>
                      <p className={styles.memberRole}>{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "mission" && (
              <div className={styles.sectionBlock}>
                <div className={styles.missionCard}>
                  <h2 className={styles.title}>{dictionary.about.mission.title}</h2>
                  <p className={styles.text}>{dictionary.about.mission.content}</p>
                </div>
              </div>
            )}

            {activeSection === "media" && (
              <div className={styles.sectionBlock}>
                <h2 className={styles.title}>{dictionary.about.media.title}</h2>
                <p className={styles.text}>{dictionary.about.media.content}</p>
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
