"use client";

import { useState } from "react";
import { Copy, Check, Landmark, CreditCard, Receipt, FileText, Info, Globe } from "lucide-react";
import styles from "./SupportComponents.module.css";
import { motion, AnimatePresence } from "framer-motion";

export default function BankDetails({ dictionary }: { dictionary: any }) {
  const { bank_details } = dictionary.support;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCurrency, setActiveCurrency] = useState("UAH");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const accounts = {
    UAH: [
      { label: bank_details.beneficiary, value: bank_details.beneficiary_value, id: "beneficiary", icon: Landmark },
      { label: bank_details.edrpou, value: bank_details.edrpou_value, id: "edrpou", icon: FileText },
      { label: bank_details.bank_name, value: bank_details.bank_name_value, id: "bank", icon: Landmark },
      { label: bank_details.iban, value: "UA123456789012345678901234567", id: "iban", icon: CreditCard },
      { label: bank_details.purpose, value: bank_details.purpose_value, id: "purpose", icon: Receipt },
    ],
    USD: [
      { label: bank_details.beneficiary, value: bank_details.beneficiary_value, id: "beneficiary_usd", icon: Landmark },
      { label: "SWIFT", value: "BANKUAXXXXX", id: "swift_usd", icon: Globe },
      { label: bank_details.bank_name, value: "JPMorgan Chase Bank (Correspondent)", id: "bank_usd", icon: Landmark },
      { label: bank_details.iban, value: "UA098765432109876543210987654", id: "iban_usd", icon: CreditCard },
      { label: bank_details.purpose, value: "Charity donation (USD)", id: "purpose_usd", icon: Receipt },
    ],
    EUR: [
      { label: bank_details.beneficiary, value: bank_details.beneficiary_value, id: "beneficiary_eur", icon: Landmark },
      { label: "SWIFT", value: "BANKUAXXXXX", id: "swift_eur", icon: Globe },
      { label: bank_details.bank_name, value: "Deutsche Bank (Correspondent)", id: "bank_eur", icon: Landmark },
      { label: bank_details.iban, value: "UA112233445566778899001122334", id: "iban_eur", icon: CreditCard },
      { label: bank_details.purpose, value: "Charity donation (EUR)", id: "purpose_eur", icon: Receipt },
    ]
  };

  return (
    <div className={styles.bankDetailsContainer}>
      <div className={styles.detailsHeader}>
        <h2 className={styles.detailsTitle}>{bank_details.title}</h2>
        <p className={styles.detailsSubtitle}>{bank_details.subtitle}</p>
      </div>

      <div className={styles.currencySelector}>
        {Object.keys(accounts).map((curr) => (
          <button 
            key={curr}
            className={`${styles.currencyToggle} ${activeCurrency === curr ? styles.active : ""}`}
            onClick={() => setActiveCurrency(curr)}
          >
            {curr === "UAH" ? "ГРИВНЯ (UAH)" : curr === "USD" ? "ДОЛАР (USD)" : "ЄВРО (EUR)"}
          </button>
        ))}
      </div>

      <div className={styles.premiumDetailsGrid}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCurrency}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.rowsWrapper}
          >
            {accounts[activeCurrency as keyof typeof accounts].map((detail, idx) => {
              const Icon = detail.icon;
              return (
                <div key={detail.id} className={styles.premiumDetailRow}>
                  <div className={styles.rowIconWrapper}>
                    <Icon size={20} className={styles.rowIcon} />
                  </div>
                  <div className={styles.rowContent}>
                    <span className={styles.rowLabel}>{detail.label}</span>
                    <span className={styles.rowValue}>{detail.value}</span>
                  </div>
                  <button 
                    className={styles.premiumCopyBtn} 
                    onClick={() => copyToClipboard(detail.value, detail.id)}
                    title={bank_details.copy}
                  >
                    {copiedId === detail.id ? (
                      <Check size={18} className={styles.premiumCopiedIcon} />
                    ) : (
                      <Copy size={18} />
                    )}
                    {copiedId === detail.id && (
                      <span className={styles.premiumTooltip}>{bank_details.copied}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.premiumInfoSection}>
        <div className={styles.sectionInfo}>
          <Info size={16} className={styles.infoIcon} />
          <p className={styles.infoText}>Всі внески спрямовуються на статутну діяльність фонду.</p>
        </div>
      </div>
    </div>
  );
}
