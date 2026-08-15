import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, setContent } from '@/lib/content-db';
import { slugify } from '@/lib/data-utils';

interface SlideData {
  id: string;
  badge?: string;
  title?: string;
  description?: string;
  image?: string;
  cta?: string;
  href?: string;
  focus?: string;
}

interface ContentDoc {
  hero_slider?: SlideData[];
}

export async function GET() {
  try {
    const [ukDoc, enDoc] = await Promise.all([getContent<ContentDoc>('uk'), getContent<ContentDoc>('en')]);

    const ukItems = ukDoc.hero_slider || [];
    const enItems = enDoc.hero_slider || [];

    const merged = ukItems.map((ukItem) => {
      const enItem = enItems.find((e) => e.id === ukItem.id);
      return {
        id: ukItem.id,
        image: ukItem.image || '',
        href: ukItem.href || '',
        focus: ukItem.focus || '',
        badge_uk: ukItem.badge || '',
        badge_en: enItem?.badge || '',
        title_uk: ukItem.title || '',
        title_en: enItem?.title || '',
        description_uk: ukItem.description || '',
        description_en: enItem?.description || '',
        cta_uk: ukItem.cta || '',
        cta_en: enItem?.cta || '',
      };
    });

    return NextResponse.json(merged);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || slugify(body.title_uk || body.title_en || 'hero-slide');

    const [ukDoc, enDoc] = await Promise.all([getContent<ContentDoc>('uk'), getContent<ContentDoc>('en')]);

    const ukSlides = ukDoc.hero_slider || [];
    const enSlides = enDoc.hero_slider || [];

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

    revalidatePath('/uk');
    revalidatePath('/en');

    return NextResponse.json({ ...body, id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids[] required' }, { status: 400 });
    }

    const [ukDoc, enDoc] = await Promise.all([getContent<ContentDoc>('uk'), getContent<ContentDoc>('en')]);
    const ukSlides = ukDoc.hero_slider || [];
    const enSlides = enDoc.hero_slider || [];

    const reorderSlides = (slides: SlideData[]): SlideData[] => {
      const map = new Map(slides.map(s => [s.id, s]));
      return ids.map((id: string) => map.get(id)).filter(Boolean) as SlideData[];
    };

    await Promise.all([
      setContent('uk', { ...ukDoc, hero_slider: reorderSlides(ukSlides) }),
      setContent('en', { ...enDoc, hero_slider: reorderSlides(enSlides) }),
    ]);

    revalidatePath('/uk');
    revalidatePath('/en');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to reorder hero slides' }, { status: 500 });
  }
}
