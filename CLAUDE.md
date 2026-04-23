# Благодійний фонд «Милосердя та здоров'я» — Website Redesign

## Завдання

Адаптувати існуючий сайт **https://fond.specter-it.site** під дизайн і структуру референсу **https://savelife.in.ua**.

- Контент (тексти, фото) — береться з **fond.specter-it.site**
- Дизайн і структура — повторюємо логіку і стиль **savelife.in.ua**
- Логотип — голуб, основний колір: **блакитний / небесно-синій**
- Кольори сайту — темна база (як savelife) + блакитний акцент від логотипу
- Двомовність: **українська** (за замовчуванням) + **англійська**

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + CSS custom properties
- **Language**: TypeScript
- **i18n**: next-intl
- **Data**: JSON files (as DB — see `/data/`)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Color Palette — Логотип: Голуб (небесно-синій)

```
--color-accent:       #4A9ECC   /* небесно-синій — основний акцент */
--color-accent-dark:  #2E7DA8   /* темніший синій — hover */
--color-accent-light: #7BBFE0   /* світліший синій — фони */
--color-bg-hero:      #0A0F1E   /* темний синьо-чорний — hero/navbar */
--color-bg-dark:      #111827   /* темний — секції */
--color-bg-mid:       #1A2744   /* темно-синій — картки */
--color-bg-light:     #F0F4F8   /* світлий — контрастні секції */
--color-donate:       #E8401C   /* яскравий червоно-оранжевий — Допомогти (як savelife) */
--color-donate-hover: #C9340F
--color-text-primary: #FFFFFF
--color-text-secondary: #9BAAC4
--color-border:       rgba(74, 158, 204, 0.25)
```

## Project Structure

```
/
├── CLAUDE.md
├── PHASES.md
├── DESIGN.md
├── DATA_SCHEMA.md
├── PROMPT.md
├── data/
│   ├── content.uk.json
│   ├── content.en.json
│   ├── projects.json
│   ├── team.json
│   └── partners-reports-branches.json
├── public/
│   ├── logo/
│   └── images/          ← беремо з fond.specter-it.site
├── src/
│   ├── app/[lang]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── projects/
│   │   ├── reports/
│   │   ├── partners/
│   │   ├── contacts/
│   │   └── donate/
│   ├── components/
│   │   ├── layout/ (Header, Footer, Navigation)
│   │   ├── sections/ (Hero, Stats, Projects, HowToHelp, Reports, Partners)
│   │   └── ui/ (Button, Card, ProgressBar, LanguageSwitcher)
│   ├── lib/ (i18n.ts, utils.ts)
│   └── styles/globals.css
└── messages/ (uk.json, en.json)
```

## Ключові принципи дизайну (savelife.in.ua адаптація)

1. **Темний hero** — темно-синій фон (#0A0F1E), великий bold заголовок
2. **Кнопка "Допомогти"** — яскравий червоно-оранжевий (#E8401C), завжди видима
3. **Блакитний акцент** (#4A9ECC) — іконки, лінії, прогрес-бари, підкреслення
4. **Лічильники** — анімовані цифри впливу (Framer Motion countUp)
5. **Картки проєктів** — з прогрес-баром збору коштів
6. **Mobile-first** — більшість донорів з телефону
7. **Прозорість** — звіти на видному місці

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run type-check
```
