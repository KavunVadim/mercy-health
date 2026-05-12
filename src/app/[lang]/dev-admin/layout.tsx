import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mercy Admin Panel",
  robots: "noindex, nofollow",
};

export default function DevAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Isolated layout — intentionally omits global Header and Footer
  return <>{children}</>;
}
