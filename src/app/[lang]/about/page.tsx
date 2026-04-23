import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import AboutContent from "./AboutContent";

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
      <section className={`container ${styles.section}`}>
        <AboutContent dictionary={dictionary} />
      </section>
    </main>
  );
}
