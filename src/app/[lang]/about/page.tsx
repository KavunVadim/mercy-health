import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import AboutContent from "./AboutContent";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <Breadcrumbs lang={locale} dictionary={dictionary} className={styles.breadcrumbs} />
          <h1 className={styles.title}>{dictionary.about.title}</h1>
        </div>
      </header>
      <section className={`container ${styles.section}`}>
        <AboutContent dictionary={dictionary} />
      </section>
    </main>
  );
}
