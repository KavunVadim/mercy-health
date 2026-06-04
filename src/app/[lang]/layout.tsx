import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { i18n, isLocale } from "@/i18n-config";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { getDictionary } from "@/get-dictionary";
import Preloader from "@/components/Preloader/Preloader";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
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
      <Preloader />
      <ScrollToTop />
      <Header dictionary={dictionary} lang={lang} />
      <div className="layout-wrapper">
        {children}
      </div>
      <Footer dictionary={dictionary} lang={lang} />
    </>
  );
}
