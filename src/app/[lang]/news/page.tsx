import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import styles from "./page.module.css";
import MaterialsContent from "./MaterialsContent";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

export default async function NewsPage({
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
          <h1 className={styles.title}>{dictionary.news.title}</h1>
        </div>
      </header>
      <section className={`container ${styles.section}`}>
        <MaterialsContent dictionary={dictionary} />
      </section>
    </main>
  );
}
