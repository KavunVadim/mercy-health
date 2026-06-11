import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { uploadToS3, computeFileHash } from '@/lib/s3';

export const maxDuration = 60;

const MAX_FILE_SIZE = 15 * 1024 * 1024;

async function compressImage(buf: Buffer, mime: string): Promise<{ buffer: Buffer; mime: string }> {
  if (!mime.startsWith('image/')) return { buffer: buf, mime };

  try {
    const sharp = (await import('sharp')).default;
    const image = sharp(buf);
    const metadata = await image.metadata();

    const width = Math.min(metadata.width ?? 2400, 2400);
    const quality = buf.length > 1024 * 1024 ? 80 : 85;

    const compressed = await image
      .resize(width, undefined, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality })
      .toBuffer();

    if (compressed.length < buf.length) {
      return { buffer: compressed, mime: 'image/webp' };
    }
    return { buffer: buf, mime };
  } catch {
    return { buffer: buf, mime };
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Файл занадто великий. Максимальний розмір — 15 МБ.' },
        { status: 413 },
      );
    }

    let imageBuffer: Buffer = Buffer.from(await file.arrayBuffer());
    let mime = file.type || 'image/webp';

    const compressed = await compressImage(imageBuffer, mime);
    imageBuffer = compressed.buffer;
    mime = compressed.mime;

    const hash = computeFileHash(imageBuffer);

    const db = await getDb();

    const existing = await db.collection('photos').findOne({ hash });
    if (existing) {
      return NextResponse.json({
        url: existing.url,
        _id: existing._id,
        title: existing.title,
        alt: existing.alt || '',
        hash,
        dedup: true,
      });
    }

    const ext = mime === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'webp');
    const key = `uploads/${hash.slice(0, 16)}.${ext}`;

    const url = await uploadToS3(imageBuffer, key, mime);
    const s3Key: string | undefined = key;

    const maxOrder = await db.collection('photos').findOne({}, { sort: { order: -1 }, projection: { order: 1 } });
    const doc = {
      title: title || file.name || 'Untitled',
      url,
      alt: title || '',
      description: '',
      hash,
      s3Key,
      mime,
      size: imageBuffer.length,
      order: (maxOrder?.order ?? -1) + 1,
      visible: true,
      inGallery: false,
      uploadedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('photos').insertOne(doc);

    revalidateTag('dictionary', { expire: 0 });

    return NextResponse.json({ ...doc, _id: result.insertedId, dedup: false }, { status: 201 });
  } catch (e: any) {
    console.error('Upload failed:', e);
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
