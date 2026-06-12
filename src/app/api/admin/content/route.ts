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

    const ukUpdate = {
      ...ukDoc,
      about: {
        history: { title: body.about_history_title_uk || '', content: body.about_history_content_uk || '', images: body.about_history_images || [] },
        mission: { title: body.about_mission_title_uk || '', content: body.about_mission_content_uk || '' },
        media: { title: body.about_media_title_uk || '', content: body.about_media_content_uk || '' },
        hero_images: body.about_hero_images || [],
        hero_image: body.about_hero_image || '',
        patches_image: body.about_patches_image || '',
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
        history: { title: body.about_history_title_en || '', content: body.about_history_content_en || '', images: body.about_history_images || [] },
        mission: { title: body.about_mission_title_en || '', content: body.about_mission_content_en || '' },
        media: { title: body.about_media_title_en || '', content: body.about_media_content_en || '' },
        hero_images: body.about_hero_images || [],
        hero_image: body.about_hero_image || '',
        patches_image: body.about_patches_image || '',
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
