import { i18n } from "@/i18n-config";
import { getDb } from "@/lib/mongodb";
import { siteUrl } from "@/lib/config";
import { cache } from "react";

const staticRoutes = [
  "",
  "/about",
  "/news",
  "/projects",
  "/reports",
  "/support",
];

type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

// Кешуємо функцію отримання даних на 1 годину (3600 секунд)
const getDynamicRoutes = cache(async (): Promise<{ news: string[]; projects: string[] }> => {
  const newsIds: string[] = [];
  const projectIds: string[] = [];

  try {
    const db = await getDb();
    const newsDocs = await db.collection("news").find({}).project({ id: 1 }).toArray();
    for (const doc of newsDocs) {
      if (doc.id) newsIds.push(doc.id);
    }
  } catch (e) {
    console.error("Sitemap dynamic routes fetch error:", e);
  }

  try {
    const ukContent = await getDb().then(db => db.collection("content_uk").findOne({ key: "main" }));
    if (ukContent?.projects?.items) {
      for (const item of ukContent.projects.items) {
        if (item.id) projectIds.push(item.id);
      }
    }
  } catch (e) {
    console.error("Sitemap project content fetch error:", e);
  }

  return { news: newsIds, projects: projectIds };
});

export default async function sitemap(): Promise<SitemapEntry[]> {
  const { news, projects } = await getDynamicRoutes();

  const entries: SitemapEntry[] = [];

  for (const locale of i18n.locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: siteUrl(`/${locale}${route}`),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }

    for (const id of news) {
      entries.push({
        url: siteUrl(`/${locale}/news/${id}`),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const id of projects) {
      entries.push({
        url: siteUrl(`/${locale}/projects/${id}`),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
