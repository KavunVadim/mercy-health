"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import styles from "./Header.module.css";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";
import MobileMenu from "./MobileMenu";
import type { Locale } from "@/i18n-config";
import clsx from "clsx";

export default function Header({
  dictionary,
  lang,
}: {
  dictionary: Record<string, unknown>;
  lang: Locale;
}) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  const navItems = [
    {
      href: `/${lang}/about`,
      label: lang === "uk" ? "Про Фонд" : "About Foundation",
    },
    {
      href: `/${lang}/projects`,
      label: lang === "uk" ? "Проекти" : "Projects",
    },
    {
      href: `/${lang}/news`,
      label: lang === "uk" ? "Матеріали" : "Materials",
    },
    {
      href: `/${lang}/reports`,
      label: lang === "uk" ? "Звітність" : "Reporting",
    },
  ];

  return (
    <motion.header
      className={clsx(styles.header, hidden && styles.hidden, scrolled && styles.scrolled)}
      initial={false}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className={`container ${styles.container}`}>
        <Link href={`/${lang}`} className={styles.logo}>
          <Image
            src="/fond-emblem.svg"
            alt="Mercy & Health Logo"
            width={48}
            height={48}
            className={styles.logoMark}
            priority
          />
          <span className={styles.logoText}>
            MERCY <span className={styles.logoAmp}>&</span> HEALTH
          </span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.localeDesktop}>
            <LocaleSwitcher />
          </div>
          <Link href={`/${lang}/support`} className={styles.supportBtn}>
            {dictionary.navigation.support}
          </Link>
          <MobileMenu
            dictionary={dictionary}
            lang={lang}
            supportLabel={dictionary.navigation.support}
          />
        </div>
      </div>
    </motion.header>
  );
}
