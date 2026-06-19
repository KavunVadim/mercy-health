import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import styles from "./page.module.css";
import MaterialsContent from "./MaterialsContent";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/config";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  return {
    title: `${dictionary.news.title} | ${dictionary.metadata.title}`,
    description: dictionary.news.description || dictionary.metadata.description,
    alternates: {
      canonical: siteUrl(`/${lang}/news`),
      languages: {
        uk: siteUrl("/uk/news"),
        en: siteUrl("/en/news"),
      },
    },
  };
}

export default async function NewsPage({
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
        { name: dictionary.news.title, url: siteUrl(`/${locale}/news`) },
      ]} />
      <header className={styles.header}>
        <div className="container">
          <Breadcrumbs
            lang={locale}
            dictionary={dictionary}
            className={styles.breadcrumbs}
            items={[
              { label: dictionary.navigation.home, href: `/${locale}` },
              { label: dictionary.news.title }
            ]}
          />
          <h1 className={styles.title}>{dictionary.news.title}</h1>
        </div>
      </header>
      <section className={`container ${styles.section}`}>
        <MaterialsContent dictionary={dictionary} lang={locale} />
      </section>
    </main>
  );
}
