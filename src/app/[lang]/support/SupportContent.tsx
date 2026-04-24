"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs/Tabs";
import DonationCards from "./components/DonationCards";
import BankDetails from "./components/BankDetails";
import styles from "./page.module.css";

export default function SupportContent({ dictionary }: { dictionary: any }) {
  const [activeTab, setActiveTab] = useState("once");
  const support = dictionary.support;

  const tabs = [
    { id: "once", label: support.tabs.once },
    { id: "requisites", label: support.tabs.requisites },
  ];

  return (
    <div className={styles.contentWrapper}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      <div className={styles.tabContent}>
        {activeTab === "once" && <DonationCards dictionary={dictionary} />}
        {activeTab === "requisites" && <BankDetails dictionary={dictionary} />}
      </div>
    </div>
  );
}
