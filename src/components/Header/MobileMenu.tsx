"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import styles from "./MobileMenu.module.css";
import type { Locale } from "@/i18n-config";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";

export default function MobileMenu({
  dictionary,
  lang,
  supportLabel,
}: {
  dictionary: { navigation: Record<string, string> };
  lang: Locale;
  supportLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const drawerId = useId();

  const menuHint =
    lang === "uk"
      ? open
        ? "Закрити меню"
        : "Відкрити меню"
      : open
        ? "Close menu"
        : "Open menu";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.burger}
        aria-expanded={open}
        aria-controls={drawerId}
        aria-haspopup="true"
        aria-labelledby={labelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.srOnly} id={labelId}>
          {menuHint}
        </span>
        <span className={styles.burgerLines} data-open={open}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {open ? (
        <div
          className={styles.backdrop}
          aria-hidden
          onClick={close}
        />
      ) : null}

      <nav
        id={drawerId}
        className={styles.drawer}
        data-open={open}
        aria-label={lang === "uk" ? "Мобільна навігація" : "Mobile navigation"}
        aria-hidden={!open}
        inert={open ? undefined : true}
      >
        <div className={styles.drawerInner}>
          <div className={styles.localeBlock}>
            <LocaleSwitcher />
          </div>
          <Link href={`/${lang}/about`} className={styles.drawerLink} onClick={close}>
            {dictionary.navigation.about}
          </Link>
          <Link href={`/${lang}/projects`} className={styles.drawerLink} onClick={close}>
            {dictionary.navigation.projects}
          </Link>
          <Link href={`/${lang}/reports`} className={styles.drawerLink} onClick={close}>
            {dictionary.navigation.reports}
          </Link>
          <Link
            href={`/${lang}/support`}
            className={styles.drawerCta}
            onClick={close}
          >
            {supportLabel}
          </Link>
        </div>
      </nav>
    </div>
  );
}
