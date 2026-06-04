import { getDb } from '@/lib/mongodb';

export default async function AdminDashboard() {
  let stats = { news: 0, projects: 0, photos: 0, partners: 0, reports: 0 };

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
  } catch (e) {
    console.error('Dashboard: failed to load stats', e);
  }

  const cards = [
    { href: '/admin/news', emoji: '📰', count: stats.news, label: 'News' },
    { href: '/admin/projects', emoji: '📁', count: stats.projects, label: 'Projects' },
    { href: '/admin/photos', emoji: '🖼️', count: stats.photos, label: 'Photos' },
    { href: '/admin/partners', emoji: '🤝', count: stats.partners, label: 'Partners' },
    { href: '/admin/reports', emoji: '📊', count: stats.reports, label: 'Reports' },
  ];

  return (
    <div>
      <style>{`.stat-card { display: block; background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); text-decoration: none; color: inherit; transition: box-shadow 0.15s, transform 0.15s; } .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); transform: translateY(-2px); }`}</style>
      <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Ласкаво просимо до панелі управління.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {cards.map(card => (
          <a key={card.href} href={card.href} className="stat-card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.emoji}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>{card.count}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>{card.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
