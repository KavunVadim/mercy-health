// src/lib/seed.ts
import { getDb, closeDb } from "./mongodb";
import bcrypt from "bcryptjs";

// -------------------- 1. Data preparation --------------------
const adminEmail = process.env.ADMIN_USERNAME ?? "admin@example.com";
const adminPasswordHash =
  process.env.ADMIN_PASSWORD_HASH ?? bcrypt.hashSync("123456", 10);

const newsSeed = [
  {
    title: "Ласкаво просимо до Mercy Health",
    slug: "welcome",
    excerpt: "Перший запис новин у вашій новій системі.",
    content: "<p>Тут можна розмістити довільний HTML‑контент.</p>",
    image: "/images/news/welcome.jpg",
    createdAt: new Date(),
  },
  {
    title: "Оновлення проєктів",
    slug: "projects-update",
    excerpt: "Новини про наші проєкти.",
    content: "<p>Короткий огляд нових ініціатив.</p>",
    image: "/images/news/projects.jpg",
    createdAt: new Date(),
  },
];

const projectsSeed = [
  {
    name: "Demo Project",
    description: "Приклад проєкту для адмін‑панелі.",
    status: "active",
    createdAt: new Date(),
  },
  {
    name: "Health Survey",
    description: "Опитування пацієнтів щодо якості обслуговування.",
    status: "planned",
    createdAt: new Date(),
  },
];

const photosSeed = [
  {
    title: "Місто вранці",
    url: "/images/gallery/city-morning.jpg",
    alt: "Свіже місто вранці",
    createdAt: new Date(),
  },
  {
    title: "Команда Mercy Health",
    url: "/images/gallery/team.jpg",
    alt: "Фотографія команди",
    createdAt: new Date(),
  },
];

// -------------------- 2. Insertion --------------------
async function main() {
  const db = await getDb();

  await db.collection("users").insertOne({
    email: adminEmail,
    passwordHash: adminPasswordHash,
    role: "admin",
  });

  await db.collection("news").insertMany(newsSeed);
  await db.collection("projects").insertMany(projectsSeed);
  await db.collection("photos").insertMany(photosSeed);

  console.log("✅ Seed data inserted successfully");
  await closeDb();
}

main().catch((err) => {
  console.error("❌ Seed script error:", err);
  process.exit(1);
});
