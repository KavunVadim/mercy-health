// scripts/seed.mjs
// Populate MongoDB with actual foundation data from /data/*.json
// Run with: node --env-file=.env.local scripts/seed.mjs

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? 'mercy_health';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

function readJSON(filename) {
  try {
    const raw = readFileSync(join(DATA_DIR, filename), 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`⚠️  Could not read ${filename}:`, e.message);
    return null;
  }
}

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    const db = client.db(MONGODB_DB);

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('news').deleteMany({});
    await db.collection('projects').deleteMany({});
    await db.collection('photos').deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // ── 1. Admin user ──────────────────────────────────
    const ADMIN_EMAIL = process.env.ADMIN_USERNAME ?? 'admin@example.com';
    const ADMIN_HASH_B64 = process.env.ADMIN_PASSWORD_HASH_B64;
    const ADMIN_HASH = ADMIN_HASH_B64
      ? Buffer.from(ADMIN_HASH_B64, 'base64').toString('utf-8')
      : bcrypt.hashSync('123456', 10);

    await db.collection('users').insertOne({
      email: ADMIN_EMAIL,
      passwordHash: ADMIN_HASH,
      role: 'admin',
      createdAt: new Date(),
    });
    console.log('✅ Admin user created:', ADMIN_EMAIL);

    // ── 2. Projects from data/projects.json ────────────
    const projectsData = readJSON('projects.json');
    if (projectsData && projectsData.projects) {
      const projectDocs = projectsData.projects.map((p) => ({
        id: p.id || '',
        image: p.image || '',
        title: p.title || { uk: '', en: '' },
        description: p.description || { uk: '', en: '' },
        full_description: p.full_description || { uk: '', en: '' },
        gallery: p.gallery || [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      const result = await db.collection('projects').insertMany(projectDocs);
      console.log(`✅ Projects seeded: ${result.insertedCount} items`);
    } else {
      console.log('⚠️  No projects data found');
    }

    // ── 3. News from data/news.json ────────────────────
    const newsData = readJSON('news.json');
    if (newsData && newsData.news) {
      const newsDocs = newsData.news.map((n) => ({
        id: n.id || '',
        slug: n.slug || n.id || '',
        date: n.date || '',
        image: n.image || '',
        image_focus: n.image_focus || '',
        title: n.title || { uk: '', en: '' },
        description: n.description || { uk: '', en: '' },
        content: n.content || { uk: [], en: [] },
        gallery: n.gallery || [],
        video_link: n.video_link || '',
        video_label: n.video_label || undefined,
        external_link: n.external_link || n.link || '',
        link_label: n.link_label || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      const result = await db.collection('news').insertMany(newsDocs);
      console.log(`✅ News seeded: ${result.insertedCount} items`);
    } else {
      console.log('⚠️  No news data found');
    }

    // ── 4. Photos from gallery images ──────────────────
    const photoUrls = new Set();

    // Collect from projects
    if (projectsData?.projects) {
      for (const p of projectsData.projects) {
        if (p.image && !p.image.startsWith('http')) photoUrls.add(p.image);
        if (p.gallery) for (const img of p.gallery) photoUrls.add(img);
      }
    }

    // Collect from news
    if (newsData?.news) {
      for (const n of newsData.news) {
        if (n.image) photoUrls.add(n.image);
        if (n.gallery) for (const img of n.gallery) photoUrls.add(img);
      }
    }

    // Collect partner logos
    const partnersData = readJSON('partners.json');
    if (partnersData?.partners) {
      for (const p of partnersData.partners) {
        if (p.logo) photoUrls.add(p.logo);
      }
    }

    const photoDocs = [...photoUrls].map((url) => {
      const name = url.split('/').pop()?.split('.')[0] || 'Photo';
      return {
        title: name,
        url: url,
        alt: name,
        description: '',
        uploadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    if (photoDocs.length > 0) {
      const result = await db.collection('photos').insertMany(photoDocs);
      console.log(`✅ Photos seeded: ${result.insertedCount} items`);
    } else {
      console.log('⚠️  No photos data found');
    }

    console.log('\n🎉 Seed completed successfully!');
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

main().catch((err) => {
  console.error('❌ Seed error:', err.message);
  process.exit(1);
});
