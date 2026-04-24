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
  unit?: string;
  dictionary: any;
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
  unit,
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
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className={styles.progressFooter}>
              <div className={styles.progressLabelCol}>
                <span className={styles.progressLabel}>{(dictionary as any).projects.collected}</span>
                <span className={styles.collectedValue}>
                  {collNum.toLocaleString(numberLocale)} {unit || '₴'}
                </span>
              </div>
              <div className={styles.progressLabelCol} style={{ textAlign: 'right' }}>
                <span className={styles.progressLabel}>{(dictionary as any).projects.goal}</span>
                <span className={styles.goalValue}>
                  {goalNum.toLocaleString(numberLocale)} {unit || '₴'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.supportBtn}>
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ marginRight: '8px' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {dictionary.projects.support}
          </div>
        </div>
      </article>
    </Link>
  );
}
