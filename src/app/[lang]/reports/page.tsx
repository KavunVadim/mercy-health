import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  // Data from dictionary/reports.json
  const reportsList = dictionary.reports.reports || [];
  
  // Calculate summary if not provided in JSON
  const summaryData = dictionary.reports.summary || {
    total: reportsList.reduce((acc: number, curr: any) => acc + (curr.stats?.raised || 0), 0).toLocaleString(),
    donations: reportsList.reduce((acc: number, curr: any) => acc + (curr.stats?.projects_count || 0), 0).toString(),
    average: reportsList.length > 0 
      ? Math.round(reportsList.reduce((acc: number, curr: any) => acc + (curr.stats?.raised || 0), 0) / reportsList.length / 100).toLocaleString() 
      : "0"
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <Breadcrumbs lang={locale} dictionary={dictionary} className={styles.breadcrumbs} />
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
            {reportsList.map((report: any) => (
              <div key={report.id} className={styles.reportItem}>
                <div className={styles.reportInfo}>
                  <div className="flex flex-col">
                    <span className={styles.reportMonth}>{report.title}</span>
                    <span className="text-xs opacity-50">{report.period}</span>
                  </div>
                  <span className={styles.reportAmount}>{report.stats?.raised?.toLocaleString() || 0} ₴</span>
                </div>
                <a href={report.pdf_url} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
                  PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
