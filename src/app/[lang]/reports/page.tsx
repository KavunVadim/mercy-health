import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  // Mock data for summary
  const summaryData = {
    total: "12,450,000",
    donations: "8,320",
    average: "1,500"
  };

  // Mock data for monthly reports
  const monthlyReports = [
    { month: dictionary.reports.months.mar, year: "2026", amount: "4,200,000", id: "mar26" },
    { month: dictionary.reports.months.feb, year: "2026", amount: "3,850,000", id: "feb26" },
    { month: dictionary.reports.months.jan, year: "2026", amount: "4,400,000", id: "jan26" },
  ];

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>{dictionary.reports.title}</h1>
          <p className={styles.description}>{dictionary.reports.description}</p>
        </div>
      </header>

      <section className={styles.summarySection}>
        <div className={`container ${styles.summaryGrid}`}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{dictionary.reports.summary.total_collected}</span>
            <span className={styles.summaryValue}>{summaryData.total} ₴</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{dictionary.reports.summary.donations_count}</span>
            <span className={styles.summaryValue}>{summaryData.donations}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{dictionary.reports.summary.avg_donation}</span>
            <span className={styles.summaryValue}>{summaryData.average} ₴</span>
          </div>
        </div>
      </section>

      <section className={styles.historySection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{dictionary.reports.history}</h2>
          <div className={styles.reportList}>
            {monthlyReports.map((report) => (
              <div key={report.id} className={styles.reportItem}>
                <div className={styles.reportInfo}>
                  <span className={styles.reportMonth}>{report.month} {report.year}</span>
                  <span className={styles.reportAmount}>{report.amount} ₴</span>
                </div>
                <button className={styles.downloadBtn}>PDF</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
