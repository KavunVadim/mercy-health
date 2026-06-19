export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import SupportContent from "./SupportContent";
import styles from "./page.module.css";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  return {
    title: `${dictionary.support.title} | ${dictionary.metadata.title}`,
    description: dictionary.support.description || dictionary.metadata.description,
    alternates: {
      canonical: siteUrl(`/${lang}/support`),
      languages: {
        uk: siteUrl("/uk/support"),
        en: siteUrl("/en/support"),
      },
    },
  };
}

export default async function SupportPage({
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
        { name: dictionary.support.title, url: siteUrl(`/${locale}/support`) },
      ]} />
      <header className={styles.header}>
        <div className="container">
          <Breadcrumbs lang={locale} dictionary={dictionary} className={styles.breadcrumbs} />
          <h1 className={styles.title}>{dictionary.support.title}</h1>
        </div>
      </header>

      <section className={styles.content}>
        <div className="container">
          <SupportContent dictionary={dictionary} />
        </div>
      </section>
    </main>
  );
}
