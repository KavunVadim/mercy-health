import { MongoClient } from 'mongodb';

async function ensureIndexes() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri || !dbName) {
    console.error('MONGODB_URI and MONGODB_DB must be set');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const collections = [
    {
      name: 'users',
      indexes: [{ email: 1 }],
    },
    {
      name: 'contacts',
      indexes: [{ createdAt: -1 }, { read: 1 }],
    },
    {
      name: 'news',
      indexes: [{ order: -1, createdAt: -1 }, { 'slug.uk': 1 }, { 'slug.en': 1 }],
    },
    {
      name: 'projects',
      indexes: [{ order: -1, createdAt: -1 }, { 'slug.uk': 1 }, { 'slug.en': 1 }],
    },
    {
      name: 'partners',
      indexes: [{ id: 1 }, { order: -1 }],
    },
    {
      name: 'reports',
      indexes: [{ id: 1 }, { order: -1 }],
    },
    {
      name: 'photos',
      indexes: [{ hash: 1 }, { order: -1, createdAt: -1 }, { inGallery: 1 }],
    },
    {
      name: 'settings',
      indexes: [{ key: 1 }],
    },
    {
      name: 'content_uk',
      indexes: [{ 'about.history.title': 1 }],
    },
    {
      name: 'content_en',
      indexes: [{ 'about.history.title': 1 }],
    },
  ];

  for (const { name, indexes } of collections) {
    try {
      const existing = await db.collection(name).indexes();
      const existingNames = new Set(existing.map((i) => i.name));

      for (const keys of indexes) {
        const label = Object.keys(keys).join('_');
        if (!existingNames.has(label)) {
          await db.collection(name).createIndex(keys);
          console.log(`✓ Created index ${label} on ${name}`);
        } else {
          console.log(`= Index ${label} already exists on ${name}`);
        }
      }
    } catch (err) {
      console.error(`✗ Failed to process ${name}:`, err);
    }
  }

  await client.close();
  console.log('Done.');
  process.exit(0);
}

ensureIndexes();
