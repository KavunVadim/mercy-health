import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/mongodb';

interface ContentFields {
  about?: {
    history?: { title?: string; content?: string; images?: string[] };
    mission?: { title?: string; content?: string };
    media?: { title?: string; content?: string };
    hero_images?: string[];
    hero_image?: string;
    patches_image?: string;
    story_eyebrow?: string;
    hero_year?: string;
    hero_stats?: Array<{ number: string; label: string }>;
    pull_quote?: string;
    timeline?: Array<{ year: string; label: string; text: string }>;
    honor?: {
      eyebrow?: string;
      big_number?: string;
      num_label?: string;
      tags?: string[];
      caption?: string;
      patch_alt?: string;
    };
    gallery_eyebrow?: string;
    gallery_captions?: string[];
  };
  support?: {
    cards?: { items?: unknown[]; monobank?: string; privatbank?: string; details?: string };
    bank_details?: {
      beneficiary_value?: string;
      edrpou_value?: string;
      bank_name_value?: string;
      purpose_value?: string;
      accounts?: Record<string, string> | null;
    };
  };
  stats?: { collected_value?: string; helped_value?: string; donors_value?: string };
  reports?: { documents?: unknown[] };
  hero?: { title?: string; description?: string };
  hero_slider?: unknown[];
}

async function getContent(locale: string): Promise<ContentFields> {
  const db = await getDb();
  const col = locale === 'uk' ? 'content_uk' : 'content_en';
  const doc = await db.collection(col).findOne<ContentFields>({ key: 'main' });
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

    return NextResponse.json({
      about_history_title_uk: ukDoc.about?.history?.title || '',
      about_history_title_en: enDoc.about?.history?.title || '',
      about_history_content_uk: ukDoc.about?.history?.content || '',
      about_history_content_en: enDoc.about?.history?.content || '',
      about_history_images: ukDoc.about?.history?.images || [],
      about_mission_title_uk: ukDoc.about?.mission?.title || '',
      about_mission_title_en: enDoc.about?.mission?.title || '',
      about_mission_content_uk: ukDoc.about?.mission?.content || '',
      about_mission_content_en: enDoc.about?.mission?.content || '',
      about_media_title_uk: ukDoc.about?.media?.title || '',
      about_media_title_en: enDoc.about?.media?.title || '',
      about_media_content_uk: ukDoc.about?.media?.content || '',
      about_media_content_en: enDoc.about?.media?.content || '',
      support_cards: ukDoc.support?.cards?.items || [],
      support_cards_en: enDoc.support?.cards?.items || [],
      card_label_monobank_uk: ukDoc.support?.cards?.monobank || '',
      card_label_monobank_en: enDoc.support?.cards?.monobank || '',
      card_label_privatbank_uk: ukDoc.support?.cards?.privatbank || '',
      card_label_privatbank_en: enDoc.support?.cards?.privatbank || '',
      card_label_details_uk: ukDoc.support?.cards?.details || '',
      card_label_details_en: enDoc.support?.cards?.details || '',
      beneficiary_value_uk: ukDoc.support?.bank_details?.beneficiary_value || '',
      beneficiary_value_en: enDoc.support?.bank_details?.beneficiary_value || '',
      edrpou_value: ukDoc.support?.bank_details?.edrpou_value || '',
      bank_name_value_uk: ukDoc.support?.bank_details?.bank_name_value || '',
      bank_name_value_en: enDoc.support?.bank_details?.bank_name_value || '',
      purpose_value_uk: ukDoc.support?.bank_details?.purpose_value || '',
      purpose_value_en: enDoc.support?.bank_details?.purpose_value || '',
      bank_accounts: ukDoc.support?.bank_details?.accounts || null,
      stats_collected: ukDoc.stats?.collected_value || '',
      stats_helped: ukDoc.stats?.helped_value || '',
      stats_donors: ukDoc.stats?.donors_value || '',
      documents: ukDoc.reports?.documents || [],
      about_hero_images: ukDoc.about?.hero_images || [],
      about_hero_image: ukDoc.about?.hero_image || '',
      about_patches_image: ukDoc.about?.patches_image || '',
      about_story_eyebrow_uk: ukDoc.about?.story_eyebrow || '',
      about_story_eyebrow_en: enDoc.about?.story_eyebrow || '',
      about_hero_year_uk: ukDoc.about?.hero_year || '',
      about_hero_year_en: enDoc.about?.hero_year || '',
      about_hero_stats_uk: ukDoc.about?.hero_stats || [],
      about_hero_stats_en: enDoc.about?.hero_stats || [],
      about_pull_quote_uk: ukDoc.about?.pull_quote || '',
      about_pull_quote_en: enDoc.about?.pull_quote || '',
      about_timeline_uk: ukDoc.about?.timeline || [],
      about_timeline_en: enDoc.about?.timeline || [],
      about_honor_uk: ukDoc.about?.honor || {},
      about_honor_en: enDoc.about?.honor || {},
      about_gallery_eyebrow_uk: ukDoc.about?.gallery_eyebrow || '',
      about_gallery_eyebrow_en: enDoc.about?.gallery_eyebrow || '',
      about_gallery_captions_uk: ukDoc.about?.gallery_captions || [],
      about_gallery_captions_en: enDoc.about?.gallery_captions || [],
      hero_title_uk: ukDoc.hero?.title || '',
      hero_title_en: enDoc.hero?.title || '',
      hero_description_uk: ukDoc.hero?.description || '',
      hero_description_en: enDoc.hero?.description || '',
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const [ukDoc, enDoc] = await Promise.all([getContent('uk'), getContent('en')]);

    let about_hero_stats_uk = body.about_hero_stats_uk;
    if (typeof about_hero_stats_uk === 'string') { try { about_hero_stats_uk = JSON.parse(about_hero_stats_uk); } catch { about_hero_stats_uk = []; } }
    let about_timeline_uk = body.about_timeline_uk;
    if (typeof about_timeline_uk === 'string') { try { about_timeline_uk = JSON.parse(about_timeline_uk); } catch { about_timeline_uk = []; } }
    let about_honor_uk = body.about_honor_uk;
    if (typeof about_honor_uk === 'string') { try { about_honor_uk = JSON.parse(about_honor_uk); } catch { about_honor_uk = {}; } }
    let about_gallery_captions_uk = body.about_gallery_captions_uk;
    if (typeof about_gallery_captions_uk === 'string') { try { about_gallery_captions_uk = JSON.parse(about_gallery_captions_uk); } catch { about_gallery_captions_uk = []; } }
    let about_hero_stats_en = body.about_hero_stats_en;
    if (typeof about_hero_stats_en === 'string') { try { about_hero_stats_en = JSON.parse(about_hero_stats_en); } catch { about_hero_stats_en = []; } }
    let about_timeline_en = body.about_timeline_en;
    if (typeof about_timeline_en === 'string') { try { about_timeline_en = JSON.parse(about_timeline_en); } catch { about_timeline_en = []; } }
    let about_honor_en = body.about_honor_en;
    if (typeof about_honor_en === 'string') { try { about_honor_en = JSON.parse(about_honor_en); } catch { about_honor_en = {}; } }
    let about_gallery_captions_en = body.about_gallery_captions_en;
    if (typeof about_gallery_captions_en === 'string') { try { about_gallery_captions_en = JSON.parse(about_gallery_captions_en); } catch { about_gallery_captions_en = []; } }

    const imagesUk = body.about_history_images !== undefined && body.about_history_images !== null
      ? body.about_history_images
      : (ukDoc.about?.history?.images || []);
    const imagesEn = body.about_history_images !== undefined && body.about_history_images !== null
      ? body.about_history_images
      : (enDoc.about?.history?.images || []);

    const ukUpdate = {
      ...ukDoc,
      about: {
        history: { title: body.about_history_title_uk || '', content: body.about_history_content_uk || '', images: imagesUk },
        mission: { title: body.about_mission_title_uk || '', content: body.about_mission_content_uk || '' },
        media: { title: body.about_media_title_uk || '', content: body.about_media_content_uk || '' },
        hero_images: body.about_hero_images || [],
        hero_image: body.about_hero_image || ukDoc.about?.hero_image || '',
        patches_image: body.about_patches_image || ukDoc.about?.patches_image || '',
        story_eyebrow: body.about_story_eyebrow_uk || '',
        hero_year: body.about_hero_year_uk || '',
        hero_stats: about_hero_stats_uk,
        pull_quote: body.about_pull_quote_uk || '',
        timeline: about_timeline_uk,
        honor: about_honor_uk,
        gallery_eyebrow: body.about_gallery_eyebrow_uk || '',
        gallery_captions: about_gallery_captions_uk,
      },
      support: {
        cards: {
          items: body.support_cards || [],
          ...(body.card_label_monobank_uk ? { monobank: body.card_label_monobank_uk } : {}),
          ...(body.card_label_privatbank_uk ? { privatbank: body.card_label_privatbank_uk } : {}),
          ...(body.card_label_details_uk ? { details: body.card_label_details_uk } : {}),
        },
        bank_details: {
          beneficiary_value: body.beneficiary_value_uk || '',
          edrpou_value: body.edrpou_value || '',
          bank_name_value: body.bank_name_value_uk || '',
          purpose_value: body.purpose_value_uk || '',
          accounts: body.bank_accounts || undefined,
        },
      },
      stats: { collected_value: body.stats_collected || '', helped_value: body.stats_helped || '', donors_value: body.stats_donors || '' },
      reports: { ...(ukDoc.reports || {}), documents: body.documents || [] },
      hero: { title: body.hero_title_uk || '', description: body.hero_description_uk || '' },
      updatedAt: new Date(),
    };

    const enUpdate = {
      ...enDoc,
      about: {
        history: { title: body.about_history_title_en || '', content: body.about_history_content_en || '', images: imagesEn },
        mission: { title: body.about_mission_title_en || '', content: body.about_mission_content_en || '' },
        media: { title: body.about_media_title_en || '', content: body.about_media_content_en || '' },
        hero_images: body.about_hero_images || [],
        hero_image: body.about_hero_image || enDoc.about?.hero_image || '',
        patches_image: body.about_patches_image || enDoc.about?.patches_image || '',
        story_eyebrow: body.about_story_eyebrow_en || '',
        hero_year: body.about_hero_year_en || '',
        hero_stats: about_hero_stats_en,
        pull_quote: body.about_pull_quote_en || '',
        timeline: about_timeline_en,
        honor: about_honor_en,
        gallery_eyebrow: body.about_gallery_eyebrow_en || '',
        gallery_captions: about_gallery_captions_en,
      },
      support: {
        cards: {
          items: body.support_cards_en || [],
          ...(body.card_label_monobank_en ? { monobank: body.card_label_monobank_en } : {}),
          ...(body.card_label_privatbank_en ? { privatbank: body.card_label_privatbank_en } : {}),
          ...(body.card_label_details_en ? { details: body.card_label_details_en } : {}),
        },
        bank_details: {
          beneficiary_value: body.beneficiary_value_en || '',
          edrpou_value: body.edrpou_value || '',
          bank_name_value: body.bank_name_value_en || '',
          purpose_value: body.purpose_value_en || '',
          accounts: body.bank_accounts || undefined,
        },
      },
      stats: { collected_value: body.stats_collected || '', helped_value: body.stats_helped || '', donors_value: body.stats_donors || '' },
      reports: { ...(enDoc.reports || {}), documents: body.documents || [] },
      hero: { title: body.hero_title_en || '', description: body.hero_description_en || '' },
      updatedAt: new Date(),
    };

    await Promise.all([
      setContent('uk', ukUpdate),
      setContent('en', enUpdate),
    ]);

    revalidatePath('/uk/support');
    revalidatePath('/en/support');
    revalidatePath('/uk/about');
    revalidatePath('/en/about');
    revalidatePath('/uk');
    revalidatePath('/en');

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
