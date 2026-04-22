# Data Schema

All content is stored in JSON files in the `/data/` directory.
These act as the site's content database — editable without touching code.

---

## Files Overview

| File              | Purpose                          |
| ----------------- | -------------------------------- |
| `content.uk.json` | All Ukrainian text content       |
| `content.en.json` | All English text content         |
| `projects.json`   | Fundraising campaigns / projects |
| `team.json`       | Team members (fund + center)     |
| `partners.json`   | Partner organizations            |
| `reports.json`    | Annual/financial reports         |
| `branches.json`   | Rehabilitation center branches   |

---

## content.{locale}.json Structure

```json
{
  "site": {
    "name": "Благодійний фонд «Милосердя та здоров'я»",
    "tagline": "Разом для перемоги",
    "description": "Ми допомагаємо армії та цивільному населенню...",
    "phone_fund": "093-351-62-00",
    "phone_center": "096-145-11-55",
    "email": "info@fond.specter-it.site",
    "address": "м. Вінниця, вул. ...",
    "social": {
      "facebook": "https://facebook.com/...",
      "instagram": "https://instagram.com/...",
      "telegram": "https://t.me/..."
    }
  },
  "nav": {
    "fund": "Благодійний фонд",
    "center": "Центр реабілітації",
    "about": "Про нас",
    "projects": "Проєкти",
    "reports": "Звіти",
    "partners": "Партнери",
    "contacts": "Контакти",
    "donate": "Допомогти",
    "language": "UA"
  },
  "hero": {
    "headline": "Підтримуємо тих, хто захищає Україну",
    "subheadline": "Допомога армії, реабілітація ветеранів, підтримка громад",
    "cta_primary": "Допомогти зараз",
    "cta_secondary": "Дізнатись більше",
    "scroll_hint": "Гортайте вниз"
  },
  "stats": {
    "title": "Наш вплив у цифрах",
    "items": [
      { "label": "Допомог надано", "value": 15000, "suffix": "+" },
      { "label": "Партнерів", "value": 120, "suffix": "+" },
      { "label": "Регіонів охоплено", "value": 18, "suffix": "" },
      { "label": "Волонтерів", "value": 350, "suffix": "+" }
    ]
  },
  "projects_section": {
    "title": "Поточні збори та проєкти",
    "subtitle": "Ваша підтримка рятує життя",
    "view_all": "Всі проєкти",
    "filters": {
      "all": "Усі",
      "hospitals": "Лікарні",
      "vehicles": "Авто",
      "drones": "Дрони",
      "medical": "Медтехніка",
      "social": "Соціальні"
    },
    "card": {
      "raised": "Зібрано",
      "goal": "Ціль",
      "donate_btn": "Підтримати"
    }
  },
  "how_to_help": {
    "title": "Як допомогти",
    "subtitle": "Оберіть зручний спосіб для переказу коштів",
    "methods": [
      {
        "id": "bank",
        "icon": "building-2",
        "title": "Банківський переказ",
        "description": "Переказ на рахунок фонду через будь-який банк України",
        "details": "IBAN: UA12 3456 7890 1234 5678 9012 34",
        "copy_label": "Скопіювати реквізити"
      },
      {
        "id": "mono",
        "icon": "credit-card",
        "title": "Monobank / ПриватБанк",
        "description": "Швидкий переказ через мобільні банки",
        "details": "4441 1111 2222 3333",
        "copy_label": "Скопіювати номер"
      },
      {
        "id": "paypal",
        "icon": "globe",
        "title": "Міжнародний переказ",
        "description": "PayPal та міжнародні перекази для донорів з-за кордону",
        "details": "info@fond.specter-it.site",
        "copy_label": "Скопіювати email"
      },
      {
        "id": "crypto",
        "icon": "bitcoin",
        "title": "Криптовалюта",
        "description": "USDT, BTC, ETH — для анонімних міжнародних переказів",
        "details": "0x1234...abcd",
        "copy_label": "Скопіювати адресу"
      }
    ]
  },
  "about_fund": {
    "title": "Про фонд",
    "history_title": "Наша історія",
    "history_text": "Благодійний фонд «Милосердя та здоров'я» було засновано...",
    "mission_title": "Місія",
    "mission_text": "Наша місія — комплексна підтримка захисників України...",
    "values": [
      {
        "icon": "shield",
        "title": "Надійність",
        "text": "Прозора звітність та відповідальне використання коштів"
      },
      {
        "icon": "users",
        "title": "Командність",
        "text": "Волонтери, партнери та донори — єдина команда"
      },
      {
        "icon": "heart",
        "title": "Турбота",
        "text": "Кожна допомога — це людська доля"
      }
    ]
  },
  "rehab_center": {
    "title": "Центр реабілітації",
    "subtitle": "Відновлення тіла і духу",
    "mission": "Психологічна та фізична реабілітація військових і їхніх родин",
    "services": [
      {
        "id": "psych",
        "icon": "brain",
        "title": "Психологічна допомога",
        "description": "Індивідуальні та групові сесії з досвідченими психологами"
      },
      {
        "id": "physical",
        "icon": "activity",
        "title": "Фізична реабілітація",
        "description": "Відновлення після поранень та фізичного виснаження"
      },
      {
        "id": "family",
        "icon": "users",
        "title": "Підтримка родин",
        "description": "Допомога сім'ям військовослужбовців"
      },
      {
        "id": "children",
        "icon": "star",
        "title": "Підтримка дітей",
        "description": "Робота з дітьми полеглих та поранених воїнів"
      }
    ],
    "mobile_groups": {
      "title": "Мобільні психологічні групи",
      "regions": [
        "Донецька область",
        "Запорізька область",
        "Харківська область",
        "Київська область"
      ]
    }
  },
  "reports": {
    "title": "Звіти та прозорість",
    "subtitle": "Ми відкриті та відповідальні перед донорами",
    "download": "Завантажити"
  },
  "partners": {
    "title": "Наші партнери",
    "subtitle": "Разом ми робимо більше"
  },
  "contacts": {
    "title": "Контакти",
    "fund_title": "Благодійний фонд",
    "center_title": "Центр реабілітації",
    "form_title": "Написати нам",
    "form_name": "Ваше ім'я",
    "form_email": "Email",
    "form_message": "Повідомлення",
    "form_submit": "Надіслати",
    "form_success": "Дякуємо! Ми зв'яжемося з вами найближчим часом."
  },
  "footer": {
    "tagline": "Разом для перемоги України",
    "copyright": "© 2024 Благодійний фонд «Милосердя та здоров'я». Всі права захищені.",
    "privacy": "Політика конфіденційності",
    "terms": "Умови використання"
  }
}
```

---

## projects.json Structure

```json
{
  "projects": [
    {
      "id": "pickup-01",
      "slug": "pikap-dlya-73-brigady",
      "category": "vehicles",
      "subcategory": "pickups",
      "status": "active",
      "priority": 1,
      "featured": true,
      "image": "/images/projects/pickup-01.jpg",
      "title": {
        "uk": "Пікап для 73-ї бригади",
        "en": "Pickup Truck for 73rd Brigade"
      },
      "description": {
        "uk": "Збір на закупівлю пікапу для евакуації поранених та логістики на передовій...",
        "en": "Fundraising for a pickup truck for wounded evacuation and front-line logistics..."
      },
      "goal": 850000,
      "raised": 612000,
      "currency": "UAH",
      "donors_count": 342,
      "created_at": "2024-10-01",
      "deadline": "2024-12-31",
      "unit": "one",
      "bank_details": {
        "iban": "UA12 3456 7890 1234 5678 9012 34",
        "purpose": "На пікап для 73-ї бригади"
      },
      "updates": [
        {
          "date": "2024-11-15",
          "text": {
            "uk": "Зібрано 70% від необхідної суми!",
            "en": "70% collected!"
          }
        }
      ]
    },
    {
      "id": "hospital-01",
      "slug": "hospital-vinnytsia-equipment",
      "category": "hospitals",
      "subcategory": null,
      "status": "active",
      "priority": 2,
      "featured": true,
      "image": "/images/projects/hospital-01.jpg",
      "title": {
        "uk": "Обладнання для військового госпіталю",
        "en": "Equipment for Military Hospital"
      },
      "description": {
        "uk": "Купівля медичного обладнання для стабілізаційних пунктів...",
        "en": "Purchasing medical equipment for stabilization points..."
      },
      "goal": 500000,
      "raised": 500000,
      "currency": "UAH",
      "donors_count": 890,
      "status": "completed",
      "created_at": "2024-08-01",
      "deadline": "2024-10-01"
    },
    {
      "id": "drone-01",
      "slug": "drony-fpv-paketnyi",
      "category": "drones",
      "subcategory": "fpv",
      "status": "active",
      "priority": 3,
      "featured": true,
      "image": "/images/projects/drones-01.jpg",
      "title": {
        "uk": "FPV-дрони — пакетний збір",
        "en": "FPV Drones — Batch Collection"
      },
      "description": {
        "uk": "Регулярний збір на закупівлю FPV-дронів для розвідки та ударних операцій...",
        "en": "Regular fundraising for FPV drones for reconnaissance and strike operations..."
      },
      "goal": 300000,
      "raised": 187000,
      "currency": "UAH",
      "donors_count": 521,
      "created_at": "2024-09-15",
      "deadline": null
    },
    {
      "id": "reb-01",
      "slug": "reb-systemy",
      "category": "drones",
      "subcategory": "reb",
      "status": "active",
      "priority": 4,
      "featured": false,
      "image": "/images/projects/reb-01.jpg",
      "title": {
        "uk": "Системи РЕБ (радіоелектронна боротьба)",
        "en": "Electronic Warfare Systems (EW)"
      },
      "description": {
        "uk": "Збір на закупівлю та доставку систем радіоелектронної боротьби...",
        "en": "Fundraising for procurement and delivery of electronic warfare systems..."
      },
      "goal": 1200000,
      "raised": 430000,
      "currency": "UAH",
      "donors_count": 215,
      "created_at": "2024-11-01",
      "deadline": null
    },
    {
      "id": "social-01",
      "slug": "dytbud-vinnytsia",
      "category": "social",
      "subcategory": "orphanages",
      "status": "active",
      "priority": 5,
      "featured": false,
      "image": "/images/projects/orphanage-01.jpg",
      "title": {
        "uk": "Підтримка дитячого будинку у Вінниці",
        "en": "Support for Vinnytsia Orphanage"
      },
      "description": {
        "uk": "Щомісячна допомога продуктами, одягом та іграшками для дітей-сиріт...",
        "en": "Monthly aid with food, clothing and toys for orphaned children..."
      },
      "goal": 50000,
      "raised": 38000,
      "currency": "UAH",
      "donors_count": 162,
      "created_at": "2024-01-01",
      "deadline": null,
      "recurring": true
    }
  ]
}
```

---

## team.json Structure

```json
{
  "fund_team": [
    {
      "id": "1",
      "name": { "uk": "Іван Петренко", "en": "Ivan Petrenko" },
      "role": { "uk": "Голова фонду", "en": "Fund Director" },
      "photo": "/images/team/ivan-petrenko.jpg",
      "bio": {
        "uk": "Волонтер з 2014 року...",
        "en": "Volunteer since 2014..."
      }
    }
  ],
  "center_team": [
    {
      "id": "c1",
      "name": { "uk": "Олена Коваль", "en": "Olena Koval" },
      "role": { "uk": "Провідний психолог", "en": "Lead Psychologist" },
      "photo": "/images/team/olena-koval.jpg",
      "specialization": {
        "uk": "ПТСР, кризова інтервенція",
        "en": "PTSD, Crisis Intervention"
      }
    }
  ]
}
```

---

## reports.json Structure

```json
{
  "reports": [
    {
      "id": "r2024-q3",
      "title": { "uk": "Звіт Q3 2024", "en": "Q3 2024 Report" },
      "period": "2024-Q3",
      "date": "2024-10-15",
      "pdf_url": "/reports/q3-2024.pdf",
      "summary": {
        "uk": "За третій квартал 2024 року фондом залучено та використано...",
        "en": "In Q3 2024, the foundation raised and utilized..."
      },
      "stats": {
        "raised": 2340000,
        "spent": 2180000,
        "projects_count": 23
      }
    }
  ]
}
```

---

## partners.json Structure

```json
{
  "partners": [
    {
      "id": "p1",
      "name": "USAID",
      "logo": "/images/partners/usaid.png",
      "url": "https://usaid.gov",
      "category": "international"
    },
    {
      "id": "p2",
      "name": "Фонд «Повернись живим»",
      "logo": "/images/partners/povernys.png",
      "url": "https://savelife.in.ua",
      "category": "local"
    }
  ]
}
```

---

## branches.json Structure

```json
{
  "branches": [
    {
      "id": "b1",
      "city": { "uk": "Вінниця (головний офіс)", "en": "Vinnytsia (HQ)" },
      "address": { "uk": "вул. Соборна, 1", "en": "1 Soborna St." },
      "phone": "096-145-11-55",
      "email": "vinnytsia@fond.specter-it.site",
      "coordinates": { "lat": 49.2331, "lng": 28.4682 },
      "is_main": true
    },
    {
      "id": "b2",
      "city": { "uk": "Старокостянтинів", "en": "Starokostiantyniv" },
      "address": { "uk": "вул. Незалежності, 5", "en": "5 Nezalezhnosti St." },
      "phone": null,
      "email": null,
      "coordinates": { "lat": 49.7548, "lng": 27.2186 },
      "is_main": false
    }
  ]
}
```
