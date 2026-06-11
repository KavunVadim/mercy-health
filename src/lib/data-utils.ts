const UKRAINIAN_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
  ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "i", к: "k", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ю: "yu", я: "ya",
};

export function slugify(text: string, fallback = "item"): string {
  let result = text.toLowerCase().trim();
  result = result.replace(/[ьъ]/g, "");
  result = result.replace(/[а-яґєіїюя]/g, (ch) => UKRAINIAN_MAP[ch] || ch);
  result = result.replace(/[^a-z0-9]+/g, "-");
  result = result.replace(/^-+|-+$/g, "");
  return result || fallback;
}
