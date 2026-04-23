"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";

type Project = {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  image: string;
  collected: number;
  goal?: number;
  unit: string;
};

interface AnimatedProjectsProps {
  projects: Project[];
  dictionary: any;
  lang: string;
}

export default function AnimatedProjects({ projects, dictionary, lang }: AnimatedProjectsProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    }
  };

  return (
    <motion.div 
      className={styles.grid}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {projects.map((project: Project) => {
        const progress = project.goal ? Math.min((project.collected / project.goal) * 100, 100) : 0;
        
        return (
          <motion.div key={project.id} variants={item}>
            <Link 
              href={`/${lang}/projects/${project.id}`} 
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className={styles.image}
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.description}>{project.short_description || project.description}</p>
                
                {project.goal && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span>{dictionary.projects.collected}: {project.collected.toLocaleString()} {project.unit}</span>
                      <span>{dictionary.projects.goal}: {project.goal.toLocaleString()} {project.unit}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <span className={styles.cta}>{dictionary.projects.details} &rarr;</span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
