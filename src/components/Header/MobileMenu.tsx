"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaLinkedinIn } from "react-icons/fa";
import styles from "./MobileMenu.module.css";
import type { Locale } from "@/i18n-config";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";

export default function MobileMenu({
  dictionary,
  lang,
  supportLabel,
}: {
  dictionary: Record<string, unknown>;
  lang: Locale;
  supportLabel: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);

  const navItems = [
    { href: `/${lang}/about`, label: dictionary.navigation.about },
    { href: `/${lang}/projects`, label: dictionary.navigation.projects },
    { href: `/${lang}/news`, label: dictionary.navigation.news || (lang === "uk" ? "Матеріали" : "Materials") },
    { href: `/${lang}/reports`, label: dictionary.navigation.reports },
  ];

  const socials = [
    { icon: FaFacebookF, href: dictionary.footer.social_links.facebook },
    { icon: FaInstagram, href: dictionary.footer.social_links.instagram },
    { icon: FaTelegramPlane, href: dictionary.footer.social_links.telegram },
    { icon: FaLinkedinIn, href: dictionary.footer.social_links.linkedin },
  ];

  return (
    <div className={styles.wrap}>
      <button className={styles.burger} onClick={toggle} aria-label="Toggle menu">
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            className={styles.overlay}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.content}>
              <div className={styles.navLinks}>
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link href={item.href} className={styles.link} onClick={close}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={styles.ctaWrapper}
                >
                  <Link href={`/${lang}/support`} className={styles.cta} onClick={close}>
                    {supportLabel}
                  </Link>
                </motion.div>
              </div>

              <div className={styles.footer}>
                <div className={styles.langWrapper}>
                  <LocaleSwitcher />
                </div>
                <div className={styles.socials}>
                  {socials.map((soc, idx) => (
                    soc.href && (
                      <a key={idx} href={soc.href} target="_blank" rel="noopener noreferrer" className={styles.socLink}>
                        <soc.icon size={22} />
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
