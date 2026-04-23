import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import styles from "./page.module.css";
import MaterialsContent from "./MaterialsContent";

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
      <section className={`container ${styles.section}`}>
        <MaterialsContent dictionary={dictionary} />
      </section>
    </main>
  );
}
