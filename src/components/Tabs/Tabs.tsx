import { motion } from "framer-motion";
import styles from "./Tabs.module.css";
import clsx from "clsx";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={clsx(styles.tabBtn, isActive && styles.active)}
              onClick={() => onChange(tab.id)}
            >
              <span className={styles.tabLabel}>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className={styles.activeIndicator}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
