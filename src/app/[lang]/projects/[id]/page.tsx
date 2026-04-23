import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { ArrowLeft } from "lucide-react";
import ProjectImageGallery from "./components/ProjectImageGallery";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  const project = dictionary.projects.items.find((p: any) => p.id === id);

  if (!project) {
    notFound();
  }

  const progress = project.goal ? Math.min((project.collected / project.goal) * 100, 100) : 0;
  const fullDescription = (project as any).full_description || (project as any).short_description || (project as any).description || '';

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <Link href={`/${lang}/projects`} className={styles.backLink}>
            <ArrowLeft size={20} />
            {dictionary.navigation.projects}
          </Link>
          <h1 className={styles.title}>{project.title}</h1>
        </div>
      </header>

      <section className={`container ${styles.section}`}>
        <div className={styles.grid}>
          <ProjectImageGallery 
            mainImage={project.image} 
            title={project.title} 
            gallery={project.gallery || []} 
            description={fullDescription}
          />

          <div className={styles.sidebarCol}>
            <div className={styles.statsCard}>
              <h3 className={styles.statsTitle}>Статус збору</h3>
              
              {project.goal ? (
                <>
                  <div className={styles.progressHeader}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Зібрано</span>
                      <span className={styles.statValue}>{project.collected.toLocaleString()} {project.unit}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Ціль</span>
                      <span className={styles.statValue}>{project.goal.toLocaleString()} {project.unit}</span>
                    </div>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </>
              ) : (
                <p className={styles.completedText}>Проєкт успішно завершено та реалізовано!</p>
              )}

              <Link href={`/${lang}/support`} className={styles.donateBtn}>
                Підтримати проєкт
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
