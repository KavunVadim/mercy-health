import "server-only";
import type { Locale } from "./i18n-config";
import path from "path";
import fs from "fs/promises";

// Function to recursively localize object fields
function localizeData(data: any, locale: string): any {
  if (Array.isArray(data)) {
    return data.map(item => localizeData(item, locale));
  } else if (data !== null && typeof data === 'object') {
    // If the object has keys that match our locales (uk, en), it's a localized field
    if (data[locale] !== undefined) {
      return data[locale];
    }
    // Otherwise, recurse into its properties
    const localized: any = {};
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

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (source !== null && typeof source === 'object') {
    Object.keys(source).forEach(key => {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

export const getDictionary = async (locale: Locale) => {
  const baseDictionary = await (dictionaries[locale]?.() ?? dictionaries.uk());

  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    // 1. Load main content file (pre-localized)
    const contentPath = path.join(dataDir, `content.${locale}.json`);
    const contentData = JSON.parse(await fs.readFile(contentPath, 'utf8'));

    // 2. Load projects and localize them
    const projectsPath = path.join(dataDir, 'projects.json');
    const projectsRaw = JSON.parse(await fs.readFile(projectsPath, 'utf8'));
    const localizedProjects = localizeData(projectsRaw.projects || projectsRaw, locale);

    // 3. Load partners and localize them
    const partnersPath = path.join(dataDir, 'partners.json');
    let localizedPartners = [];
    try {
        const partnersRaw = JSON.parse(await fs.readFile(partnersPath, 'utf8'));
        localizedPartners = localizeData(partnersRaw.partners || partnersRaw, locale);
    } catch (e) {}

    // 4. Load news and localize them
    const newsPath = path.join(dataDir, 'news.json');
    let localizedNews = [];
    try {
        const newsRaw = JSON.parse(await fs.readFile(newsPath, 'utf8'));
        localizedNews = localizeData(newsRaw.news || newsRaw, locale);
    } catch (e) {}

    // 5. Load reports and localize them
    const reportsPath = path.join(dataDir, 'reports.json');
    let localizedReports = { summary: {}, history: [] };
    try {
        const reportsRaw = JSON.parse(await fs.readFile(reportsPath, 'utf8'));
        localizedReports = localizeData(reportsRaw, locale);
    } catch (e) {}

    // 6. Load settings and localize them
    const settingsPath = path.join(dataDir, 'settings.json');
    let localizedSettings = {};
    try {
        const settingsRaw = JSON.parse(await fs.readFile(settingsPath, 'utf8'));
        localizedSettings = localizeData(settingsRaw, locale);
    } catch (e) {}

    // Deep merge base translations with content data
    const mergedDictionary = deepMerge(baseDictionary, contentData);

    const finalDictionary = deepMerge(mergedDictionary, localizedSettings);

    // Override specific items that need custom localization or structure
    return {
      ...finalDictionary,
      projects: {
        ...finalDictionary.projects,
        items: localizedProjects
      },
      news: {
        ...finalDictionary.news,
        ...contentData.news, // Preserve potential data-specific news metadata
        items: localizedNews
      },
      partners: localizedPartners,
      reports: {
        ...finalDictionary.reports,
        ...localizedReports
      }
    };
  } catch (error) {
    console.warn(`Could not load all data files for locale ${locale}, falling back to dictionary.`, error);
    return baseDictionary;
  }
};
