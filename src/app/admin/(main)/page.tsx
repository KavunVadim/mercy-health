import { getDb } from '@/lib/mongodb';
import {
  Newspaper,
  FolderOpen,
  Images,
  Users,
  FileText,
  ArrowUpRight,
  Activity,
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

  const total = stats.news + stats.projects + stats.photos + stats.partners + stats.reports;

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

      {/* Summary row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '1.5rem',
        marginBottom: '2rem',
        alignItems: 'stretch',
      }}>
        {/* Total items card */}
        <div className={styles.card} style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(20, 184, 166, 0.02) 100%)',
          borderColor: 'rgba(20, 184, 166, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'var(--admin-accent-light)',
            border: '1px solid rgba(20, 184, 166, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--admin-accent)',
            flexShrink: 0,
          }}>
            <Activity size={24} strokeWidth={1.75} />
          </div>
          <div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--admin-text)',
              fontFamily: 'var(--admin-mono)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>{total}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', marginTop: '0.25rem', fontWeight: 500 }}>
              Всього записів у базі даних
            </div>
          </div>
        </div>

        {/* Quick info */}
        <div className={styles.card} style={{ padding: '1.5rem', minWidth: 200 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            Швидка інформація
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Новини', val: stats.news },
              { label: 'Проєкти', val: stats.projects },
              { label: 'Звіти', val: stats.reports },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>{r.label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--admin-text)', fontFamily: 'var(--admin-mono)' }}>{r.val}</span>
              </div>
            ))}
          </div>
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

      {/* Quick Actions */}
      <div style={{ marginTop: '2.5rem' }}>
        <div className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Швидкі дії</div>
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
    </div>
  );
}
