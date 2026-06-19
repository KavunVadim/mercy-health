export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import styles from "./page.module.css";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/config";
import AnimatedProjects from "./components/AnimatedProjects";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  return {
    title: `${dictionary.projects.title} | ${dictionary.metadata.title}`,
    description: dictionary.projects.description || dictionary.metadata.description,
    alternates: {
      canonical: siteUrl(`/${lang}/projects`),
      languages: {
        uk: siteUrl("/uk/projects"),
        en: siteUrl("/en/projects"),
      },
    },
  };
}

type Project = {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  image: string;
};

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
      <BreadcrumbJsonLd items={[
        { name: dictionary.navigation.home, url: siteUrl(`/${locale}`) },
        { name: dictionary.navigation.projects, url: siteUrl(`/${locale}/projects`) },
      ]} />
      <header className={styles.header}>
        <div className="container">
          <Breadcrumbs lang={locale} dictionary={dictionary} className={styles.breadcrumbs} />
          <h1 className={styles.title}>{dictionary.navigation.projects}</h1>
        </div>
      </header>

      <section className={`container ${styles.section}`}>
        <AnimatedProjects 
          projects={[...dictionary.projects.items] as Project[]} 
          dictionary={dictionary} 
          lang={lang} 
        />
      </section>
    </main>
  );
}
