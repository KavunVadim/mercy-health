import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { slugify } from '@/lib/data-utils';

async function getContent(locale: string): Promise<any> {
  const db = await getDb();
  const col = locale === 'uk' ? 'content_uk' : 'content_en';
  const doc = await db.collection(col).findOne({ key: 'main' });
  return doc || {};
}

async function setContent(locale: string, data: Record<string, unknown>) {
  const db = await getDb();
  const col = locale === 'uk' ? 'content_uk' : 'content_en';
  await db.collection(col).updateOne(
    { key: 'main' },
    { $set: { key: 'main', ...data, updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function GET() {
  try {
    const [ukDoc, enDoc] = await Promise.all([getContent('uk'), getContent('en')]);

    const ukItems = (ukDoc.hero_slider as Record<string, unknown>[]) || [];
    const enItems = (enDoc.hero_slider as Record<string, unknown>[]) || [];

    const merged = ukItems.map((ukItem) => {
      const enItem = enItems.find((e: any) => e.id === ukItem.id) || {};
      return {
        id: ukItem.id,
        image: ukItem.image || '',
        href: ukItem.href || '',
        focus: ukItem.focus || '',
        badge_uk: ukItem.badge || '',
        badge_en: enItem.badge || '',
        title_uk: ukItem.title || '',
        title_en: enItem.title || '',
        description_uk: ukItem.description || '',
        description_en: enItem.description || '',
        cta_uk: ukItem.cta || '',
        cta_en: enItem.cta || '',
      };
    });

    return NextResponse.json(merged);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || slugify(body.title_uk || body.title_en || 'hero-slide');

    const [ukDoc, enDoc] = await Promise.all([getContent('uk'), getContent('en')]);

    const ukSlides = (ukDoc.hero_slider as Record<string, unknown>[]) || [];
    const enSlides = (enDoc.hero_slider as Record<string, unknown>[]) || [];

    ukSlides.unshift({
      id, badge: body.badge_uk || '', title: body.title_uk || '',
      description: body.description_uk || '', image: body.image || '',
      cta: body.cta_uk || '', href: body.href || '', focus: body.focus || '',
    });

    enSlides.unshift({
      id, badge: body.badge_en || '', title: body.title_en || '',
      description: body.description_en || '', image: body.image || '',
      cta: body.cta_en || '', href: body.href || '', focus: body.focus || '',
    });

    await Promise.all([
      setContent('uk', { ...ukDoc, hero_slider: ukSlides }),
      setContent('en', { ...enDoc, hero_slider: enSlides }),
    ]);

    return NextResponse.json({ ...body, id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids[] required' }, { status: 400 });
    }

    const [ukDoc, enDoc] = await Promise.all([getContent('uk'), getContent('en')]);
    const ukSlides = (ukDoc.hero_slider as Record<string, unknown>[]) || [];
    const enSlides = (enDoc.hero_slider as Record<string, unknown>[]) || [];

    const reorderSlides = (slides: Record<string, unknown>[]) => {
      const map = new Map(slides.map(s => [s.id, s]));
      return ids.map(id => map.get(id)).filter(Boolean) as Record<string, unknown>[];
    };

    await Promise.all([
      setContent('uk', { ...ukDoc, hero_slider: reorderSlides(ukSlides) }),
      setContent('en', { ...enDoc, hero_slider: reorderSlides(enSlides) }),
    ]);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to reorder hero slides' }, { status: 500 });
  }
}
