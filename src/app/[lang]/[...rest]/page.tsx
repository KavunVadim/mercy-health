import { notFound } from "next/navigation";

/**
 * Будь-який невідомий шлях усередині локалі (/uk/..., /en/...) має падати в
 * локальні not-found, а не в кореневий: інакше 404 рендериться без хедера,
 * футера й мовного тексту.
 */
export default function CatchAll() {
  notFound();
}
