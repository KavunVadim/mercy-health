import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "../globals.css";
import "../variables.css";
import { i18n, type Locale } from "@/i18n-config";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { getDictionary } from "@/get-dictionary";
import { ThemeProvider } from "@/components/ThemeProvider";

const eUkraine = localFont({
  src: [
    {
      path: "../../../public/fonts/e-Ukraine-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-Ukraine-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/e-Ukraine-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-e-ukraine",
});

const eUkraineHead = localFont({
  src: [
    {
      path: "../../../public/fonts/e-UkraineHead-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-e-ukraine-head",
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
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
    <html lang={locale} className={`${eUkraineHead.variable} ${eUkraine.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="theme-strategy"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (!theme) theme = 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <ScrollToTop />
          <Header dictionary={dictionary} lang={locale} />
          <div className="layout-wrapper">
            {children}
          </div>
          <Footer dictionary={dictionary} lang={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
