"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs/Tabs";
import DonationCards from "./components/DonationCards";
import BankDetails from "./components/BankDetails";
import styles from "./page.module.css";

export default function SupportContent({ dictionary }: { dictionary: Record<string, unknown> }) {
  const [activeTab, setActiveTab] = useState("once");

  const tabs = [
    { id: "once", label: dictionary.support.tabs.once },
    { id: "monthly", label: dictionary.support.tabs.monthly },
    { id: "requisites", label: dictionary.support.tabs.requisites },
  ];

  return (
    <div className={styles.contentWrapper}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      <div className={styles.tabContent}>
        {activeTab === "once" && <DonationCards dictionary={dictionary} />}
        {activeTab === "monthly" && (
          <div className={styles.placeholderCard}>
            <h3 className={styles.placeholderTitle}>{dictionary.support.tabs.monthly}</h3>
            <p className={styles.placeholderText}>
              Цей розділ наразі знаходиться в розробці. Незабаром ви зможете оформити щомісячну підписку на підтримку наших проєктів.
            </p>
          </div>
        )}
        {activeTab === "requisites" && <BankDetails dictionary={dictionary} />}
      </div>
    </div>
  );
}
