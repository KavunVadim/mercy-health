"use client";

import Image from "next/image";
import { ArrowUpRight } from 'lucide-react';
import styles from "./SupportComponents.module.css";
import type { Dictionary } from "@/types/content";

interface DonationCard {
  id: string;
  title: string;
  description: string;
  bank: string;
  link: string;
  image?: string;
}

interface BankBrand {
  logo: string;
  color: string;
  label: string;
}

const BANK_BRANDS: Record<string, BankBrand> = {
  monobank:    { logo: '/icons/banks/monobank.png',    color: '#000000',   label: 'Monobank' },
  монобанк:   { logo: '/icons/banks/monobank.png',    color: '#000000',   label: 'Monobank' },
  privatbank:  { logo: '/icons/banks/privatbank.svg',  color: '#7B2CBF',   label: 'PrivatBank' },
  приватбанк:  { logo: '/icons/banks/privatbank.svg',  color: '#7B2CBF',   label: 'PrivatBank' },
  privat24:    { logo: '/icons/banks/privatbank.svg',  color: '#7B2CBF',   label: 'Privat24' },
  pumb:        { logo: '/icons/banks/pumb.svg',        color: '#E30613',   label: 'PUMB' },
  tascombank:  { logo: '/icons/banks/tascombank.svg',  color: '#003D7A',   label: 'Tascombank' },
  sensebank:   { logo: '/icons/banks/sensebank.svg',   color: '#00ADEF',   label: 'Sense Bank' },
  осчадбанк:  { logo: '/icons/banks/oschadbank.svg',  color: '#006B3F',   label: 'Oschadbank' },
  ощадбанк:   { logo: '/icons/banks/oschadbank.svg',  color: '#006B3F',   label: 'Oschadbank' },
  oschadbank:  { logo: '/icons/banks/oschadbank.svg',  color: '#006B3F',   label: 'Oschadbank' },
  ukrgasbank:  { logo: '/icons/banks/ukrgasbank.svg',  color: '#003B7A',   label: 'Ukrgasbank' },
  укргазбанк: { logo: '/icons/banks/ukrgasbank.svg',  color: '#003B7A',   label: 'Ukrgasbank' },
};

function findBank(bank: string): BankBrand | null {
  const key = bank.toLowerCase().replace(/[^a-zа-яіїєґ0-9]/g, '');
  for (const [name, brand] of Object.entries(BANK_BRANDS)) {
    if (key.includes(name)) return brand;
  }
  return null;
}

export default function DonationCards({ dictionary }: { dictionary: Dictionary }) {
  const { cards } = dictionary.support;

  function renderLogo(item: DonationCard) {
    if (item.image) {
      return (
        <img src={item.image} alt={item.bank} className={styles.bankLogoImage} />
      );
    }

    const bank = findBank(item.bank);
    if (bank) {
      return (
        <Image src={bank.logo} alt={item.bank} width={52} height={52} className={styles.bankLogoImage} />
      );
    }

    return null;
  }

  return (
    <div className={styles.cardsGrid}>
      {cards.items.map((item: DonationCard) => {
        const bank = findBank(item.bank);

        return (
          <div key={item.id} className={styles.donationCard}>
            <div className={styles.cardTopAccent} />

            <div className={styles.cardInner}>
              <div className={styles.cardHeader}>
                <div className={styles.bankLogoWrapper}>
                  {renderLogo(item)}
                </div>

                <div className={styles.cardTitleGroup}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.cardBankLabel}>
                    {bank?.label || item.bank}
                  </div>
                </div>
              </div>

              <p className={styles.cardDescription}>{item.description}</p>

              <div className={styles.cardFooter}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.supportBtn}
                >
                  {item.bank.toLowerCase().includes('mono') || item.bank.toLowerCase().includes('моно') ? cards.monobank
                    : item.bank.toLowerCase().includes('privat') || item.bank.toLowerCase().includes('приват') ? cards.privatbank
                    : (bank?.label || item.bank)}
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
