import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeScript from "@/components/ThemeScript";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { siteConfig } from "@/lib/config";

const eUkraine = localFont({
  src: [
    { path: "../../public/fonts/e-Ukraine-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/e-Ukraine-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/e-Ukraine-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-e-ukraine",
});

const eUkraineHead = localFont({
  src: [{ path: "../../public/fonts/e-UkraineHead-Bold.woff2", weight: "700", style: "normal" }],
  variable: "--font-e-ukraine-head",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/fond-emblem.png", sizes: "32x32", type: "image/png" },
      { url: "/fond-emblem.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: [{ url: "/fond-emblem.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${eUkraineHead.variable} ${eUkraine.variable}`} suppressHydrationWarning>
      <head />
      <body>
        <ThemeScript />
        <GoogleAnalytics />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
