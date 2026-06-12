import type { ComponentType, CSSProperties } from "react";

export type Localized<T = string> = {
  uk: T;
  en: T;
};

export interface LinkItem {
  url: string;
  label?: { uk: string; en: string };
  type?: 'video' | 'external';
}

export interface Project {
  id: string;
  title: string;
  image: string;
  short_description?: string;
  full_description?: string;
  description?: string;
  gallery?: string[];
  links?: LinkItem[];
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  image_focus?: string;
  content?: string[];
  gallery?: string[];
  video_link?: string;
  video_label?: string | Partial<Localized>;
  link?: string;
  external_link?: string;
  link_label?: string | Partial<Localized>;
  links?: LinkItem[];
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface Report {
  id: string;
  title: string;
  period: string;
  year: number;
  date: string;
  url: string;
  pdf_url?: string;
  total_collected: number;
  donations_count: number;
  summary?: string;
  stats?: {
    raised: number;
    spent: number;
    projects_count: number;
  };
}

export interface ReportDocument {
  id: string;
  title: string;
  url: string;
}

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  href: string;
  focus?: string;
}

export interface PaymentItem {
  label: string;
  value: string;
  id: string;
  extra?: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

export interface PaymentTab {
  id: "ua" | "intl" | "crypto";
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

export type CustomProperties = CSSProperties & {
  "--hover-color"?: string;
};

export interface Dictionary {
  common: {
    site_name: string;
  };
  metadata: {
    title: string;
    description: string;
  };
  navigation: {
    about: string;
    projects: string;
    materials: string;
    reports: string;
    contacts: string;
    support: string;
    home: string;
    rehab: string;
    medical_aid: string;
    news?: string;
    privacy: string;
  };
  hero: {
    description: string;
  };
  hero_slider: HeroSlide[];
  projects: {
    title: string;
    more: string;
    support: string;
    support_project: string;
    gallery_title: string;
    photo: string;
    zoom: string;
    items: Project[];
  };
  stats: {
    collected_value: string;
    helped_value: string;
    donors_value: string;
    items: {
      collected: string;
      helped: string;
      donors: string;
    };
  };
  news: {
    title: string;
    more: string;
    items: NewsItem[];
    no_articles: string;
    video_story: string;
    gallery_title: string;
    tabs: {
      news: string;
      gallery: string;
    };
    gallery: {
      title: string;
      description: string;
      images: string[];
    };
  };
  about: {
    title: string;
    tabs: {
      about_us: string;
      partners: string;
      contacts: string;
    };
    sidebar: {
      who_we_are: string;
      path_of_mercy?: string;
      mission: string;
      media: string;
    };
    history: {
      title: string;
      content: string;
      images?: string[];
    };
    gallery_title: string;
    hero_images?: string[];
    hero_image?: string;
    patches_image?: string;
    mission: {
      title: string;
      content: string;
    };
    media: {
      title: string;
      content: string;
    };
    contacts_tab: {
      title: string;
      labels: {
        phone: string;
        email: string;
        address: string;
      };
      form: {
        name: string;
        name_placeholder: string;
        email: string;
        message: string;
        message_placeholder: string;
        submit: string;
      };
    };
    partners_description: string;
  };
  partners: Partner[];
  footer: {
    social_links: {
      facebook?: string;
      instagram?: string;
      instagram_rehab?: string;
      tiktok?: string;
      telegram?: string;
      linkedin?: string;
    };
    columns: {
      foundation: string;
      projects: string;
      socials: string;
      contacts: string;
      legal: string;
    };
    foundation_phone: string;
    foundation_email?: string;
    address_foundation: string;
    rights: string;
  };
  reports: {
    title: string;
    description: string;
    history: string;
    transparency: string;
    summary: {
      total_collected: string;
      donations_count: string;
      avg_donation: string;
    };
    reports: Report[];
    documents?: ReportDocument[];
  };
  support: {
    title: string;
    tabs: {
      once: string;
      requisites: string;
    };
    bank_details: {
      beneficiary: string;
      beneficiary_value: string;
      edrpou: string;
      edrpou_value: string;
      bank_name: string;
      bank_name_value: string;
      purpose: string;
      purpose_value: string;
      copied: string;
      copy: string;
      tabs: Record<"ua" | "intl" | "crypto", string>;
      accounts: Record<string, string>;
    };
    cards: {
      monobank: string;
      privatbank: string;
      details: string;
      items: Array<{
        id: string;
        title: string;
        description: string;
        bank: string;
        link: string;
        icon?: string;
        image?: string;
      }>;
    };
  };
  share?: {
    title: string;
    copy: string;
    copied: string;
    share_on: string;
    facebook: string;
    telegram: string;
    whatsapp: string;
    x: string;
  };
}
