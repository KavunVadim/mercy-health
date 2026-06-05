import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/mongodb';
import { uploadToS3, computeFileHash } from '@/lib/s3';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = computeFileHash(buffer);
    const mime = file.type || 'image/webp';

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

    const ext = file.name.split('.').pop() || 'webp';
    const key = `uploads/${hash.slice(0, 16)}.${ext}`;
    const url = await uploadToS3(buffer, key, mime);

    const maxOrder = await db.collection('photos').findOne({}, { sort: { order: -1 }, projection: { order: 1 } });
    const doc = {
      title: title || file.name || 'Untitled',
      url,
      alt: title || '',
      description: '',
      hash,
      s3Key: key,
      mime,
      size: buffer.length,
      order: (maxOrder?.order ?? -1) + 1,
      visible: true,
      inGallery: false,
      uploadedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('photos').insertOne(doc);

    revalidateTag('dictionary', 'max');

    return NextResponse.json({ ...doc, _id: result.insertedId, dedup: false }, { status: 201 });
  } catch (e: any) {
    console.error('Upload failed:', e);
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
