import "server-only";
import { cache } from "react";
import type { Locale } from "./i18n-config";
import type { Dictionary } from "./types/content";
import { getDb } from "@/lib/mongodb";

const MAX_LIST_ITEMS = 200;


function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

const LOCALE_KEYS = new Set(["uk", "en"]);

function isLocalizedField(data: Record<string, unknown>): boolean {
  for (const key of LOCALE_KEYS) {
    if (!(key in data)) return false;
    const val = data[key];
    if (val === null || val === undefined) return false;
    if (typeof val === "object" && !Array.isArray(val)) return false;
  }
  const nonLocaleKeys = Object.keys(data).filter(k => !LOCALE_KEYS.has(k));
  return nonLocaleKeys.length === 0;
}

function localizeData(data: unknown, locale: string): unknown {
  if (Array.isArray(data)) {
    return data.map(item => localizeData(item, locale));
  } else if (isRecord(data)) {
    if (isLocalizedField(data)) {
      return data[locale] ?? data[locale as keyof typeof data];
    }
    const localized: Record<string, unknown> = {};
    for (const key in data) {
      localized[key] = localizeData(data[key], locale);
    }
    return localized;
  }
  return data;
}

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  uk: () => import("./dictionaries/uk.json").then((module) => module.default),
};

function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T {
  const output: Record<string, unknown> = { ...target };
  if (isRecord(source)) {
    Object.keys(source).forEach(key => {
      if (isRecord(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(
            isRecord(target[key]) ? target[key] : {},
            source[key],
          );
        }
      } else if (Array.isArray(source[key]) && source[key].length === 0) {
        // Skip empty arrays — preserve the JSON default
      } else if (source[key] !== '' && source[key] !== null && source[key] !== undefined) {
        output[key] = source[key];
      }
    });
  }
  return output as T;
}

function parseDateStr(str: string): Date {
  if (!str) return new Date(0);
  const parts = str.split('.');
  if (parts.length === 3) return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  return new Date(str);
}

async function fetchMongoData(locale: Locale) {
    const db = await getDb();

    const contentCol = locale === "uk" ? "content_uk" : "content_en";
    const ukContentCol = "content_uk";
    const [contentDoc, ukContentDoc, newsDocs, projectsDocs, partnersDocs, memorandumsDocs, reportsDocs, settingsDoc, galleryPhotos] = await Promise.all([
      db.collection(contentCol).findOne({ key: "main" }),
      db.collection(ukContentCol).findOne({ key: "main" }),
      db.collection("news").find({}).sort({ order: -1, createdAt: -1 }).limit(MAX_LIST_ITEMS).toArray(),
      db.collection("projects").find({}).sort({ order: -1, createdAt: -1 }).limit(MAX_LIST_ITEMS).toArray(),
      db.collection("partners").find({}).sort({ order: -1, createdAt: -1 }).limit(MAX_LIST_ITEMS).toArray(),
      db.collection("memorandums").find({}).sort({ order: -1, createdAt: -1 }).limit(MAX_LIST_ITEMS).toArray(),
      db.collection("reports").find({}).sort({ order: -1, createdAt: -1 }).limit(MAX_LIST_ITEMS).toArray(),
      db.collection("settings").findOne({ key: "main" }),
      db.collection("photos").find({ inGallery: true, visible: { $ne: false } }).sort({ order: -1, createdAt: -1 }).limit(MAX_LIST_ITEMS).toArray(),
    ]);

    if (locale === "en" && ukContentDoc && contentDoc) {
      const ukCards = (ukContentDoc as any).support?.cards?.items as Record<string, unknown>[] | undefined;
      const enCards = (contentDoc as any).support?.cards?.items as Record<string, unknown>[] | undefined;
      if (ukCards && enCards) {
        const mergedCards = enCards.map((card, i) => {
          const ukCard = ukCards[i];
          if (!ukCard) return card;
          return {
            ...card,
            image: card.image || ukCard.image || '',
            bank: card.bank || ukCard.bank || '',
            link: card.link || ukCard.link || '',
          };
        });
        (contentDoc as any).support.cards.items = mergedCards;
      }
    }

    const contentData: Record<string, unknown> = {};
    if (contentDoc) {
      for (const [k, v] of Object.entries(contentDoc)) {
        if (k !== "_id" && k !== "key" && k !== "updatedAt") contentData[k] = v;
      }
    }

    function stripMongo(docs: unknown[]): Record<string, unknown>[] {
      return docs.map((d) => {
        if (d && typeof d === "object" && !Array.isArray(d)) {
          const { _id, createdAt, updatedAt, ...rest } = d as Record<string, unknown>;
          return rest;
        }
        return {};
      });
    }

    function stripMongoOne(doc: Record<string, unknown> | null): Record<string, unknown> {
      if (doc && typeof doc === "object") {
        const { _id, key, updatedAt, createdAt, ...rest } = doc;
        return rest;
      }
      return {};
    }

    const localizedProjects = localizeData(stripMongo(projectsDocs || []), locale);
    const localizedPartners = localizeData(stripMongo(partnersDocs || []), locale);
    const localizedMemorandums = localizeData(stripMongo(memorandumsDocs || []), locale);
    const localizedNews = (localizeData(stripMongo(newsDocs || []), locale) as Record<string, unknown>[]).sort((a, b) => {
      const da = parseDateStr(a.date as string);
      const db = parseDateStr(b.date as string);
      return db.getTime() - da.getTime();
    });
    const localizedReports = localizeData(stripMongo(reportsDocs || []), locale) as Record<string, unknown>[];
    const localizedSettings = settingsDoc ? localizeData(stripMongoOne(settingsDoc), locale) as Record<string, unknown> : {};

    const newsGalleryImages = (galleryPhotos || []).map((p) => (p as unknown as { url: string }).url);

    return { contentData, localizedProjects, localizedPartners, localizedMemorandums, localizedNews, localizedReports, localizedSettings, newsGalleryImages };
}

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const baseDictionary = await (dictionaries[locale]?.() ?? dictionaries.uk());

  const { contentData, localizedProjects, localizedPartners, localizedMemorandums, localizedNews, localizedReports, localizedSettings, newsGalleryImages } = await fetchMongoData(locale);

  const mergedDictionary = contentData
    ? deepMerge(baseDictionary, contentData)
    : baseDictionary;

  const finalDictionary = localizedSettings
    ? deepMerge(mergedDictionary, localizedSettings)
    : mergedDictionary;

  const reportsData = { reports: localizedReports };

  return {
    ...finalDictionary,
    hero_slider: contentData.hero_slider || [],
    projects: {
      ...(finalDictionary.projects || {}),
      items: localizedProjects || [],
    },
    news: {
      ...(finalDictionary.news || {}),
      items: localizedNews || [],
      gallery: {
        ...((finalDictionary.news as Record<string, unknown>)?.gallery as Record<string, unknown> || {}),
        images: newsGalleryImages,
      },
    },
    partners: localizedPartners || [],
    memorandums: localizedMemorandums || [],
    reports: {
      ...(finalDictionary.reports || {}),
      ...(reportsData || {}),
    },
  } as unknown as Dictionary;
});
