"use client";

import { useState } from "react";
import { Copy, Check, Landmark, CreditCard, Receipt, FileText, Info, Globe, Building2, Wallet, Zap } from "lucide-react";
import styles from "./SupportComponents.module.css";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "ua" | "intl" | "crypto";

export default function BankDetails({ dictionary }: { dictionary: any }) {
  const { bank_details } = dictionary.support;
  const [activeTab, setActiveTab] = useState<TabType>("ua");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs = [
    { id: "ua", label: dictionary.support.bank_details.tabs.ua, icon: Zap },
    { id: "intl", label: dictionary.support.bank_details.tabs.intl, icon: Globe },
    { id: "crypto", label: dictionary.support.bank_details.tabs.crypto, icon: Wallet },
  ];

  const content = {
    ua: [
      { label: dictionary.support.bank_details.accounts.privat, value: "UA383052990000026005015017860", id: "ua_privat", icon: Landmark },
      { label: dictionary.support.bank_details.accounts.oschad, value: "UA223226690000026007300905964", id: "ua_oschad", icon: Landmark },
      { label: dictionary.support.bank_details.accounts.pumb, value: "UA183348510000000260022228947", id: "ua_pumb", icon: Landmark },
      { label: dictionary.support.bank_details.accounts.ukrsib, value: "UA863220010000026002080000681", id: "ua_ukrsib", icon: Landmark },
    ],
    intl: [
      { label: dictionary.support.bank_details.accounts.usd, value: "UA098765432109876543210987654", id: "intl_usd", icon: Globe, extra: "JPMorgan Chase Bank" },
      { label: dictionary.support.bank_details.accounts.eur, value: "UA112233445566778899001122334", id: "intl_eur", icon: Globe, extra: "Deutsche Bank" },
    ],
    crypto: [
      { label: dictionary.support.bank_details.accounts.usdt, value: "TXxxxxxxxxxxxxxxxxxxxxxxxxxxxx", id: "crypto_usdt", icon: Wallet },
      { label: dictionary.support.bank_details.accounts.btc, value: "1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", id: "crypto_btc", icon: Wallet },
      { label: dictionary.support.bank_details.accounts.eth, value: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", id: "crypto_eth", icon: Wallet },
    ]
  };

  return (
    <div className={styles.bankDetailsContainer}>
      {/* Navigation Tabs */}
      <div className={styles.premiumTabsWrapper}>
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            className={`${styles.premiumTabItem} ${activeTab === tab.id ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab.id as TabType)}
          >
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.accountsListWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={styles.tabContentGrid}
          >
            {content[activeTab].map((item: any) => (
              <PaymentRow 
                key={item.id} 
                item={item} 
                copiedId={copiedId} 
                onCopy={copyToClipboard}
                dictionary={dictionary}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.commonOrgInfo}>
        <div className={styles.orgHeader}>
          <Building2 size={18} />
          <span>{bank_details.beneficiary}</span>
        </div>
        <p className={styles.orgValue}>{bank_details.beneficiary_value}</p>
        <div className={styles.orgMeta}>
          <span>{bank_details.edrpou}: <b>{bank_details.edrpou_value}</b></span>
        </div>
      </div>
    </div>
  );
}

function PaymentRow({ item, copiedId, onCopy, dictionary }: any) {
  const Icon = item.icon;
  const isCopied = copiedId === item.id;

  return (
    <div className={styles.paymentReferenceRow}>
      <div className={styles.paymentIconBox}>
        <Icon size={22} strokeWidth={1.5} />
      </div>
      
      <div className={styles.paymentInfo}>
        <span className={styles.paymentLabel}>{item.label}</span>
        <span className={styles.paymentValue}>{item.value}</span>
        {item.extra && <span className={styles.paymentExtra}>{item.extra}</span>}
      </div>

      <button 
        className={`${styles.paymentCopyAction} ${isCopied ? styles.copied : ""}`}
        onClick={() => onCopy(item.value, item.id)}
      >
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.div 
              key="check" 
              className={styles.copyBtnContent}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
            >
              <Check size={16} />
              <span>{dictionary.support.bank_details.copied}</span>
            </motion.div>
          ) : (
            <motion.div 
              key="copy" 
              className={styles.copyBtnContent}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
            >
              <Copy size={16} />
              <span>{dictionary.support.bank_details.copy}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
