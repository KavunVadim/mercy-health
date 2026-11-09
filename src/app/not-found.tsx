import NotFoundView from "@/components/NotFoundView/NotFoundView";

/** Шлях поза локалями (наприклад /nope-xyz): рендериться без [lang]-layout. */
export default function NotFound() {
  return <NotFoundView />;
}
