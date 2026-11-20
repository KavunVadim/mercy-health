#!/usr/bin/env node
/**
 * Add / roll back a news item outside the admin UI.
 *
 *   node scripts/news-add.mjs --spec path/to/spec.json [--dry-run]
 *   node scripts/news-add.mjs --rollback <newsObjectId|slug>
 *
 * Spec shape:
 * {
 *   "slug": "optional-slug",                 // default: slugify(title.uk)
 *   "date": "2026-11-20",                    // YYYY-MM-DD
 *   "title":       { "uk": "...", "en": "..." },
 *   "description": { "uk": "...", "en": "..." },
 *   "content":     { "uk": ["para", "..."], "en": ["para", "..."] },
 *   "links": [ { "url": "...", "type": "external|video", "label": {"uk":"","en":""} } ],
 *   "image":   "/abs/path/cover.jpg",        // optional cover -> news.image
 *   "image_focus": "center",                 // optional
 *   "gallery": ["/abs/path/a.jpg", "..."]    // same pipeline as admin GalleryEditor:
 * }                                          //   photos doc created, inGallery stays FALSE
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { MongoClient, ObjectId } from 'mongodb';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function loadEnv() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) throw new Error('.env.local not found');
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}
loadEnv();

const DB_NAME = process.env.MONGODB_DB || 'mercy_health';
const { AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, MONGODB_URI } = process.env;
if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
if (!AWS_REGION || !AWS_S3_BUCKET) throw new Error('AWS_REGION / AWS_S3_BUCKET missing');

const s3 = new S3Client({ region: AWS_REGION, credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY } });
const s3Url = (key) => `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

const UK = { а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',и:'y',і:'i',ї:'yi',й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ю:'yu',я:'ya' };
function slugify(text, fallback = 'news-item') {
  const out = (text || '').toLowerCase().trim()
    .replace(/[ьъ']/g, '')
    .replace(/[а-яґєіїюя]/g, (ch) => UK[ch] || ch)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return out || fallback;
}

function parseArgs(argv) {
  const args = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--spec') args.spec = argv[++i];
    else if (argv[i] === '--rollback') args.rollback = argv[++i];
    else if (argv[i] === '--dry-run') args.dryRun = true;
  }
  return args;
}

async function compress(buf, mime) {
  if (!mime.startsWith('image/')) return { buffer: buf, mime };
  try {
    const sharp = (await import('sharp')).default;
    const meta = await sharp(buf).metadata();
    const width = Math.min(meta.width ?? 2400, 2400);
    const quality = buf.length > 1024 * 1024 ? 80 : 85;
    const out = await sharp(buf).resize(width, undefined, { withoutEnlargement: true, fit: 'inside' }).webp({ quality }).toBuffer();
    if (out.length < buf.length) return { buffer: out, mime: 'image/webp' };
    return { buffer: buf, mime };
  } catch {
    return { buffer: buf, mime };
  }
}

const MIME_BY_EXT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif', '.heic': 'image/heic' };

async function uploadOne(db, filePath, title, dryRun) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`file not found: ${abs}`);
  const original = fs.readFileSync(abs);
  const mimeIn = MIME_BY_EXT[path.extname(abs).toLowerCase()] || 'image/jpeg';
  const { buffer, mime } = await compress(original, mimeIn);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');

  const existing = await db.collection('photos').findOne({ hash });
  if (existing) return { url: existing.url, _id: existing._id, title: existing.title, dedup: true, hash };

  const ext = mime === 'image/webp' ? 'webp' : path.extname(abs).slice(1);
  const key = `uploads/${hash.slice(0, 16)}.${ext}`;
  const url = s3Url(key);
  if (dryRun) return { url, key, hash, size: buffer.length, mime, dedup: false, dryRun: true };

  await s3.send(new PutObjectCommand({ Bucket: AWS_S3_BUCKET, Key: key, Body: buffer, ContentType: mime, CacheControl: 'public, max-age=31536000, immutable' }));
  const max = await db.collection('photos').findOne({}, { sort: { order: -1 }, projection: { order: 1 } });
  const doc = {
    title: title || path.basename(abs),
    url, alt: title || '', description: '', hash, s3Key: key, mime, size: buffer.length,
    order: (max?.order ?? -1) + 1,
    visible: true,
    inGallery: false,           // gallery membership is manual only
    uploadedAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
  };
  const res = await db.collection('photos').insertOne(doc);
  return { ...doc, _id: res.insertedId };
}

async function addNews(args) {
  if (!args.spec) throw new Error('--spec required');
  const spec = JSON.parse(fs.readFileSync(args.spec, 'utf8'));
  for (const k of ['date', 'title', 'description', 'content']) if (!spec[k]) throw new Error(`spec.${k} missing`);
  const slug = spec.slug || slugify(spec.title.uk || spec.title.en);

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  try {
    const clash = await db.collection('news').findOne({ $or: [{ slug }, { id: slug }] });
    if (clash) throw new Error(`news with slug "${slug}" already exists (_id ${clash._id})`);

    const created = [];
    let image = spec.image || '';
    if (spec.image) {
      const up = await uploadOne(db, spec.image, null, args.dryRun);
      image = up.url; created.push(up);
    }
    const gallery = [];
    for (const g of spec.gallery || []) {
      const up = await uploadOne(db, g, null, args.dryRun);
      gallery.push(up.url); created.push(up);
    }

    const doc = {
      id: slug, slug, date: spec.date,
      image,
      ...(spec.image_focus ? { image_focus: spec.image_focus } : {}),
      title: { uk: spec.title.uk || '', en: spec.title.en || '' },
      description: { uk: spec.description.uk || '', en: spec.description.en || '' },
      content: { uk: spec.content.uk || [], en: spec.content.en || [] },
      gallery,
      links: (spec.links || []).filter((l) => l.url),
      order: Date.now(), createdAt: new Date(), updatedAt: new Date(),
    };

    console.log(JSON.stringify({ slug, image, galleryCount: gallery.length, photos: created.map((c) => ({ _id: String(c._id), dedup: !!c.dedup, title: c.title })) }, null, 2));

    if (args.dryRun) { console.log('DRY RUN — nothing written'); return; }
    const res = await db.collection('news').insertOne(doc);
    console.log(`INSERTED news _id=${res.insertedId}`);
    console.log(`URL: /uk/news/${slug}  |  /en/news/${slug}`);
  } finally {
    await client.close();
  }
}

async function rollback(args) {
  const key = args.rollback;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  try {
    const query = ObjectId.isValid(key) ? { $or: [{ _id: new ObjectId(key) }, { slug: key }] } : { $or: [{ slug: key }, { id: key }] };
    const news = await db.collection('news').findOne(query);
    if (!news) throw new Error(`news not found: ${key}`);

    const urls = [news.image, ...(news.gallery || [])].filter(Boolean);
    const photos = await db.collection('photos').find({ url: { $in: urls } }).toArray();
    for (const p of photos) {
      if (p.s3Key) await s3.send(new DeleteObjectCommand({ Bucket: AWS_S3_BUCKET, Key: p.s3Key })).catch((e) => console.warn('s3 delete failed', p.s3Key, e.message));
    }
    const dp = await db.collection('photos').deleteMany({ url: { $in: urls } });
    await db.collection('news').deleteOne({ _id: news._id });
    console.log(`deleted news ${news._id} (${news.slug}); photos deleted: ${dp.deletedCount}; s3 objects: ${photos.length}`);
  } finally {
    await client.close();
  }
}

const args = parseArgs(process.argv.slice(2));
(async () => {
  if (args.rollback) await rollback(args);
  else await addNews(args);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
