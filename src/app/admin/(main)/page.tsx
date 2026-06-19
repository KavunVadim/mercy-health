import { getDb } from '@/lib/mongodb';
import {
  Newspaper,
  FolderOpen,
  Images,
  Users,
  FileText,
  ArrowUpRight,
  Database,
} from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import Link from 'next/link';

interface StatCardProps {
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  count: number;
  label: string;
  description: string;
}

function StatCard({ href, icon: Icon, count, label, description }: StatCardProps) {
  return (
    <Link href={href} className={styles.statCard}>
      <div className={styles.statCardIcon}>
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div>
        <div className={styles.statCardValue}>{count}</div>
        <div className={styles.statCardLabel}>{label}</div>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: 'auto', lineHeight: 1.4 }}>
        {description}
      </div>
      <ArrowUpRight size={16} className={styles.statCardArrow} />
    </Link>
  );
}

export default async function AdminDashboard() {
  let stats = { news: 0, projects: 0, photos: 0, partners: 0, reports: 0 };
  let dbOk = false;

  try {
    const db = await getDb();
    const [news, projects, photos, partners, reports] = await Promise.all([
      db.collection('news').countDocuments(),
      db.collection('projects').countDocuments(),
      db.collection('photos').countDocuments(),
      db.collection('partners').countDocuments(),
      db.collection('reports').countDocuments(),
    ]);
    stats = { news, projects, photos, partners, reports };
    dbOk = true;
  } catch (e) {
    console.error('Dashboard: failed to load stats', e);
  }

  const cards: StatCardProps[] = [
    {
      href: '/admin/news',
      icon: Newspaper,
      count: stats.news,
      label: 'Новини',
      description: 'Опубліковані новини та анонси',
    },
    {
      href: '/admin/projects',
      icon: FolderOpen,
      count: stats.projects,
      label: 'Проєкти',
      description: 'Активні та завершені проєкти',
    },
    {
      href: '/admin/photos',
      icon: Images,
      count: stats.photos,
      label: 'Фото',
      description: 'Зображення в медіатеці',
    },
    {
      href: '/admin/partners',
      icon: Users,
      count: stats.partners,
      label: 'Партнери',
      description: 'Організації-партнери',
    },
    {
      href: '/admin/reports',
      icon: FileText,
      count: stats.reports,
      label: 'Звіти',
      description: 'Фінансові звіти та звіти про діяльність',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader} style={{ marginBottom: '2.5rem' }}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Панель керування</h1>
          <p className={styles.pageSubtitle}>
            Керування контентом Mercy & Health
          </p>
        </div>
        {/* DB Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.875rem',
          background: dbOk ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          border: `1px solid ${dbOk ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: dbOk ? 'var(--admin-success)' : 'var(--admin-danger)',
          whiteSpace: 'nowrap',
        }}>
          <Database size={14} strokeWidth={2} />
          {dbOk ? 'MongoDB Підключено' : 'Помилка БД'}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <div className={styles.sectionTitle} style={{ marginBottom: '0.75rem' }}>Швидкі дії</div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          {[
            { href: '/admin/news', label: 'Додати новину', icon: Newspaper },
            { href: '/admin/projects', label: 'Додати проєкт', icon: FolderOpen },
            { href: '/admin/reports', label: 'Додати звіт', icon: FileText },
            { href: '/admin/photos', label: 'Завантажити фото', icon: Images },
          ].map(action => (
            <Link
              key={action.href}
              href={action.href}
              className={`${styles.btn} ${styles.btnSecondary}`}
              style={{ gap: '0.5rem' }}
            >
              <action.icon size={15} strokeWidth={2} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div className={styles.sectionTitle}>Розділи контенту</div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
      }}>
        {cards.map(card => (
          <StatCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  );
}
