import type { Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeScript from "@/components/ThemeScript";
import { ThemeProvider } from "@/components/ThemeProvider";

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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
