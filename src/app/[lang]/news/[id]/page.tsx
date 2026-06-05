import { getDictionary } from "@/get-dictionary";
import { i18n, isLocale } from "@/i18n-config";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import NewsDetailContent from "./components/NewsDetailContent";
import styles from "./page.module.css";
import type { Metadata } from "next";
import type { NewsItem } from "@/types/content";
import { getDb } from "@/lib/mongodb";

export async function generateStaticParams() {
  const locales = i18n.locales;
  const paths = [];

  try {
    const db = await getDb();
    const newsDocs = await db.collection("news").find({}).project({ id: 1 }).toArray();

    for (const locale of locales) {
      for (const doc of newsDocs) {
        if (doc.id) {
          paths.push({ lang: locale, id: doc.id });
        }
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
  if (!isLocale(lang)) {
    return {};
  }
  const dictionary = await getDictionary(lang);
  const newsItem = dictionary.news.items.find((item: NewsItem) => item.id === id);
  
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
  
  if (!isLocale(lang)) {
    notFound();
  }
  
  const locale = lang;
  const dictionary = await getDictionary(locale);
  const newsItem = dictionary.news.items.find((item: NewsItem) => item.id === id);
  
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
