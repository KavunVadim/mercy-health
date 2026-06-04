// scripts/migrate-to-mongo.mjs
// Push ALL data from /data/*.json into MongoDB collections
// Run: node --env-file=.env.local scripts/migrate-to-mongo.mjs

import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? 'mercy_health';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

function readJSON(filename) {
  try {
    return JSON.parse(readFileSync(join(DATA_DIR, filename), 'utf8'));
  } catch (e) {
    console.warn(`Could not read ${filename}:`, e.message);
    return null;
  }
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  console.log('Connected to MongoDB');

  // Clear all collections
  const collections = ['news', 'projects', 'partners', 'reports', 'settings', 'content_uk', 'content_en', 'photos'];
  for (const c of collections) {
    try { await db.collection(c).deleteMany({}); } catch {}
  }
  console.log('Cleared all collections');

  // 1. News
  const newsData = readJSON('news.json');
  if (newsData?.news?.length) {
    const news = newsData.news.map(n => ({
      id: n.id, slug: n.slug || n.id, date: n.date,
      image: n.image, image_focus: n.image_focus || '',
      title: n.title || { uk: '', en: '' },
      description: n.description || { uk: '', en: '' },
      content: n.content || { uk: [], en: [] },
      gallery: n.gallery || [],
      video_link: n.video_link || '',
      video_label: n.video_label || null,
      external_link: n.external_link || n.link || '',
      link_label: n.link_label || null,
      createdAt: new Date(), updatedAt: new Date(),
    }));
    await db.collection('news').insertMany(news);
    console.log(`News: ${news.length} items`);

    // Store top-level gallery separately
    if (newsData.gallery?.length) {
      await db.collection('content').updateOne(
        { key: 'news_gallery' },
        { $set: { key: 'news_gallery', images: newsData.gallery, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log(`News gallery: ${newsData.gallery.length} images`);
    }
  }

  // 2. Projects
  const projectsData = readJSON('projects.json');
  if (projectsData?.projects?.length) {
    const projects = projectsData.projects.map(p => ({
      id: p.id, image: p.image || '',
      title: p.title || { uk: '', en: '' },
      description: p.description || { uk: '', en: '' },
      full_description: p.full_description || { uk: '', en: '' },
      gallery: p.gallery || [],
      status: p.status || 'active',
      createdAt: new Date(), updatedAt: new Date(),
    }));
    await db.collection('projects').insertMany(projects);
    console.log(`Projects: ${projects.length} items`);
  }

  // 3. Partners
  const partnersData = readJSON('partners.json');
  if (partnersData?.partners?.length) {
    const partners = partnersData.partners.map(p => ({
      id: p.id, name: p.name || { uk: '', en: '' },
      logo: p.logo || '', url: p.url || '', category: p.category || 'other',
      createdAt: new Date(), updatedAt: new Date(),
    }));
    await db.collection('partners').insertMany(partners);
    console.log(`Partners: ${partners.length} items`);
  }

  // 4. Reports
  const reportsData = readJSON('reports.json');
  if (reportsData?.reports?.length) {
    const reports = reportsData.reports.map(r => ({
      id: r.id, title: r.title || { uk: '', en: '' },
      period: r.period || '', year: r.year || 0, date: r.date || '',
      url: r.url || '', pdf_url: r.pdf_url || r.url || '',
      total_collected: r.total_collected || 0,
      donations_count: r.donations_count || 0,
      summary: r.summary || { uk: '', en: '' },
      stats: r.stats || { raised: 0, spent: 0, projects_count: 0 },
      createdAt: new Date(), updatedAt: new Date(),
    }));
    await db.collection('reports').insertMany(reports);
    console.log(`Reports: ${reports.length} items`);
  }

  // 5. Settings
  const settingsData = readJSON('settings.json');
  if (settingsData) {
    await db.collection('settings').updateOne(
      { key: 'main' },
      { $set: { key: 'main', ...settingsData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('Settings: saved');
  }

  // 6. Content (uk / en)
  for (const locale of ['uk', 'en']) {
    const content = readJSON(`content.${locale}.json`);
    if (content) {
      const col = locale === 'uk' ? 'content_uk' : 'content_en';
      await db.collection(col).updateOne(
        { key: 'main' },
        { $set: { key: 'main', ...content, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log(`Content ${locale}: saved`);
    }
  }

  console.log('\nMigration complete!');
  await client.close();
}

main().catch(err => { console.error('Migration failed:', err); process.exit(1); });
