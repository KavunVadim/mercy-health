const UKRAINIAN_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
  ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "i", к: "k", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ю: "yu", я: "ya",
};

export function arrToText(arr: string[] | string | undefined): string {
  if (Array.isArray(arr)) return arr.join('\n');
  return arr || '';
}

export function textToArr(text: string): string[] {
  if (!text) return [];
  if (text.includes('<')) {
    const blocks = text.match(/<p>[\s\S]*?<\/p>|<h[23]>[\s\S]*?<\/h[23]>|<blockquote>[\s\S]*?<\/blockquote>|<ul>[\s\S]*?<\/ul>|<ol>[\s\S]*?<\/ol>|<li>[\s\S]*?<\/li>|<pre>[\s\S]*?<\/pre>/g);
    if (blocks) return blocks.map(b => b.trim()).filter(Boolean);
    return [text];
  }
  return text.split('\n').filter(s => s.trim());
}

export function slugify(text: string, fallback = "item"): string {
  let result = text.toLowerCase().trim();
  result = result.replace(/[ьъ]/g, "");
  result = result.replace(/[а-яґєіїюя]/g, (ch) => UKRAINIAN_MAP[ch] || ch);
  result = result.replace(/[^a-z0-9]+/g, "-");
  result = result.replace(/^-+|-+$/g, "");
  return result || fallback;
}
