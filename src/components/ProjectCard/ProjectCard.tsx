import Image from "next/image";
import styles from "./ProjectCard.module.css";
import type { Locale } from "@/i18n-config";

interface ProjectProps {
  title: string;
  description: string;
  image: string;
  collected: number;
  goal: number;
  category?: string;
  status?: string;
  dictionary: any;
  lang: Locale;
}

export default function ProjectCard({
  title,
  description,
  image,
  collected,
  goal,
  category,
  status,
  dictionary,
  lang,
}: ProjectProps) {
  const progress = Math.min(Math.round((collected / goal) * 100), 100);
  const numberLocale = lang === "uk" ? "uk-UA" : "en-US";
  const hasMeta = Boolean(category || status);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={title} fill className={styles.image} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className={styles.imageGradient} aria-hidden />
      </div>
      <div className={styles.content}>
        {hasMeta ? (
          <div className={styles.meta}>
            {category ? <span className={styles.metaTag}>{category}</span> : null}
            {status ? <span className={styles.metaTagMuted}>{status}</span> : null}
          </div>
        ) : null}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <span>{dictionary.projects.collected}</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={styles.progressFooter}>
            <span className={styles.collectedValue}>
              {collected.toLocaleString(numberLocale)} ₴
            </span>
            <span className={styles.goalValue}>
              / {goal.toLocaleString(numberLocale)} ₴
            </span>
          </div>
        </div>

        <button type="button" className={styles.supportBtn}>
          {dictionary.navigation.support}
        </button>
      </div>
    </article>
  );
}
