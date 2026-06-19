export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  name: "Mercy & Health Foundation",
  logo: "/fond-emblem.png",
};

export function siteUrl(path?: string): string {
  const base = siteConfig.url.replace(/\/+$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
