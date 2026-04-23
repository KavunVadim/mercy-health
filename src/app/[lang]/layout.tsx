import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import "../variables.css";
import { i18n, type Locale } from "@/i18n-config";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getDictionary } from "@/get-dictionary";

const eUkraineHead = Outfit({
  subsets: ["latin"],
  variable: "--font-e-ukraine-head",
  weight: "700",
  display: "swap",
});

const eUkraine = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-e-ukraine",
  display: "swap",
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: "Mercy & Health | Милосердя та здоров'я",
  description: "Volunteer medical support foundation",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} className={`${eUkraineHead.variable} ${eUkraine.variable}`}>
      <body>
        <Header dictionary={dictionary} lang={locale} />
        <div className="layout-wrapper">
          {children}
        </div>
        <Footer dictionary={dictionary} lang={locale} />
      </body>
    </html>
  );
}
