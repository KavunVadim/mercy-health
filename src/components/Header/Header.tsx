"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import styles from "./Header.module.css";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import MobileMenu from "./MobileMenu";
import type { Locale } from "@/i18n-config";
import clsx from "clsx";

export default function Header({
  dictionary,
  lang,
}: {
  dictionary: any;
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
      label: dictionary.navigation.about,
    },
    {
      href: `/${lang}/projects`,
      label: dictionary.navigation.projects,
    },
    {
      href: `/${lang}/news`,
      label: dictionary.navigation.materials,
    },
    {
      href: `/${lang}/reports`,
      label: dictionary.navigation.reports,
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
            <ThemeToggle className={styles.themeToggleDesktop} />
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
