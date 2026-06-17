export const dynamic = 'force-dynamic';

import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import { isLocale } from "@/i18n-config";
import { notFound } from "next/navigation";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import NewsCard from "@/components/NewsCard/NewsCard";
import HeroSlider from "@/components/HeroSlider/HeroSlider";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    notFound();
  }
  const locale = lang;
  const dictionary = await getDictionary(locale);

  return (
    <div className={styles.page}>
      <main className={`${styles.main} home-main`}>
        <HeroSlider slides={dictionary.hero_slider} />

        <section className={styles.projectsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{dictionary.projects.title}</h2>
              <Link href={`/${locale}/projects`} className={styles.viewAll}>
                {dictionary.projects.more}
              </Link>
            </div>
            <div className={styles.projectGrid}>
              {dictionary.projects.items.slice(0, 4).map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.short_description || project.description || ""}
                    image={project.image}
                    id={project.id}
                    dictionary={dictionary}
                    lang={locale}
                  />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{dictionary.stats.projects_value}</span>
                <span className={styles.statLabel}>{dictionary.stats.items.projects}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{dictionary.stats.roads_value}</span>
                <span className={styles.statLabel}>{dictionary.stats.items.roads}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{dictionary.stats.aid_value}</span>
                <span className={styles.statLabel}>{dictionary.stats.items.aid}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.newsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{dictionary.news.title}</h2>
              <Link href={`/${locale}/news`} className={styles.viewAll}>
                {dictionary.news.more}
              </Link>
            </div>
            <div className={styles.newsGrid}>
              {dictionary.news.items.slice(0, 4).map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  date={item.date}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  lang={locale}
                />
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
