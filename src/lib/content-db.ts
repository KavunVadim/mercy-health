import { getDb } from '@/lib/mongodb';

export async function getContent<T = Record<string, unknown>>(locale: string): Promise<T> {
  const db = await getDb();
  const col = locale === 'uk' ? 'content_uk' : 'content_en';
  const doc = await db.collection(col).findOne<T>({ key: 'main' });
  return doc || ({} as T);
}

export async function setContent(locale: string, data: Record<string, unknown>) {
  const db = await getDb();
  const col = locale === 'uk' ? 'content_uk' : 'content_en';
  await db.collection(col).updateOne(
    { key: 'main' },
    { $set: { key: 'main', ...data, updatedAt: new Date() } },
    { upsert: true }
  );
}
