import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import styles from "./page.module.css";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import AnimatedProjects from "./components/AnimatedProjects";

type Project = {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  image: string;
  collected: number;
  goal?: number;
  unit: string;
};

export default async function ProjectsPage({
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
          <h1 className={styles.title}>{dictionary.navigation.projects}</h1>
        </div>
      </header>

      <section className={`container ${styles.section}`}>
        <AnimatedProjects 
          projects={dictionary.projects.items as Project[]} 
          dictionary={dictionary} 
          lang={lang} 
        />
      </section>
    </main>
  );
}
