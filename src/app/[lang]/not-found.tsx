import Link from "next/link";
import styles from "./not-found.module.css";

export default function LocaleNotFound() {
  return (
    <main className={styles.wrap}>
      <div className={styles.inner}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>
          Сторінку не знайдено
          <span className={styles.subtitle}>Page not found</span>
        </h1>
        <p className={styles.text}>
          Можливо, матеріал переїхав на іншу адресу або посилання застаріло.
          Спробуйте почати з головної.
        </p>
        <div className={styles.actions}>
          <Link href="/uk" className={styles.primary}>
            На головну
          </Link>
          <Link href="/en" className={styles.secondary}>
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
