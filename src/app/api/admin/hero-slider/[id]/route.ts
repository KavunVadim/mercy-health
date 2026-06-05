import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/mongodb';

async function getContent(locale: string): Promise<any> {
  const db = await getDb();
  const col = locale === 'uk' ? 'content_uk' : 'content_en';
  const doc = await db.collection(col).findOne({ key: 'main' });
  return doc || {};
}

async function setContent(locale: string, data: any) {
  const db = await getDb();
  const col = locale === 'uk' ? 'content_uk' : 'content_en';
  await db.collection(col).updateOne(
    { key: 'main' },
    { $set: { key: 'main', ...data, updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const [ukDoc, enDoc] = await Promise.all([getContent('uk'), getContent('en')]);

    let ukSlides = (ukDoc.hero_slider as Record<string, unknown>[]) || [];
    let enSlides = (enDoc.hero_slider as Record<string, unknown>[]) || [];

    const ukIdx = ukSlides.findIndex((s: any) => s.id === id);
    if (ukIdx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    ukSlides[ukIdx] = {
      ...ukSlides[ukIdx], id,
      badge: body.badge_uk ?? ukSlides[ukIdx].badge,
      title: body.title_uk ?? ukSlides[ukIdx].title,
      description: body.description_uk ?? ukSlides[ukIdx].description,
      image: body.image ?? ukSlides[ukIdx].image,
      cta: body.cta_uk ?? ukSlides[ukIdx].cta,
      href: body.href ?? ukSlides[ukIdx].href,
      focus: body.focus ?? ukSlides[ukIdx].focus,
    };

    const enIdx = enSlides.findIndex((s: any) => s.id === id);
    if (enIdx !== -1) {
      enSlides[enIdx] = {
        ...enSlides[enIdx], id,
        badge: body.badge_en ?? enSlides[enIdx].badge,
        title: body.title_en ?? enSlides[enIdx].title,
        description: body.description_en ?? enSlides[enIdx].description,
        image: body.image ?? enSlides[enIdx].image,
        cta: body.cta_en ?? enSlides[enIdx].cta,
        href: body.href ?? enSlides[enIdx].href,
        focus: body.focus ?? enSlides[enIdx].focus,
      };
    }

    await Promise.all([
      setContent('uk', { ...ukDoc, hero_slider: ukSlides }),
      setContent('en', { ...enDoc, hero_slider: enSlides }),
    ]);

    revalidateTag('dictionary', 'max');

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [ukDoc, enDoc] = await Promise.all([getContent('uk'), getContent('en')]);

    const ukSlides = ((ukDoc.hero_slider as any[]) || []).filter((s: any) => s.id !== id);
    const enSlides = ((enDoc.hero_slider as any[]) || []).filter((s: any) => s.id !== id);

    await Promise.all([
      setContent('uk', { ...ukDoc, hero_slider: ukSlides }),
      setContent('en', { ...enDoc, hero_slider: enSlides }),
    ]);

    revalidateTag('dictionary', 'max');

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  }
}
