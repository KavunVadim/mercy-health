import Image from "next/image";
import Link from "next/link";
import styles from "./NewsCard.module.css";
import type { Locale } from "@/i18n-config";

interface NewsProps {
  id: string;
  date: string;
  title: string;
  image: string;
  description?: string;
  lang: Locale;
}
export default function NewsCard({ id, date, title, image, description, lang }: NewsProps) {
  return (
    <Link href={`/${lang}/news`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={title} fill className={styles.image} />
      </div>
      <div className={styles.content}>
        <span className={styles.date}>{date}</span>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </Link>
  );
}
