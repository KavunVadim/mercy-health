import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import NewsCard from "@/components/NewsCard/NewsCard";
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
        <section className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.heroBadge}>#MercyAndHealth</span>
            <h1>{dictionary.hero.title}</h1>
            <p>{dictionary.hero.description}</p>
            <div className={styles.heroActions}>
              <button className={styles.cta}>{dictionary.hero.cta}</button>
              <button className={styles.secondaryCta}>{dictionary.navigation.projects}</button>
            </div>
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className={`container ${styles.statsGrid}`}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>12.4M ₴</span>
              <span className={styles.statLabel}>{dictionary.stats.items.collected}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>15.2K</span>
              <span className={styles.statLabel}>{dictionary.stats.items.helped}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>8.3K</span>
              <span className={styles.statLabel}>{dictionary.stats.items.donors}</span>
            </div>
          </div>
        </section>

        <section className={`container ${styles.projectsSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{dictionary.navigation.projects}</h2>
            <Link href={`/${locale}/projects`} className={styles.viewAll}>
              {dictionary.news.more}
            </Link>
          </div>
          <div className={styles.projectGrid}>
            {dictionary.projects.items.map((project: any) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                collected={project.collected}
                goal={project.goal}
                dictionary={dictionary}
                lang={locale}
              />
            ))}
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
              {dictionary.news.items.map((item: any) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  date={item.date}
                  title={item.title}
                  image={item.image}
                  lang={locale}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.newsletterSection}>
          <div className={`container ${styles.newsletterContainer}`}>
            <div className={styles.newsletterInfo}>
              <h2 className={styles.newsletterTitle}>Будьте в курсі</h2>
              <p>Підпишіться на нашу розсилку, щоб отримувати новини про проекти та звіти.</p>
            </div>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="E-mail" className={styles.newsletterInput} />
              <button type="submit" className={styles.newsletterBtn}>Підписатися</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
