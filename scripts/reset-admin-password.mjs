#!/usr/bin/env node
/**
 * Скидання пароля адміністратора з сервера (коли поточний пароль забуто).
 *
 *   node scripts/reset-admin-password.mjs --email admin@example.com
 *   node scripts/reset-admin-password.mjs --email admin@example.com --password 'MyPass2026'
 *   node scripts/reset-admin-password.mjs --email admin@example.com --dry-run
 *
 * Без --password скрипт генерує випадковий пароль і друкує його один раз —
 * збереження не в логах, не в історії баші. Після скидання всі активні сесії
 * цього адміністратора стають недійсними (passwordChangedAt).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BCRYPT_ROUNDS = 12;
const MIN_LENGTH = 8;

function loadEnv() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) throw new Error('.env.local not found');
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

function parseArgs(argv) {
  const args = { email: null, password: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--email') args.email = argv[++i];
    else if (a === '--password') args.password = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

/** Пароль без схожих символів (0/O, 1/l/I) — його легко продиктувати/переписати. */
function generatePassword(length = 16) {
  const alphabet = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  // Гарантуємо цифру, інакше політика «літери + цифра» може не виконатись.
  return /\d/.test(out) ? out : `${out.slice(0, -1)}${(bytes[0] % 10)}`;
}

function usage() {
  console.log(`Usage:
  node scripts/reset-admin-password.mjs --email <email> [--password <plain>] [--dry-run]

  --email     адреса адміністратора (обов'язково, або --all у майбутньому)
  --password  задати конкретний пароль; без нього буде згенеровано випадковий
  --dry-run   нічого не змінювати, лише показати, що буде зроблено`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return usage();
  if (!args.email) {
    usage();
    throw new Error('--email is required');
  }

  const email = args.email.trim().toLowerCase();
  const password = args.password ?? generatePassword();

  if (password.length < MIN_LENGTH) {
    throw new Error(`Password must be at least ${MIN_LENGTH} characters`);
  }
  if (new TextEncoder().encode(password).length > 72) {
    throw new Error('Password is longer than 72 bytes (bcrypt limit)');
  }

  loadEnv();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!uri || !dbName) throw new Error('MONGODB_URI / MONGODB_DB missing');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      const admins = await db.collection('users').find({ role: 'admin' }).project({ email: 1 }).toArray();
      console.error(`No user with email "${email}" in "${dbName}".`);
      console.error(`Admins present: ${admins.map(a => a.email).join(', ') || '(none)'}`);
      process.exitCode = 1;
      return;
    }

    console.log(`Database: ${dbName}`);
    console.log(`User:     ${email} (role: ${user.role ?? 'unknown'})`);
    console.log(`Password: ${args.password ? '(з --password, не друкується)' : password}`);

    if (args.dryRun) {
      console.log('Dry run — nothing written.');
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const changedAt = new Date();
    const result = await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: { passwordHash, passwordChangedAt: changedAt, updatedAt: changedAt },
        $inc: { passwordVersion: 1 },
      },
    );

    console.log(`Updated:  modifiedCount=${result.modifiedCount}, passwordChangedAt=${changedAt.toISOString()}`);
    console.log('Усі попередні сесії цього адміністратора завершено.');
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
