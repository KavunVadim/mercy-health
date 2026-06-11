// scripts/migrate-to-s3.mjs
// Upload ALL static images from public/images/ to S3 and update all DB/data references
// Run with: node --env-file=.env.local scripts/migrate-to-s3.mjs

import { MongoClient } from 'mongodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? 'mercy_health';
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const MIME_MAP = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

if (!MONGODB_URI) { console.error('❌ MONGODB_URI is not set'); process.exit(1); }
if (!AWS_REGION || !AWS_BUCKET) { console.error('❌ AWS config incomplete'); process.exit(1); }

const S3_BASE = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com`;

function getMime(filename) {
  return MIME_MAP[extname(filename).toLowerCase()] ?? 'image/webp';
}

function walkDir(dir, base = '') {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (entry === '.DS_Store' || entry.startsWith('_')) continue;
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) files.push(...walkDir(full, rel));
    else files.push({ path: full, rel });
  }
  return files;
}

function replaceLocalPaths(obj) {
  if (typeof obj === 'string') {
    return obj.startsWith('/images/') ? obj.replace('/images/', `${S3_BASE}/images/`) : obj;
  }
  if (Array.isArray(obj)) return obj.map(replaceLocalPaths);
  if (obj && typeof obj === 'object') {
    if (obj._bsontype || obj instanceof Date) return obj;
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === '_id') { result[k] = v; continue; }
      result[k] = replaceLocalPaths(v);
    }
    return result;
  }
  return obj;
}

async function main() {
  console.log('📸 Scanning public/images/...\n');
  const localFiles = walkDir(IMAGES_DIR);
  console.log(`Found ${localFiles.length} image(s) to upload.\n`);

  const s3 = new S3Client({
    region: AWS_REGION,
    credentials: AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
      ? { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }
      : undefined,
  });

  for (const [idx, file] of localFiles.entries()) {
    const key = `images/${file.rel}`;
    const mime = getMime(file.rel);
    const buffer = readFileSync(file.path);
    console.log(`[${idx + 1}/${localFiles.length}] ☁️  ${file.rel} (${(buffer.length / 1024).toFixed(0)} KB)`);
    await s3.send(new PutObjectCommand({
      Bucket: AWS_BUCKET, Key: key, Body: buffer,
      ContentType: mime, CacheControl: 'public, max-age=31536000, immutable',
    }));
  }

  console.log(`\n✅ All ${localFiles.length} images uploaded to S3\n`);

  // Update MongoDB
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    const collections = ['photos', 'news', 'projects', 'partners', 'content_uk', 'content_en'];

    for (const name of collections) {
      const col = db.collection(name);
      const all = await col.find({}).toArray();
      if (!all.length) continue;
      let updated = 0;
      for (const doc of all) {
        const replaced = replaceLocalPaths(doc);
        if (JSON.stringify(doc) !== JSON.stringify(replaced)) {
          await col.replaceOne({ _id: doc._id }, replaced);
          updated++;
        }
      }
      console.log(`📦 ${name}: ${updated}/${all.length} updated`);
    }
  } finally {
    await client.close();
  }

  // Update data JSON files
  console.log('\n📝 Updating data JSON files...');
  const dataFiles = ['news.json', 'projects.json', 'partners.json', 'content.uk.json', 'content.en.json'];
  for (const filename of dataFiles) {
    const fp = join(ROOT, 'data', filename);
    if (!existsSync(fp)) continue;
    const raw = JSON.parse(readFileSync(fp, 'utf8'));
    const upd = replaceLocalPaths(raw);
    writeFileSync(fp, JSON.stringify(upd, null, 2), 'utf8');
    console.log(`  ✅ ${filename}`);
  }

  console.log(`\n🎉 Migration complete! ${localFiles.length} images on S3, all references updated.`);
}

main().catch(err => { console.error('\n❌ Error:', err.message); process.exit(1); });
