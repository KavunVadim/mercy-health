import { i18n } from "@/i18n-config";
import { getDb } from "@/lib/mongodb";
import { siteUrl } from "@/lib/config";

/**
 * Sitemap мусить оновлюватись без redeploy — новини й проєкти додаються
 * через адмінку в MongoDB. Без revalidate Next.js віддає статичний знімок,
 * зроблений під час білда, і нові URL у нього ніколи не потрапляють.
 */
export const revalidate = 600;

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

type DynamicEntry = { id: string; lastModified?: Date };

function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function getCollectionEntries(
  collection: string,
  label: string,
): Promise<DynamicEntry[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection(collection)
      .find({})
      .project({ id: 1, updatedAt: 1, createdAt: 1 })
      .toArray();

    const seen = new Set<string>();
    const entries: DynamicEntry[] = [];

    for (const doc of docs) {
      const id = doc.id;
      if (typeof id !== "string" || !id || seen.has(id)) continue;
      seen.add(id);
      entries.push({ id, lastModified: toDate(doc.updatedAt) ?? toDate(doc.createdAt) });
    }

    return entries;
  } catch (e) {
    console.error(`Sitemap: не вдалося отримати ${label} з колекції "${collection}":`, e);
    return [];
  }
}

export default async function sitemap(): Promise<SitemapEntry[]> {
  // Проєкти живуть у власній колекції `projects`, а не в content_uk/content_en —
  // саме тому раніше жодна сторінка проєкту не потрапляла в sitemap.
  const [news, projects] = await Promise.all([
    getCollectionEntries("news", "новини"),
    getCollectionEntries("projects", "проєкти"),
  ]);

  const entries: SitemapEntry[] = [];

  for (const locale of i18n.locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: siteUrl(`/${locale}${route}`),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }

    for (const item of news) {
      entries.push({
        url: siteUrl(`/${locale}/news/${item.id}`),
        lastModified: item.lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const item of projects) {
      entries.push({
        url: siteUrl(`/${locale}/projects/${item.id}`),
        lastModified: item.lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
