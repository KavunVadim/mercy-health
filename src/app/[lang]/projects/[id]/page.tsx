export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import ProjectImageGallery from "./components/ProjectImageGallery";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/config";
import type { LinkItem } from "@/types/content";

interface Project {
  id: string;
  title: string;
  image: string;
  short_description?: string;
  full_description?: string;
  description?: string;
  gallery?: string[];
  links?: LinkItem[];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const project = (dictionary.projects.items as Project[]).find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.title} | ${dictionary.metadata.title}`,
    description: project.short_description || project.description || "",
    alternates: {
      canonical: siteUrl(`/${lang}/projects/${id}`),
      languages: {
        uk: siteUrl(`/uk/projects/${id}`),
        en: siteUrl(`/en/projects/${id}`),
      },
    },
    openGraph: {
      title: project.title,
      description: project.short_description || project.description || "",
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
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
      <BreadcrumbJsonLd items={[
        { name: dictionary.navigation.home, url: siteUrl(`/${lang}`) },
        { name: dictionary.navigation.projects, url: siteUrl(`/${lang}/projects`) },
        { name: project.title, url: siteUrl(`/${lang}/projects/${project.id}`) },
      ]} />
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
        projectUrl={`/${lang}/projects/${project.id}`}
        dictionary={dictionary}
        locale={locale}
        links={project.links}
      />
    </main>
  );
}
