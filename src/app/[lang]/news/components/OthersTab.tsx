"use client";

import { FileText, Download } from "lucide-react";
import styles from "./Tabs.module.css";

export default function OthersTab({ dictionary }: { dictionary: Record<string, unknown> }) {
  const { title, description } = dictionary.news.others;

  const documents = [
    { id: 1, name: "Річний звіт фонду за 2025 рік", size: "2.4 MB", date: "15.01.2026" },
    { id: 2, name: "Статут благодійного фонду", size: "1.1 MB", date: "10.08.2023" },
    { id: 3, name: "Фінансовий аудит 2025", size: "3.5 MB", date: "05.02.2026" },
    { id: 4, name: "Презентація для партнерів", size: "8.2 MB", date: "20.03.2026" },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDescription}>{description}</p>
      
      <div className={styles.docsList}>
        {documents.map((doc) => (
          <div key={doc.id} className={styles.docItem}>
            <div className={styles.docIcon}>
              <FileText size={32} />
            </div>
            <div className={styles.docInfo}>
              <h4 className={styles.docName}>{doc.name}</h4>
              <p className={styles.docMeta}>PDF • {doc.size} • {doc.date}</p>
            </div>
            <button className={styles.downloadBtn} aria-label="Download document">
              <Download size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
