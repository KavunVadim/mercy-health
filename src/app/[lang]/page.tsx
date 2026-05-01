import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
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
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <div className={styles.page}>
      <main className={`${styles.main} home-main`}>
        <HeroSlider slides={(dictionary as any).hero_slider} />

        <section className={styles.projectsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{(dictionary as any).projects.title}</h2>
              <Link href={`/${locale}/projects`} className={styles.viewAll}>
                {(dictionary as any).projects.more}
              </Link>
            </div>
            <div className={styles.projectGrid}>
              {((dictionary as any).projects.items as unknown[]).slice(0, 4).map((project: unknown) => (
                  <ProjectCard
                    key={(project as any).id}
                    title={(project as any).title}
                    description={(project as any).short_description || (project as any).description}
                    image={(project as any).image}
                    collected={(project as any).collected}
                    goal={(project as any).goal}
                    id={(project as any).id}
                    dictionary={dictionary as any}
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
                <span className={styles.statValue}>{(dictionary as any).stats.collected_value}</span>
                <span className={styles.statLabel}>{(dictionary as any).stats.items.collected}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{(dictionary as any).stats.helped_value}</span>
                <span className={styles.statLabel}>{(dictionary as any).stats.items.helped}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{(dictionary as any).stats.donors_value}</span>
                <span className={styles.statLabel}>{(dictionary as any).stats.items.donors}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.newsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{(dictionary as any).news.title}</h2>
              <Link href={`/${locale}/news`} className={styles.viewAll}>
                {(dictionary as any).news.more}
              </Link>
            </div>
            <div className={styles.newsGrid}>
              {((dictionary as any).news.items as unknown[]).slice(0, 4).map((item: unknown) => (
                <NewsCard
                  key={(item as any).id}
                  id={(item as any).id}
                  date={(item as any).date}
                  title={(item as any).title}
                  description={(item as any).description}
                  image={(item as any).image}
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
