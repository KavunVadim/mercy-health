"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "@/i18n-config";
import styles from "./LocaleSwitcher.module.css";

export default function LocaleSwitcher() {
  const pathname = usePathname();

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className={styles.switcher}>
      {i18n.locales.map((locale) => {
        const isActive = pathname?.split("/")[1] === locale;
        return (
          <Link
            key={locale}
            href={redirectedPathname(locale)}
            className={`${styles.link} ${isActive ? styles.active : ""}`}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
