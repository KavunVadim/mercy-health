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
