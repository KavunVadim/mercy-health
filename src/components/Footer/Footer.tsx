import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import styles from "./Footer.module.css";
import type { Locale } from "@/i18n-config";

export default function Footer({
  dictionary,
  lang,
}: {
  dictionary: any;
  lang: Locale;
}) {
  const footer = dictionary.footer;
  const socialLinks = footer.social_links;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.mainCol}>
          <Link href={`/${lang}`} className={styles.logo}>
            <Image
              src="/fond-emblem.svg"
              alt="Mercy & Health Logo"
              width={56}
              height={56}
              className={styles.logoMark}
            />
            <span className={styles.logoText}>
              MERCY <span className={styles.logoAmp}>&</span> HEALTH
            </span>
          </Link>
          <p className={styles.description}>
            {dictionary.hero.description}
          </p>
          <div className={styles.socials}>
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socLink} title="Facebook">
                <FaFacebookF size={18} />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socLink} title="Foundation Instagram">
                <FaInstagram size={18} />
              </a>
            )}
            {socialLinks.instagram_rehab && (
              <a href={socialLinks.instagram_rehab} target="_blank" rel="noopener noreferrer" className={styles.socLink} title="Rehab Instagram">
                <FaInstagram size={18} />
              </a>
            )}
            {socialLinks.tiktok && (
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className={styles.socLink} title="TikTok">
                <FaTiktok size={18} />
              </a>
            )}
            {socialLinks.telegram && (
              <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className={styles.socLink} title="Telegram">
                <FaTelegramPlane size={18} />
              </a>
            )}
          </div>
        </div>

        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>{dictionary.footer.columns.foundation}</h4>
          <ul className={styles.list}>
            <li><Link href={`/${lang}/about`}>{dictionary.navigation.about}</Link></li>
            <li><Link href={`/${lang}/team`}>{dictionary.navigation.team}</Link></li>
            <li><Link href={`/${lang}/contacts`}>{dictionary.navigation.contacts}</Link></li>
          </ul>
        </div>

        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>{dictionary.navigation.projects}</h4>
          <ul className={styles.list}>
            <li><Link href={`/${lang}/projects/rehab`}>{dictionary.navigation.rehab}</Link></li>
            <li><Link href={`/${lang}/projects/medics`}>{dictionary.navigation.medical_aid}</Link></li>
          </ul>
        </div>

        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>{dictionary.navigation.materials}</h4>
          <ul className={styles.list}>
            <li><Link href={`/${lang}/news`}>{dictionary.navigation.news || dictionary.navigation.materials}</Link></li>
            <li><Link href={`/${lang}/reports`}>{dictionary.navigation.reports}</Link></li>
          </ul>
        </div>

        <div className={styles.contactsCol}>
          <h4 className={styles.colTitle}>{dictionary.footer.columns.contacts}</h4>
          <ul className={styles.contactsList}>
            <li>
              <Phone size={16} />
              <a href={`tel:${dictionary.footer.foundation_phone}`}>{dictionary.footer.foundation_phone}</a>
            </li>
            <li>
              <Mail size={16} />
              <a href={`mailto:${dictionary.footer.foundation_email || "info@mercyandhealth.org"}`}>
                {dictionary.footer.foundation_email || "info@mercyandhealth.org"}
              </a>
            </li>
            <li>
              <MapPin size={16} />
              <span>{dictionary.footer.address_foundation}</span>
            </li>
          </ul>
          <Link href={`/${lang}/support`} className={styles.footerCta}>
            {dictionary.navigation.support}
          </Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p>{dictionary.footer.rights}</p>
            <div className={styles.legalLinks}>
              <Link href={`/${lang}/legal`}>{dictionary.footer.columns.legal}</Link>
              <Link href={`/${lang}/privacy`}>{dictionary.navigation.privacy}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
