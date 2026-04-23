import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectCard.module.css";
import type { Locale } from "@/i18n-config";

interface ProjectProps {
  id: string;
  title: string;
  description: string;
  image: string;
  collected: number | string;
  goal: number | string;
  category?: string;
  status?: string;
  dictionary: Record<string, unknown>;
  lang: Locale;
}

export default function ProjectCard({
  id,
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
  const collNum = typeof collected === "string" ? parseFloat(collected.replace(/[^0-9.]/g, "")) : collected;
  const goalNum = typeof goal === "string" ? parseFloat(goal.replace(/[^0-9.]/g, "")) : goal;
  
  const progress = goalNum ? Math.min(Math.round((collNum / goalNum) * 100), 100) : 0;
  const numberLocale = lang === "uk" ? "uk-UA" : "en-US";
  const hasMeta = Boolean(category || status);

  return (
    <Link href={`/${lang}/projects/${id}`} className={styles.cardLink}>
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
                {collNum.toLocaleString(numberLocale)} ₴
              </span>
              <span className={styles.goalValue}>
                / {goalNum.toLocaleString(numberLocale)} ₴
              </span>
            </div>
          </div>

          <div className={styles.supportBtn}>
            {dictionary.navigation.support}
          </div>
        </div>
      </article>
    </Link>
  );
}
