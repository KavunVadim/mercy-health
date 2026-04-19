import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";
import MobileMenu from "./MobileMenu";
import type { Locale } from "@/i18n-config";

export default function Header({
  dictionary,
  lang,
}: {
  dictionary: any;
  lang: Locale;
}) {
  return (
    <header className={styles.header}>
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
          <Link href={`/${lang}/about`} className={styles.navLink}>
            {dictionary.navigation.about}
          </Link>
          <Link href={`/${lang}/projects`} className={styles.navLink}>
            {dictionary.navigation.projects}
          </Link>
          <Link href={`/${lang}/reports`} className={styles.navLink}>
            {dictionary.navigation.reports}
          </Link>
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
    </header>
  );
}
