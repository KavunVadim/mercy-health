"use client";

import Image from "next/image";
import styles from "./SupportComponents.module.css";

interface DonationCard {
  id: string;
  title: string;
  description: string;
  bank: string;
  link: string;
}

interface Dictionary {
  support: {
    cards: {
      monobank: string;
      privatbank: string;
      details: string;
      items: DonationCard[];
    };
  };
  [key: string]: any;
}

export default function DonationCards({ dictionary }: { dictionary: any }) {
  const { cards } = (dictionary as Dictionary).support;

  return (
    <div className={styles.cardsGrid}>
      {cards.items.map((item: DonationCard) => (
        <div key={item.id} className={styles.donationCard}>
          <div className={styles.cardHeader}>
            <div className={styles.bankLogoWrapper}>
              <Image 
                src="/icons/banks/monobank.png" 
                alt={item.bank} 
                width={40} 
                height={40} 
                className={styles.bankLogo}
              />
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
          </div>
          
          <p className={styles.cardDescription}>{item.description}</p>
          
          <div className={styles.cardFooter}>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.supportBtn}
            >
              {cards.monobank}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
