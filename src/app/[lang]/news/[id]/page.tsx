import { getDictionary } from "@/get-dictionary";
import { i18n, type Locale } from "@/i18n-config";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import NewsDetailContent from "./components/NewsDetailContent";
import styles from "./page.module.css";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const locales = i18n.locales;
  const paths = [];
  
  const fs = require("fs/promises");
  const path = require("path");
  try {
    const newsPath = path.join(process.cwd(), "data", "news.json");
    const newsRaw = JSON.parse(await fs.readFile(newsPath, "utf8"));
    const newsItems = newsRaw.news || newsRaw;
    
    for (const locale of locales) {
      for (const item of newsItems) {
        paths.push({
          lang: locale,
          id: item.id,
        });
      }
    }
  } catch (e) {
    console.warn("Could not generate static paths for news details:", e);
  }
  
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!i18n.locales.includes(lang as any)) {
    return {};
  }
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const newsItem = dictionary.news.items.find((item: any) => item.id === id);
  
  if (!newsItem) {
    return {};
  }
  
  return {
    title: `${newsItem.title} | ${dictionary.metadata.title}`,
    description: newsItem.description,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  
  if (!i18n.locales.includes(lang as any)) {
    notFound();
  }
  
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const newsItem = dictionary.news.items.find((item: any) => item.id === id);
  
  if (!newsItem) {
    notFound();
  }

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
                { label: dictionary.navigation.home, href: `/${locale}` },
                { label: dictionary.navigation.materials, href: `/${locale}/news` },
                { label: newsItem.title }
              ]}
            />
          </div>
        </div>
      </header>

      <NewsDetailContent
        newsItem={newsItem}
        dictionary={dictionary}
        locale={locale}
      />
    </main>
  );
}
