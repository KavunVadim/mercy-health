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
  gallery?: string[];
  links?: { url: string; type?: 'video' | 'external'; label?: { uk: string; en: string } }[];
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
          <div className={styles.topActions}>
            <Breadcrumbs
              lang={locale}
              dictionary={dictionary}
              showBack={true}
              className={styles.breadcrumbs}
              items={[
                { label: dictionary.navigation.home, href: `/${lang}` },
                { label: dictionary.navigation.projects, href: `/${lang}/projects` },
                { label: project.title }
              ]}
            />
          </div>
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
        locale={locale}
        links={project.links}
      />
    </main>
  );
}
