import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import SupportContent from "./SupportContent";
import styles from "./page.module.css";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

export default async function SupportPage({
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
          <h1 className={styles.title}>{dictionary.support.title}</h1>
        </div>
      </header>

      <section className={styles.content}>
        <div className="container">
          <SupportContent dictionary={dictionary} />
        </div>
      </section>
    </main>
  );
}
