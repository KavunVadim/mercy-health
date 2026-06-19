import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { i18n, isLocale } from "@/i18n-config";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { getDictionary } from "@/get-dictionary";
import Preloader from "@/components/Preloader/Preloader";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dictionary = await getDictionary(lang);
  const url = siteUrl(`/${lang}`);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      canonical: url,
      languages: {
        uk: siteUrl("/uk"),
        en: siteUrl("/en"),
      },
    },
    openGraph: {
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      url,
      siteName: dictionary.common.site_name,
      locale: lang === "uk" ? "uk_UA" : "en_US",
      type: "website",
      images: [{ url: siteUrl("/opengraph-image"), width: 1200, height: 627 }],
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      images: [siteUrl("/opengraph-image")],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${lang}"`,
        }}
      />
      <OrganizationJsonLd />
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: "absolute",
          left: "-9999px",
          zIndex: 9999,
          padding: "0.5rem 1rem",
          background: "var(--accent, #000)",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "0 0 8px 0",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        Skip to content
      </a>
      <Preloader />
      <ScrollToTop />
      <Header dictionary={dictionary} lang={lang} />
      <div id="main-content" className="layout-wrapper">
        {children}
      </div>
      <Footer dictionary={dictionary} lang={lang} />
    </>
  );
}
