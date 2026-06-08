"use client";

import { useState } from "react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaLinkedinIn } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import styles from "./Contacts.module.css";
import type { Dictionary } from "@/types/content";

export default function Contacts({ dictionary }: { dictionary: Dictionary }) {
  const dict = dictionary;
  const formDict = dict.about.contacts_tab.form;
  const footerDict = dict.footer;
  const socials = footerDict.social_links || {};
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    const form = e.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setSent(true);
        form.reset();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send');
      }
    } catch {
      setError('Network error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{dict.about.contacts_tab.title}</h2>
      
      <div className={styles.grid}>
        <div className={styles.infoCol}>
          <div className={styles.infoCard}>
            <ul className={styles.contactList}>
              <li>
                <div className={styles.icon}><Phone size={24} /></div>
                <div>
                  <span className={styles.label}>{dict.about.contacts_tab.labels.phone}</span>
                  <a href={`tel:${footerDict.foundation_phone}`} className={styles.value}>
                    {footerDict.foundation_phone}
                  </a>
                </div>
              </li>
              <li>
                <div className={styles.icon}><Mail size={24} /></div>
                <div>
                  <span className={styles.label}>{dict.about.contacts_tab.labels.email}</span>
                  <a href={`mailto:${footerDict.foundation_email || "info@mercyandhealth.org"}`} className={styles.value}>
                    {footerDict.foundation_email || "info@mercyandhealth.org"}
                  </a>
                </div>
              </li>
              <li>
                <div className={styles.icon}><MapPin size={24} /></div>
                <div>
                  <span className={styles.label}>{dict.about.contacts_tab.labels.address}</span>
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
            {sent && <div style={{ padding: '0.75rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem' }}>Message sent successfully!</div>}
            {error && <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="name">{formDict.name}</label>
              <input type="text" name="name" id="name" required className={styles.input} placeholder={formDict.name_placeholder} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">{formDict.email}</label>
              <input type="email" name="email" id="email" required className={styles.input} placeholder="example@mail.com" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="message">{formDict.message}</label>
              <textarea name="message" id="message" rows={5} required className={styles.textarea} placeholder={formDict.message_placeholder}></textarea>
            </div>
            <button type="submit" disabled={sending || sent} className={styles.submitBtn}>
              {sending ? 'Sending...' : sent ? 'Sent ✓' : formDict.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
