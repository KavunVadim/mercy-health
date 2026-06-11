// scripts/migrate-to-s3.mjs
// Migrate all locally-stored photos (/uploads/) to AWS S3
// Run with: node --env-file=.env.local scripts/migrate-to-s3.mjs

import { MongoClient } from 'mongodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = join(__dirname, '..', 'public', 'uploads');
const PRODUCTION_ORIGIN = 'https://mercy-health.vercel.app';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? 'mercy_health';
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

function getMime(filename) {
  return MIME_MAP[extname(filename).toLowerCase()] ?? 'image/webp';
}

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set');
  process.exit(1);
}

if (!AWS_REGION || !AWS_BUCKET || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS S3 configuration is incomplete');
  process.exit(1);
}

async function downloadFromProduction(url) {
  const fullUrl = `${PRODUCTION_ORIGIN}${url}`;
  console.log(`  ⬇️  Downloading from ${fullUrl}`);
  const res = await fetch(fullUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${fullUrl}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  console.log('🔍 Scanning photos collection...\n');

  const client = new MongoClient(MONGODB_URI);
  const s3 = new S3Client({
    region: AWS_REGION,
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
  });

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    const photos = db.collection('photos');

    const localPhotos = await photos.find({ url: { $regex: '^/uploads/' }, s3Key: null }).toArray();

    if (localPhotos.length === 0) {
      const anyLocal = await photos.findOne({ url: { $regex: '^/uploads/' } });
      if (!anyLocal) {
        console.log('✅ No local photos found in the database. Everything is already on S3.');
      } else {
        const allLocal = await photos.find({ url: { $regex: '^/uploads/' } }).toArray();
        console.log(`⚠️  Found ${allLocal.length} local photos, but all already have an s3Key.`);
        console.log('   Run with --force to re-upload them anyway.');
      }
      return;
    }

    console.log(`📸 Found ${localPhotos.length} local photo(s) to migrate:\n`);

    for (const [idx, photo] of localPhotos.entries()) {
      const filename = photo.url.replace('/uploads/', '');
      const filePath = join(UPLOADS_DIR, filename);
      const ext = extname(filename);
      const mime = getMime(filename);
      const key = `uploads/${filename}`;

      console.log(`[${idx + 1}/${localPhotos.length}] ${filename}`);

      let buffer;
      if (existsSync(filePath)) {
        console.log(`  📁 Reading local file`);
        buffer = readFileSync(filePath);
      } else {
        buffer = await downloadFromProduction(photo.url);
      }

      console.log(`  ☁️  Uploading to s3://${AWS_BUCKET}/${key} (${(buffer.length / 1024 / 1024).toFixed(1)} MB, ${mime})`);

      await s3.send(new PutObjectCommand({
        Bucket: AWS_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mime,
        CacheControl: 'public, max-age=31536000, immutable',
      }));

      const s3Url = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

      await photos.updateOne(
        { _id: photo._id },
        { $set: { url: s3Url, s3Key: key, mime } }
      );

      console.log(`  ✅ Updated DB: ${s3Url}\n`);
    }

    console.log(`🎉 Migration complete! ${localPhotos.length} photo(s) moved to S3.`);
    console.log('📦 You can now safely delete the public/uploads/ folder from your deployment.');

  } finally {
    await client.close();
    s3.destroy();
  }
}

main().catch((err) => {
  console.error('❌ Migration error:', err.message);
  process.exit(1);
});
