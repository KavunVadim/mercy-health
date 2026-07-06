import { siteConfig, siteUrl } from "@/lib/config";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mercy & Health Foundation",
    alternateName: "Благодійний фонд Mercy & Health",
    url: siteConfig.url,
    logo: siteUrl(siteConfig.logo),
    description: "Благодійний фонд допомоги постраждалим від війни в Україні",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
    },
    sameAs: [
      "https://facebook.com/mercyhealthua",
      "https://instagram.com/mercy_health_ua",
      "https://t.me/mercyhealthua",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function NewsArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  url,
  author = "Mercy & Health Foundation",
}: {
  title: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  url: string;
  author?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description || undefined,
    image: image ? [image] : undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    url,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Mercy & Health Foundation",
      logo: {
        "@type": "ImageObject",
        url: siteUrl(siteConfig.logo),
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
