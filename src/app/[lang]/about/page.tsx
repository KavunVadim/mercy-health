export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import AboutContent from "./AboutContent";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  return {
    title: `${dictionary.about.title} | ${dictionary.metadata.title}`,
    description: dictionary.about.description || dictionary.metadata.description,
    alternates: {
      canonical: siteUrl(`/${lang}/about`),
      languages: {
        uk: siteUrl("/uk/about"),
        en: siteUrl("/en/about"),
      },
    },
  };
}

export default async function AboutPage({
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
        { name: dictionary.about.title, url: siteUrl(`/${locale}/about`) },
      ]} />
      <header className={styles.header}>
        <div className="container">
          <Breadcrumbs lang={locale} dictionary={dictionary} className={styles.breadcrumbs} />
          <h1 className={styles.title}>{dictionary.about.title}</h1>
        </div>
      </header>
      <section className={`container ${styles.section}`}>
        <AboutContent dictionary={dictionary} />
      </section>
    </main>
  );
}
