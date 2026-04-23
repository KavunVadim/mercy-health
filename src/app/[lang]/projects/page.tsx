import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

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
        <div className={styles.grid}>
          {dictionary.projects.items.map((project: any) => {
            const progress = project.goal ? Math.min((project.collected / project.goal) * 100, 100) : 0;
            
            return (
              <Link 
                href={`/${lang}/projects/${project.id}`} 
                key={project.id} 
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={styles.image}
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.description}>{project.short_description || project.description}</p>
                  
                  {project.goal && (
                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <span>{dictionary.projects.collected}: {project.collected.toLocaleString()} {project.unit}</span>
                        <span>{dictionary.projects.goal}: {project.goal.toLocaleString()} {project.unit}</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <span className={styles.cta}>{dictionary.projects.details} &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
