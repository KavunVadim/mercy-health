# Mercy & Health Foundation

Сайт благодійного фонду «Милосердя та Здоров'я». Двомовний (UK/EN), з адмін-панеллю, новинами, проектами та звітами.

## Технології

- **Next.js 16** (App Router, Turbopack)
- **MongoDB** (через `mongodb` driver)
- **JWT** аутентифікація (httpOnly cookies)
- **AWS S3** для завантаження зображень
- **Sharp** для оптимізації зображень (WebP, resize)
- **Vitest** для тестів
- **Framer Motion** + **Embla Carousel** для анімацій

## Розробка

```bash
# Встановити залежності
npm install

# Запустити dev-сервер
npm run dev

# Запустити тести
npm test                  # одноразово
npm run test:watch        # в watch-режимі

# Перевірити типи
npm run typecheck

# Лінтінг
npm run lint

# Зібрати production-білд
npm run build
```

## Змінні оточення

Скопіюйте `.env.example` в `.env.local`:

```
# MongoDB
MONGODB_URI=mongodb+srv://...
MONGODB_DB=mercy-health

# JWT
JWT_SECRET=...

# Публічна URL (для OG, sitemap)
NEXT_PUBLIC_SITE_URL=https://example.com

# AWS S3 (опціонально — для завантаження фото)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-central-1
S3_BUCKET=...

# Telegram (опціонально — для сповіщень про помилки)
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# Gemini (опціонально — для AI-функцій)
GEMINI_API_KEY=...
```

**Обов'язкові:** `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`.

## Індекси MongoDB

Перед деплоєм створіть індекси:

```bash
npm run ensure-indexes
```

## Сценарії

| Команда | Призначення |
|---------|-------------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production-білд |
| `npm run start` | Запуск production-сервера |
| `npm run test` | Запуск тестів |
| `npm run typecheck` | Перевірка TypeScript |
| `npm run lint` | Лінтінг |
| `npm run seed` | Заповнення MongoDB початковими даними |
| `npm run ensure-indexes` | Створення індексів MongoDB |
| `npm run images:optimize` | Оптимізація зображень |

## Деплой на Vercel

1. Підключіть репозиторій до Vercel
2. Додайте всі змінні з `.env.local` в **Environment Variables** (Vercel Dashboard → Project → Settings → Environment Variables)
3. Деплой — Vercel автоматично визначить Next.js
4. **Важливо:** всі секрети (MongoDB, JWT, AWS, Telegram) мають бути замінені на production-значення

### Після деплою

1. Зайдіть на `/admin/register` щоб створити першого адміна
2. Заповніть контент через `/admin/content`
3. Перевірте `/api/health` — має повернути `{ "status": "ok" }`

## Структура проекту

```
src/
├── app/
│   ├── [lang]/          # Публічні сторінки (uk/en)
│   ├── admin/           # Адмін-панель
│   └── api/             # API-маршрути
│       ├── admin/       #   адмін API
│       ├── auth/        #   аутентифікація
│       ├── contact/     #   контактна форма
│       └── health/      #   health-check
├── components/          # Спільні компоненти
├── lib/                 # Утиліти, helpers
├── types/               # TypeScript типи
└── dictionaries/        # Статичні JSON-словники (uk/en)
```

