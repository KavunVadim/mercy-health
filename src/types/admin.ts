export type LocalizedField = { uk: string; en: string };

export interface AdminLink {
  url: string;
  type?: 'video' | 'external';
  label?: LocalizedField;
}

export interface AdminNews {
  _id?: string;
  id: string;
  title?: LocalizedField;
  description?: LocalizedField;
  content?: { uk: string[]; en: string[] };
  date?: string;
  image?: string;
  image_focus?: string;
  gallery?: string[];
  links?: AdminLink[];
}

export interface AdminProject {
  _id?: string;
  id: string;
  title?: LocalizedField;
  description?: LocalizedField;
  full_description?: LocalizedField;
  image?: string;
  image_focus?: string;
  gallery?: string[];
  status?: string;
  links?: AdminLink[];
}

export interface AdminPartner {
  _id?: string;
  id: string;
  name?: LocalizedField;
  logo?: string;
  url?: string;
  category?: string;
}

export interface AdminReport {
  id: string;
  title?: LocalizedField;
  period?: string;
  year?: number;
  date?: string;
  url?: string;
  pdf_url?: string;
  total_collected?: number;
  donations_count?: number;
  summary?: LocalizedField;
  stats?: {
    raised?: number;
    spent?: number;
    projects_count?: number;
  };
}

export interface AdminSlide {
  id: string;
  _id?: string;
  order?: number;
  badge_uk: string;
  badge_en: string;
  title_uk: string;
  title_en: string;
  description_uk: string;
  description_en: string;
  image: string;
  href: string;
  focus: string;
  cta_uk: string;
  cta_en: string;
}

export interface AdminPhoto {
  _id: string;
  title: string;
  url: string;
  alt?: string;
  hash?: string;
  size?: number;
  visible?: boolean;
  inGallery?: boolean;
}
