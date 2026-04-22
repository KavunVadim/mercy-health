# Master Prompt — Благодійний фонд «Милосердя та здоров'я» Redesign

---

## ГОЛОВНИЙ КОНТЕКСТ (вставляй на початку кожної сесії в Abacus)

```
Ти — Senior Full-Stack Developer та UI/UX Designer.

## Завдання
Переробити сайт благодійного фонду під новий дизайн:
- ЗВІДКИ БЕРЕМО КОНТЕНТ: https://fond.specter-it.site (тексти, фото, структура)
- РЕФЕРЕНС ДИЗАЙНУ: https://savelife.in.ua (стиль, layout, компоненти)
- Результат: Next.js сайт у стилі savelife, але з контентом Милосердя та здоров'я і блакитним акцентом

## Логотип та кольори
Логотип — голуб. Основний колір: небесно-синій #4A9ECC.
Адаптуємо темну палітру savelife.in.ua, замінюємо їх зелений на наш блакитний #4A9ECC.
Кнопка "Допомогти" — яскраво-червоний #E8401C (як на savelife).

## Стек
- Next.js 14 App Router + TypeScript
- Tailwind CSS (кастомні кольори в tailwind.config)
- next-intl (uk за замовчуванням, en — /en/...)
- Framer Motion (анімації)
- Lucide React (іконки)

## Правила
1. TypeScript строго, без any
2. Всі тексти через useTranslations() — НЕ хардкод у JSX
3. Всі картинки через next/image з alt
4. Mobile-first, адаптивний
5. aria-label на інтерактивних елементах

## Дані
- /data/content.uk.json та content.en.json — всі тексти
- /data/projects.json — проєкти/збори
- /data/team.json — команда
- /data/partners-reports-branches.json — партнери, звіти, філіали
- messages/uk.json та en.json — для next-intl

## Поточний крок
[ВКАЗАТИ ФАЗУ — наприклад: Phase 1 — Setup]
```

---

## Phase Prompts (використовуй для кожного кроку)

### Phase 1 — Setup

```
Виконай Phase 1: ініціалізація проєкту.

1. npx create-next-app@latest --typescript --tailwind --app charity-fund
2. npm install next-intl framer-motion lucide-react clsx react-countup
3. tailwind.config.ts — додай кастомні кольори:
   colors: {
     accent: { DEFAULT:'#4A9ECC', dark:'#2E7DA8', light:'#7BBFE0' },
     donate: { DEFAULT:'#E8401C', hover:'#C9340F' },
     bg: { hero:'#0A0F1E', dark:'#111827', mid:'#1A2744', light:'#F0F4F8' },
   }
4. globals.css — CSS змінні для всіх кольорів з DESIGN.md
5. next.config.js — next-intl plugin + i18n routing (uk default, en)
6. src/i18n.ts + middleware.ts — налаштування next-intl
7. Структура папок як в CLAUDE.md
8. Перевір: npm run dev запускається без помилок

Після цього покажи що зроблено.
```

### Phase 2 — Header & Footer

```
Виконай Phase 2: Header та Footer.

HEADER (sticky, 2-рядкова структура як savelife.in.ua):

Рядок 1 (тонкий ~36px):
- Ліворуч: "Благодійний фонд: 093-351-62-00" | "Центр реабілітації: 096-145-11-55"
- Праворуч: перемикач UA / EN (з next-intl)
- bg: трохи темніший ніж основний навбар
- text-xs text-[#9BAAC4]

Рядок 2 (основний ~72px):
- Ліворуч: Logo (голуб SVG + назва "Благодійний фонд Милосердя та здоров'я")
- Центр: дві групи посилань — "Благодійний фонд ▼" | "Центр реабілітації ▼"
  (dropdown меню з підпунктами при hover)
- Праворуч: кнопка "Допомогти" bg-[#E8401C] text-white uppercase
- bg: rgba(10,15,30,0.97) backdrop-blur-md
- border-bottom: 1px solid rgba(74,158,204,0.12)

Мобільний хедер:
- Logo + hamburger кнопка
- Full-screen drawer меню з анімацією (Framer Motion)
- Телефони + мовний перемикач всередині

FOOTER:
- bg-[#0A0F1E] border-t-2 border-[rgba(74,158,204,0.3)]
- 4 колонки: Благодійний фонд | Центр реабілітації | Інформація | Контакти
- Телефони та email
- Соцмережі (Facebook, Instagram, Telegram) — іконки Lucide
- Copyright рядок знизу

Усі тексти через useTranslations() з messages/uk.json та en.json
```

### Phase 3 — Hero + Stats

```
Виконай Phase 3: Hero секція та блок статистики.

HERO (src/components/sections/Hero.tsx):
- min-h-screen, темно-синій фон з фото overlay
- bg: linear-gradient(to bottom, rgba(10,15,30,0.72), rgba(10,15,30,0.96)), url(hero-bg.jpg)
- По центру (або зліва — як savelife):
  - H1 Oswald великий: "Підтримуємо тих, хто захищає Україну"
  - Підзаголовок Montserrat: опис місії
  - Дві кнопки: "Допомогти зараз" (#E8401C) + "Дізнатись більше" (outline #4A9ECC)
- Scroll indicator знизу (стрілка з анімацією)

Анімації (Framer Motion):
- H1: opacity 0→1, y 30→0, duration 0.8s, delay 0.2s
- Subtitle: delay 0.4s
- Buttons: delay 0.6s

STATS STRIP (src/components/sections/Stats.tsx):
- Відразу під hero
- 4 картки: Допомог надано | Партнерів | Регіонів | Волонтерів
- bg-[#1A2744] border-y-2 border-[#4A9ECC]
- Числа великі Oswald, лічильник CountUp при появі у viewport
- Підпис Montserrat text-[#9BAAC4]

Дані статистики з content.uk.json → stats.items
```

### Phase 4 — Projects Section

```
Виконай Phase 4: Секція проєктів/зборів.

СЕКЦІЯ НА ГОЛОВНІЙ (src/components/sections/Projects.tsx):
- Заголовок "Поточні збори та проєкти" + лінк "Всі проєкти →"
- Filter tabs: Усі | Авто | Лікарні | Дрони | Медтехніка | Соціальні
  (синій підчерк активного табу #4A9ECC)
- Grid карток: 1→2→3 columns

PROJECT CARD (src/components/ui/ProjectCard.tsx):
- Image (next/image, 16:9 aspect)
- Category badge (синій, uppercase)
- Title (Oswald bold, 2 рядки max)
- Description (Montserrat, 3 рядки, clamp)
- ProgressBar: bg-[#1A2744] → fill gradient синій
- "Зібрано X грн з Y грн (Z%)" — форматування через Intl.NumberFormat
- Кнопка "Підтримати" — bg-[#4A9ECC]
- hover: translateY(-4px), синя тінь

Дані з /data/projects.json
При фільтрації — AnimatePresence (Framer Motion)
```

### Phase 5 — Donate Methods

```
Виконай Phase 5: "Як допомогти" + сторінка /donate

СЕКЦІЯ НА ГОЛОВНІЙ:
- 4 картки методів оплати (темні картки, синя іконка)
- Кожна: іконка Lucide + заголовок + опис + реквізити + "Скопіювати" кнопка
- Copy to clipboard з toast "Скопійовано!" (без зовнішньої бібліотеки)

СТОРІНКА /[locale]/donate:
- Повні банківські реквізити (IBAN, МФО, ЄДРПОУ, призначення)
- Картки для кожного методу оплати
- FAQ акордеон (без зовнішньої бібліотеки — useState)
- Кнопка "Назад" ←

Дані з content.uk.json → how_to_help та donate_page
```

### Phase 6 — Rehabilitation Center

```
Виконай Phase 6: Центр реабілітації.

СЕКЦІЯ НА ГОЛОВНІЙ (src/components/sections/RehabCenter.tsx):
- Відокремлений блок з іншим bg (bg-[#0F1F14] або чергування)
- Акцент: зелений #5BA05B замість синього
- Заголовок "Центр реабілітації" + підзаголовок
- 4 карточки напрямків (Психологічна | Фізична | Родини | Діти)
- CTA: "Записатись на консультацію" + телефон 096-145-11-55

СТОРІНКИ /[locale]/center/...:
- /center — головна центру (місія, візія)
- /center/services — напрямки роботи (4 секції з деталями)
- /center/team — картки спеціалістів (фото + ім'я + спеціалізація)
- /center/mobile-groups — мобільні групи (4 регіони)
- /center/branches — філіали (список + адреси)

Дані з content.uk.json → rehab_center та team.json
```

### Phase 7 — Reports & Partners

```
Виконай Phase 7: Звіти та Партнери.

REPORTS (src/components/sections/Reports.tsx + /[locale]/reports):
- Заголовок "Звіти та прозорість"
- Список квартальних/річних звітів (картки):
  - Назва + період
  - Короткий підсумок
  - 3 ключові цифри (зібрано / витрачено / проєктів)
  - Кнопка "Завантажити PDF" (іконка Download)
- Всі звіти — з /data/partners-reports-branches.json → reports

PARTNERS (src/components/sections/Partners.tsx):
- "Наші партнери"
- Логотипи партнерів у ряд (grayscale → кольоровий hover)
- З /data/partners-reports-branches.json → partners
```

### Phase 8 — Inner Pages

```
Виконай Phase 8: внутрішні сторінки.

1. /[locale]/about — Про фонд
   - Tabs: Історія | Загальна інформація | Фото | Команда
   - Текст з content.uk.json → about_fund
   - Команда — картки з team.json → fund_team

2. /[locale]/projects — Всі проєкти
   - Повна сітка зі всіма проєктами + фільтрація

3. /[locale]/projects/[slug] — Окремий проєкт
   - Повна картка: велике фото, опис, прогрес, реквізити
   - Кнопки поширення (FB, Telegram, copy link)

4. /[locale]/contacts — Контакти
   - Контакти Фонду та Центру
   - Форма зворотного зв'язку (useState, без backend)
   - Карта (iframe Google Maps або статичне зображення)

5. /[locale]/partners — Партнери повна сторінка
```

### Phase 9 — SEO & Performance

```
Виконай Phase 9: SEO та продуктивність.

1. metadata для кожної сторінки (next/metadata generateMetadata)
2. OpenGraph теги (og:title, og:image, og:description)
3. robots.txt та sitemap.xml (next.js автогенерація)
4. Перевір всі next/image — width/height обов'язково
5. Lazy loading для секцій нижче fold
6. Перевір мовний switcher — всі ключі перекладені в обох мовах
7. Перевір консоль — 0 помилок і попереджень
8. Accessibility: кожен button має aria-label або текст
```
