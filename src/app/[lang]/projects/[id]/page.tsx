import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { ArrowLeft } from "lucide-react";
import ProjectImageGallery from "./components/ProjectImageGallery";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ShareButtons from "./components/ShareButtons";

interface Project {
  id: string;
  title: string;
  image: string;
  short_description?: string;
  full_description?: string;
  description?: string;
  collected: number;
  goal?: number;
  unit: string;
  gallery?: string[];
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  const project = (dictionary.projects.items as Project[]).find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const progress = project.goal ? Math.min((project.collected / project.goal) * 100, 100) : 0;
  const fullDescription = project.full_description || project.short_description || project.description || '';

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <Breadcrumbs 
            lang={locale} 
            dictionary={dictionary} 
            className={styles.breadcrumbs} 
            items={[
              { label: dictionary.navigation.home, href: `/${lang}` },
              { label: dictionary.navigation.projects, href: `/${lang}/projects` },
              { label: project.title }
            ]}
          />
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
              <ShareButtons 
                title={project.title} 
                shareLabel="Поширити збір" 
              />
              
              <Link href={`/${lang}/support`} className={styles.donateBtn}>
                Підтримати проєкт
              </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
