import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import ProjectImageGallery from "./components/ProjectImageGallery";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

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
              { label: project.title }
            ]}
          />
        </div>
      </header>

      <ProjectImageGallery
        mainImage={project.image}
        title={project.title}
        gallery={project.gallery || []}
        shortDescription={project.short_description || ''}
        fullDescription={fullDescription}
        supportHref={`/${lang}/support`}
        dictionary={dictionary}
      />
    </main>
  );
}
