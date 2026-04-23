# Development Phases

## Phase 1 — Project Setup & Data Layer

**Goal**: Scaffold Next.js project, configure i18n, load JSON data.

### Tasks

- [ ] `npx create-next-app@latest --typescript --tailwind --app`
- [ ] Install dependencies:
  ```bash
  npm install next-intl framer-motion lucide-react clsx
  ```
- [ ] Configure `next.config.js` with next-intl middleware
- [ ] Create `/messages/uk.json` and `/messages/en.json`
- [ ] Load and type `/data/content.uk.json`, `/data/content.en.json`, `/data/projects.json`
- [ ] Set up `src/lib/i18n.ts` routing (locale: `uk` default, `en`)
- [ ] Configure Tailwind with custom colors from `CLAUDE.md`
- [ ] Set up `src/styles/globals.css` with CSS variables

### Deliverable

Running `npm run dev` shows blank page with correct locale routing (`/` → Ukrainian, `/en/` → English).

---

## Phase 2 — Layout: Header & Footer

**Goal**: Full-width navigation matching savelife.in.ua style.

### Header Features

- Sticky dark navbar (`bg-[#0D0D0D]`)
- Logo left (SVG/PNG from `/public/logo/`)
- Two-section nav: **Благодійний фонд** (dropdown menu)
- Mega-dropdown menus on hover
- Phone number (fund)
- Language switcher UA | EN
- "Допомогти" button (gold accent, always visible)

### Footer Features

- Dark background (`#0D0D0D`)
- Logo + mission tagline
- 4-column links grid
- Payment methods icons
- Social links (FB, Instagram, Telegram)
- Legal info + Copyright

### Components to create

```
src/components/layout/Header.tsx
src/components/layout/Footer.tsx
src/components/layout/Navigation.tsx
src/components/layout/MegaMenu.tsx
src/components/ui/LanguageSwitcher.tsx
src/components/ui/Button.tsx
```

### Deliverable

Header and footer render correctly on all pages, mobile hamburger works.

---

## Phase 3 — Homepage Hero Section

**Goal**: Full-screen dark hero like savelife.in.ua with dramatic impact.

### Hero Features

- Full viewport height (`100vh`)
- Dark overlay on background image/video
- **H1**: Large, bold — Foundation name
- **Subtitle**: Mission statement
- **Two CTAs**: "Допомогти зараз" (red button) + "Дізнатись більше" (outlined)
- Animated counter strip below hero:
  - Кількість допомог / Волонтерів / Регіонів / Партнерів
- Scroll indicator arrow

### Animation

- Framer Motion: fade-in headline stagger (0.1s delay per word)
- Counter animation: count up from 0 on scroll-into-view

### Component

```
src/components/sections/Hero.tsx
src/components/sections/Stats.tsx
```

---

## Phase 4 — Projects / Campaigns Section

**Goal**: Card grid showing active fundraising campaigns.

### Features

- Section title + "Всі проєкти" link
- Cards with:
  - Category badge (Лікарні / Авто / Дрони / Тактмед etc.)
  - Image
  - Title + short description
  - Progress bar (raised / goal)
  - Amount raised + % complete
  - "Підтримати" CTA button
- Filter tabs: All | Лікарні | Авто | Дрони | Соц. діяльність

### Data source

`/data/projects.json` → mapped to cards

### Component

```
src/components/sections/Projects.tsx
src/components/ui/ProjectCard.tsx
src/components/ui/ProgressBar.tsx
src/components/ui/FilterTabs.tsx
```

---

## Phase 5 — How to Help Section

**Goal**: Clear donation methods like savelife.in.ua.

### Features

- Section: "Як допомогти"
- 3–4 method cards:
  1. Банківський переказ (IBAN)
  2. PayPal / міжнародний переказ
  3. Monobank / ПриватБанк банки
  4. Крипто (якщо є)
- Each card: icon + title + details + copy button for account numbers
- "Реквізити" full page link

### Component

```
src/components/sections/HowToHelp.tsx
src/app/[locale]/donate/page.tsx
```

---

---


## Phase 7 — Reports & Transparency

**Goal**: Build trust with financial reports section.

### Features

- Annual/quarterly reports list
- PDF download links
- Key numbers summary (how money was spent)
- Partners logos carousel

### Component

```
src/app/[locale]/reports/page.tsx
src/components/sections/Reports.tsx
src/components/sections/Partners.tsx
```

---

## Phase 8 — Inner Pages

**Goal**: All remaining pages from navigation.

### Pages

- `/about` — History + General info + Gallery + Team
- `/projects/[slug]` — Single project page with full description
- `/projects/hospitals` — Hospitals sub-section
- `/projects/vehicles` — Special vehicles
- `/projects/drones` — Drones fundraising
- `/contacts` — Map + phones + form
- `/donate` — Full donation details page

---

## Phase 9 — Polish & Performance

**Goal**: Production-ready quality.

### Tasks

- [ ] SEO: metadata for all pages (next/metadata)
- [ ] OpenGraph images
- [ ] Accessibility audit (aria labels, contrast)
- [ ] Image optimization (next/image with WebP)
- [ ] Lighthouse score > 90
- [ ] PWA manifest
- [ ] Analytics placeholder (GA4)
- [ ] Mobile responsive QA (320px → 1440px)
- [ ] Cross-browser test

---

## Phase 10 — Deployment

**Goal**: Live production deployment.

### Tasks

- [ ] Configure environment variables
- [ ] Vercel deployment (or preferred host)
- [ ] Custom domain setup
- [ ] SSL certificate
- [ ] CDN for images

---

## Quick Start for Each Phase

At the start of each phase, tell Claude:

> "Починаємо Phase N — [Phase Name]. Дотримуйся CLAUDE.md та DESIGN.md."

## Homepage Hero Slider + Stats

```
Goal: Full-width hero slider like savelife.in.ua (light adaptation).

Hero Slider (src/components/sections/HeroSlider.tsx):

- embla-carousel-react for slider
- min-h-[80vh], light overlay on images
- H1: Oswald 56px text-[#1E293B]
- Subtitle: Montserrat 20px text-[#64748B]
- CTA buttons: "Допомогти зараз" (red) + "Дізнатись більше" (outline blue)
- Slider controls: блакитні крапки/стрілки
- Autoplay 5s, pause on hover

Stats Strip (src/components/sections/Stats.tsx):

- 4 картки: Допомог надано | Партнерів | Регіонів | Волонтерів
- bg-[#EFF6FF] border-y border-[#4A9ECC]/30
- Numbers: Oswald bold, CountUp animation on viewport enter
- Labels: Montserrat text-[#64748B]

Animations:

- Framer Motion: stagger fade-in for hero content
- CountUp for stats when in viewport

Deliverable: Hero slider + stats section working with sample data

```
