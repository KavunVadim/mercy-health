const REQUIRED_KEYS = [
  'MONGODB_URI',
  'MONGODB_DB',
  'JWT_SECRET',
] as const;

const PUBLIC_KEYS = [
  'NEXT_PUBLIC_SITE_URL',
] as const;

function getEnv() {
  const missing: string[] = [];

  for (const key of REQUIRED_KEYS) {
    if (!process.env[key]) missing.push(key);
  }

  for (const key of PUBLIC_KEYS) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  ${missing.join('\n  ')}\n\nEnsure they are defined in .env.local`,
    );
  }
}

if (typeof globalThis !== 'undefined') {
  try {
    getEnv();
  } catch {
    // Thrown during build but we want build to fail, so re-throw
    throw new Error('Environment validation failed. Set required env vars before building.');
  }
}

export const env = {
  MONGODB_URI: process.env.MONGODB_URI!,
  MONGODB_DB: process.env.MONGODB_DB!,
  JWT_SECRET: process.env.JWT_SECRET!,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  S3_BUCKET: process.env.S3_BUCKET,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
} as const;
