import path from "path";
import fs from "fs/promises";

const DATA_DIR = path.join(process.cwd(), "data");

const UKRAINIAN_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
  ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "i", к: "k", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ю: "yu", я: "ya",
};

export function slugify(text: string): string {
  let result = text.toLowerCase().trim();
  result = result.replace(/[ьъ]/g, "");
  result = result.replace(/[а-яґєіїюя]/g, (ch) => UKRAINIAN_MAP[ch] || ch);
  result = result.replace(/[^a-z0-9]+/g, "-");
  result = result.replace(/^-+|-+$/g, "");
  return result || "item";
}

// ─── News ──────────────────────────────────────────
interface NewsFile {
  news: Record<string, unknown>[];
  gallery: string[];
}

export async function readNews(): Promise<NewsFile> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "news.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return { news: [], gallery: [] };
  }
}

export async function writeNews(data: NewsFile): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, "news.json"),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

// ─── Projects ──────────────────────────────────────
interface ProjectsFile {
  projects: Record<string, unknown>[];
}

export async function readProjects(): Promise<ProjectsFile> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "projects.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return { projects: [] };
  }
}

export async function writeProjects(data: ProjectsFile): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, "projects.json"),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

// ─── Partners ──────────────────────────────────────
interface PartnersFile {
  partners: Record<string, unknown>[];
}

export async function readPartners(): Promise<PartnersFile> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "partners.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return { partners: [] };
  }
}

export async function writePartners(data: PartnersFile): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, "partners.json"),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

// ─── Reports ───────────────────────────────────────
interface ReportsFile {
  reports: Record<string, unknown>[];
}

export async function readReports(): Promise<ReportsFile> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "reports.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return { reports: [] };
  }
}

export async function writeReports(data: ReportsFile): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, "reports.json"),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

// ─── Settings ──────────────────────────────────────
export async function readSettings(): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "settings.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function writeSettings(data: Record<string, unknown>): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, "settings.json"),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

// ─── Content (localized uk/en) ─────────────────────
export async function readContent(locale: "uk" | "en"): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `content.${locale}.json`), "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function writeContent(locale: "uk" | "en", data: Record<string, unknown>): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, `content.${locale}.json`),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}
