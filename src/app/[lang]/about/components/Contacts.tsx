"use client";

import { FaFacebookF, FaInstagram, FaTelegramPlane, FaLinkedinIn } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import styles from "./Contacts.module.css";

export default function Contacts({ dictionary }: { dictionary: any }) {
  const formDict = dictionary.about.contacts_tab.form;
  const footerDict = dictionary.footer;
  const socials = footerDict.social_links;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("This is a mock form submission.");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{dictionary.about.contacts_tab.title}</h2>
      
      <div className={styles.grid}>
        <div className={styles.infoCol}>
          <div className={styles.infoCard}>
            <ul className={styles.contactList}>
              <li>
                <div className={styles.icon}><Phone size={24} /></div>
                <div>
                  <span className={styles.label}>Телефон</span>
                  <a href={`tel:${footerDict.foundation_phone}`} className={styles.value}>
                    {footerDict.foundation_phone}
                  </a>
                </div>
              </li>
              <li>
                <div className={styles.icon}><Mail size={24} /></div>
                <div>
                  <span className={styles.label}>Email</span>
                  <a href="mailto:info@mercy-health.org" className={styles.value}>
                    info@mercy-health.org
                  </a>
                </div>
              </li>
              <li>
                <div className={styles.icon}><MapPin size={24} /></div>
                <div>
                  <span className={styles.label}>Адреса</span>
                  <span className={styles.value}>{footerDict.address_foundation}</span>
                </div>
              </li>
            </ul>
            
            <h3 className={styles.socialTitle}>{footerDict.columns.socials}</h3>
            <div className={styles.socialsList}>
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className={styles.socLink}>
                  <FaFacebookF size={20} />
                </a>
              )}
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className={styles.socLink}>
                  <FaInstagram size={20} />
                </a>
              )}
              {socials.telegram && (
                <a href={socials.telegram} target="_blank" rel="noopener noreferrer" className={styles.socLink}>
                  <FaTelegramPlane size={20} />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socLink}>
                  <FaLinkedinIn size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formCol}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">{formDict.name}</label>
              <input type="text" id="name" required className={styles.input} placeholder="Введіть ваше ім'я" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">{formDict.email}</label>
              <input type="email" id="email" required className={styles.input} placeholder="example@mail.com" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="message">{formDict.message}</label>
              <textarea id="message" rows={5} required className={styles.textarea} placeholder="Ваше повідомлення..."></textarea>
            </div>
            <button type="submit" className={styles.submitBtn}>
              {formDict.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
