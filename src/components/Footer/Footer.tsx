import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";
import type { Locale } from "@/i18n-config";

export default function Footer({
  dictionary,
  lang,
}: {
  dictionary: any;
  lang: Locale;
}) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.column}>
          <Link href={`/${lang}`} className={styles.logo}>
            <Image
              src="/fond-emblem.svg"
              alt="Mercy & Health Logo"
              width={48}
              height={48}
              className={styles.logoMark}
            />
            <span className={styles.logoText}>
              MERCY <span className={styles.logoAmp}>&</span> HEALTH
            </span>
          </Link>
          <p className={styles.description}>
            {dictionary.hero.description}
          </p>
        </div>
        
        <div className={styles.column}>
          <h4 className={styles.colTitle}>{dictionary.footer.columns.contacts}</h4>
          <ul className={styles.list}>
            <li><strong>Фонд:</strong> {dictionary.footer.foundation_phone}</li>
            <li>{dictionary.footer.address_foundation}</li>
            <li style={{ marginTop: '0.5rem' }}><strong>Центр:</strong> {dictionary.footer.rehab_phone}</li>
            <li>{dictionary.footer.address_rehab}</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.colTitle}>{dictionary.footer.columns.socials}</h4>
          <ul className={styles.list}>
            <li><a href="https://wa.me/380961451155" target="_blank">WhatsApp</a></li>
            <li><a href="viber://chat?number=%2B380961451155" target="_blank">Viber</a></li>
            <li><a href="https://t.me/rehab_mercy_and_health" target="_blank">Telegram</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <p>{dictionary.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
