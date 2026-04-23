import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import SupportContent from "./SupportContent";
import styles from "./page.module.css";

export default async function SupportPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>{dictionary.support.title}</h1>
          <p className={styles.description}>{dictionary.support.description}</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <SupportContent dictionary={dictionary} />
        </div>
      </section>
    </main>
  );
}
