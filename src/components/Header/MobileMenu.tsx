"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import styles from "./MobileMenu.module.css";
import type { Locale } from "@/i18n-config";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";

export default function MobileMenu({
  dictionary,
  lang,
  supportLabel,
}: {
  dictionary: any;
  lang: Locale;
  supportLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { icon: FaTiktok, href: dictionary.footer.social_links.tiktok },
    { icon: FaTelegramPlane, href: dictionary.footer.social_links.telegram },
  ];

  return (
    <div className={styles.wrap}>
      <button className={styles.burger} onClick={toggle} aria-label="Open menu">
        <Menu size={28} />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <motion.nav
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.topBar}>
                <Link href={`/${lang}`} className={styles.logo} onClick={close}>
                  <Image
                    src="/fond-emblem.svg"
                    alt="Logo"
                    width={32}
                    height={32}
                  />
                  <span className={styles.logoText}>MERCY & HEALTH</span>
                </Link>
                <button className={styles.closeBtn} onClick={close} aria-label="Close menu">
                  <X size={28} />
                </button>
              </div>

              <div className={styles.content}>
                <div className={styles.navLinks}>
                  {navItems.map((item, idx) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link href={item.href} className={styles.link} onClick={close}>
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={styles.ctaWrapper}
                  >
                    <Link href={`/${lang}/support`} className={styles.cta} onClick={close}>
                      {supportLabel}
                    </Link>
                  </motion.div>
                </div>

                <div className={styles.contacts}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <a href={`tel:${dictionary.footer.foundation_phone}`} className={styles.contactLink}>
                      <Phone size={20} />
                      <span>{dictionary.footer.foundation_phone}</span>
                    </a>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <a href={`mailto:${dictionary.footer.foundation_email}`} className={styles.contactLink}>
                      <Mail size={20} />
                      <span>{dictionary.footer.foundation_email}</span>
                    </a>
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
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
