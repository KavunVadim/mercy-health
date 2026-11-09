import Link from "next/link";
import { headers } from "next/headers";
import styles from "./NotFoundView.module.css";

const copy = {
  uk: {
    title: "Сторінку не знайдено",
    text: "Можливо, матеріал переїхав на іншу адресу або посилання застаріло. Спробуйте почати з головної.",
    primary: "На головну",
    primaryHref: "/uk",
    secondary: "Новини фонду",
    secondaryHref: "/uk/news",
  },
  en: {
    title: "Page not found",
    text: "The page may have moved or the link is out of date. Start again from the home page.",
    primary: "Go home",
    primaryHref: "/en",
    secondary: "Foundation news",
    secondaryHref: "/en/news",
  },
} as const;

/**
 * Локаль беремо із заголовка, який виставляє proxy.ts: not-found не отримує
 * params, а клієнтські хуки (useParams/usePathname) у цій межі непридатні —
 * Next мовчки відкочується на кореневий not-found.
 */
export default async function NotFoundView() {
  const requestHeaders = await headers();
  const lang = requestHeaders.get("x-mh-locale") === "en" ? "en" : "uk";
  const t = copy[lang];

  return (
    <main className={styles.wrap}>
      <div className={styles.inner}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.text}>{t.text}</p>
        <div className={styles.actions}>
          <Link href={t.primaryHref} className={styles.primary}>
            {t.primary}
          </Link>
          <Link href={t.secondaryHref} className={styles.secondary}>
            {t.secondary}
          </Link>
        </div>
      </div>
    </main>
  );
}
