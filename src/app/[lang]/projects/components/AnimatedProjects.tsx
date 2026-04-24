"use client";

import { motion, Variants } from "framer-motion";
import styles from "../page.module.css";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import type { Locale } from "@/i18n-config";

type Project = {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  image: string;
  collected: number;
  goal?: number;
  unit: string;
  category?: string;
  status?: string;
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
      {projects.map((project: Project) => (
        <motion.div key={project.id} variants={item}>
          <ProjectCard
            id={project.id}
            title={project.title}
            description={project.short_description || project.description}
            image={project.image}
            collected={project.collected}
            goal={project.goal || 0}
            category={project.category}
            status={project.status}
            dictionary={dictionary}
            lang={lang as Locale}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
