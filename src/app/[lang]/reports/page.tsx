export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/config";
import type { Report, ReportDocument } from "@/types/content";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  return {
    title: `${dictionary.reports.title} | ${dictionary.metadata.title}`,
    description: dictionary.reports.description || dictionary.metadata.description,
    alternates: {
      canonical: siteUrl(`/${lang}/reports`),
      languages: {
        uk: siteUrl("/uk/reports"),
        en: siteUrl("/en/reports"),
      },
    },
  };
}

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  // Data from dictionary/reports.json (merged via getDictionary)
  const reportsList = dictionary.reports?.reports || [];
  
  // Calculate summary stats from reportsList
  const totalCollected = reportsList.reduce((acc: number, curr: Report) => acc + curr.total_collected, 0);
  const totalDonations = reportsList.reduce((acc: number, curr: Report) => acc + curr.donations_count, 0);
  const averageDonation = totalDonations > 0 ? Math.round(totalCollected / totalDonations) : 0;

  const stats = {
    total: totalCollected.toLocaleString(locale),
    donations: totalDonations.toLocaleString(locale),
    average: averageDonation.toLocaleString(locale)
  };

  return (
    <main className={styles.main}>
      <BreadcrumbJsonLd items={[
        { name: dictionary.navigation.home, url: siteUrl(`/${locale}`) },
        { name: dictionary.reports.title, url: siteUrl(`/${locale}/reports`) },
      ]} />
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
            <span className={styles.summaryValue}>{stats.total} ₴</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{dictionary.reports.summary.donations_count}</span>
            <span className={styles.summaryValue}>{stats.donations}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{dictionary.reports.summary.avg_donation}</span>
            <span className={styles.summaryValue}>{stats.average} ₴</span>
          </div>
        </div>
      </section>

      <section className={styles.historySection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{dictionary.reports.history}</h2>
          <div className={styles.reportList}>
            {reportsList.map((report: Report) => (
              <div key={report.id} className={styles.reportItem}>
                <div className={styles.reportInfo}>
                  <div className="flex flex-col">
                    <span className={styles.reportMonth}>{report.period}</span>
                    <span className="text-xs opacity-50">{report.year}</span>
                  </div>
                  <span className={styles.reportAmount}>{report.total_collected?.toLocaleString(locale) || 0} ₴</span>
                </div>
                <a href={report.url} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
                  PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {dictionary.reports.documents && dictionary.reports.documents.length > 0 && (
        <section className={styles.documentsSection}>
          <div className="container">
            <h2 className={styles.historyTitle}>{dictionary.reports.transparency}</h2>
            <div className={styles.documentsGrid}>
              {dictionary.reports.documents.map((doc: ReportDocument) => (
                <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className={styles.documentCard}>
                  <div className={styles.documentIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span className={styles.documentTitle}>{doc.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
