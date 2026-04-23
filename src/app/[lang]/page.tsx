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
      <main className={styles.main}>
        <HeroSlider slides={(dictionary as any).hero_slider} />

        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>12.4M ₴</span>
                <span className={styles.statLabel}>{(dictionary as any).stats.items.collected}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>15.2K</span>
                <span className={styles.statLabel}>{(dictionary as any).stats.items.helped}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>8.3K</span>
                <span className={styles.statLabel}>{(dictionary as any).stats.items.donors}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.projectsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{(dictionary as any).projects.title}</h2>
              <Link href={`/${locale}/projects`} className={styles.viewAll}>
                {(dictionary as any).projects.more}
              </Link>
            </div>
            <div className={styles.projectGrid}>
              {((dictionary as any).projects.items as unknown[]).slice(0, 6).map((project: unknown) => (
                  <ProjectCard
                    key={(project as any).id}
                    title={(project as any).title}
                    description={(project as any).description}
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

        <section className={styles.newsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{(dictionary as any).news.title}</h2>
              <Link href={`/${locale}/news`} className={styles.viewAll}>
                {(dictionary as any).news.more}
              </Link>
            </div>
            <div className={styles.newsGrid}>
              {((dictionary as any).news.items as unknown[]).slice(0, 3).map((item: unknown) => (
                <NewsCard
                  key={(item as any).id}
                  id={(item as any).id}
                  date={(item as any).date}
                  title={(item as any).title}
                  image={(item as any).image}
                  lang={locale}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.newsletterSection}>
          <div className="container">
            <div className={styles.newsletterContainer}>
              <div className={styles.newsletterInfo}>
                <h2 className={styles.newsletterTitle}>Будьте в курсі</h2>
                <p>Підпишіться на нашу розсилку, щоб отримувати новини про проекти та звіти.</p>
              </div>
              <form className={styles.newsletterForm}>
                <input type="email" placeholder="E-mail" className={styles.newsletterInput} />
                <button type="submit" className={styles.newsletterBtn}>Підписатися</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
